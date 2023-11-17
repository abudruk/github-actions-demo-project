"""
Creates an MariaDB in Azure.
"""
from azure.common.credentials import ServicePrincipalCredentials
from azure.mgmt.rdbms import mariadb
from msrestazure.azure_exceptions import CloudError

from typing import List
import settings

from common.methods import is_version_newer, set_progress
from infrastructure.models import CustomField, Environment
from accounts.models import Group
from azure.identity import ClientSecretCredential
from azure.core.exceptions import ResourceNotFoundError

CB_VERSION_93_PLUS = is_version_newer(settings.VERSION_INFO["VERSION"], "9.2.2")


def get_tenant_id_for_azure(handler):
    '''
        Handling Azure RH table changes for older and newer versions (> 9.4.5)
    '''
    if hasattr(handler,"azure_tenant_id"):
        return handler.azure_tenant_id

    return handler.tenant_id

def generate_options_for_env_id(server=None, **kwargs):
    group_name = kwargs["group"]
    
    try:
        group = Group.objects.get(name=group_name)
    except Exception as err:
        return []
    
    # fetch all group environment
    envs = [env for env in group.get_available_environments() if env.resource_handler]  # Skip orphan enviroment
    azure_envs= [env for env in envs if env.resource_handler.resource_technology.name == "Azure"]
    
    options = [(env.id, env.name) for env in azure_envs]
    
    return options

def generate_options_for_resource_group(control_value=None, **kwargs) -> List:
    """
        Dynamically generate options for resource group form field based on the user's selection for Environment.
    """
    
    if control_value is None or control_value == "":
        return []

    # Get the environment
    env = Environment.objects.get(id=control_value)

    # Adding backwords version compatibility to this
    if CB_VERSION_93_PLUS:
        # Get the Resource Groups as defined on the Environment. The Resource Group is a
        # CustomField that is only updated on the Env when the user syncs this field on the
        # Environment specific parameters.
        resource_groups = env.custom_field_options.filter(
            field__name="resource_group_arm"
        )
        return [rg.str_value for rg in resource_groups]
    else:
        rh = env.resource_handler.cast()
        groups = rh.armresourcegroup_set.all()
        return [g.name for g in groups]


def create_custom_fields_as_needed():
    CustomField.objects.get_or_create(
        name="azure_rh_id",
        type="STR",
        defaults={
            "label": "RH ID",
            "description": "Used by the Azure blueprints"
        },
    )

    CustomField.objects.get_or_create(
        name="azure_database_name",
        type="STR",
        defaults={
            "label": "Database Name",
            "description": "Used by the Azure blueprints",
            "show_as_attribute": True, 'show_on_servers': True,
        },
    )

    CustomField.objects.get_or_create(
        name="azure_server_name",
        type="STR",
        defaults={
            "label": "Server Name",
            "description": "Used by the Azure blueprints",
            "show_as_attribute": True,
        },
    )

    CustomField.objects.get_or_create(
        name="azure_location",
        type="STR",
        defaults={
            "label": "Location",
            "description": "Used by the Azure blueprints",
            "show_as_attribute": True,
        },
    )

    CustomField.objects.get_or_create(
        name="resource_group_name",
        type="STR",
        defaults={
            "label": "Resource Group",
            "description": "Used by the Azure blueprints",
            "show_as_attribute": True,
        },
    )

    CustomField.objects.get_or_create(
        name="azure_database_server_id",
        type="STR",
        defaults={
            "label": "Database Server ID",
            "description": "Used by the Azure blueprints"
        },
    )

def run(job, **kwargs):
    resource = kwargs.get("resource")
    
    # get or create custom fields if needed
    create_custom_fields_as_needed()


    resource_group = "{{ resource_group }}"
    env = Environment.objects.get(id="{{ env_id }}")
    database_name = "{{ database_name }}"
    server_username = "{{ server_username }}"
    server_password = "{{ server_password }}"
    server_name = database_name + "-server"
    
    rh = env.resource_handler.cast()

    set_progress("Connecting To Azure...")
    credentials = ClientSecretCredential(
        client_id=rh.client_id,
        client_secret=rh.secret,
        tenant_id=get_tenant_id_for_azure(rh)
    )
    client = mariadb.MariaDBManagementClient(credentials, rh.serviceaccount)
    
    set_progress("Connection to Azure established")
    set_progress('Checking if server "%s" already exists...' % server_name)
    
    try:
        client.servers.get(resource_group, server_name)
    except CloudError as e:
        set_progress("Azure Clouderror: {}".format(e))
    except ResourceNotFoundError as e:
        set_progress('Azure SQL Database name: {} is available'.format(server_name))
    else:
        # No ResourceNotFound exception; server already exists
        return (
            "FAILURE",
            "Database server already exists",
            "DB server instance %s exists already" % server_name,
        )

    set_progress('Creating server "%s"...' % server_name)
    
    params = {
        "location": env.node_location,
        "version": "12.0",
        "administrator_login": server_username,
        "administrator_login_password": server_password,
        "properties": {
            "create_mode": "Default",
            "administrator_login": server_username,
            "administrator_login_password": server_password,
        },
    }
    async_server_create = client.servers.begin_create(resource_group, server_name, params,)
    async_server_create.result()

    set_progress('Creating database "%s" on server "%s"...' % (database_name, server_name))
    
    async_db_create = client.databases.begin_create_or_update(resource_group, server_name, database_name, {"location": env.node_location})
    
    database = async_db_create.result()  # Wait for completion and return created object
    assert database.name == database_name

    db = client.databases.get(resource_group, server_name, database_name)
    assert db.name == database_name
    
    resource.azure_database_server_id = db.id
    resource.name = server_name
    resource.azure_server_name = server_name
    resource.azure_database_name = database_name
    resource.resource_group_name = resource_group
    resource.azure_location = env.node_location
    resource.azure_rh_id = rh.id
    resource.save()

    set_progress('Database "%s" has been created.' % database_name)
    
    return "SUCCESS", "Maria DB created successfully", ""