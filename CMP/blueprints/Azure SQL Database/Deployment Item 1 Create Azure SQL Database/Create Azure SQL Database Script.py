"""
Creates an SQL database in Azure.
"""
from typing import List
import settings
from azure.common.credentials import ServicePrincipalCredentials
from azure.mgmt import sql
from accounts.models import Group
from common.methods import is_version_newer, set_progress
from infrastructure.models import CustomField, Environment
from azure.identity import ClientSecretCredential
from azure.core.exceptions import ResourceNotFoundError


cb_version = settings.VERSION_INFO["VERSION"]
CB_VERSION_93_PLUS = is_version_newer(cb_version, "9.2.1")


def get_tenant_id_for_azure(handler):
    '''
        Handling Azure RH table changes for older and newer versions (> 9.4.5)
    '''
    if hasattr(handler,"azure_tenant_id"):
        return handler.azure_tenant_id

    return handler.tenant_id


def generate_options_for_azure_region(**kwargs):
    group_name = kwargs["group"]

    try:
        group = Group.objects.get(name=group_name)
    except Exception as err:
        return []
    
    # fetch all group environment
    envs = group.get_available_environments()
    
    options=[(env.id, env.name) for env in envs if env.resource_handler.resource_technology.name == "Azure" ]

    if not options:
        raise RuntimeError(
            "No valid Environments on Azure resource handlers in CloudBolt"
        )

    return options
    

def generate_options_for_resource_group(control_value=None, **kwargs):
    """Dynamically generate options for resource group form field based on the user's selection for Environment.
    
    This method requires the user to set the resource_group parameter as dependent on environment.
    """
    if control_value is None:
        return []

    env = Environment.objects.get(id=control_value)

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
            "label": "Azure RH ID",
            "description": "Used by the Azure blueprints",
            "show_as_attribute": True,
        },
    )

    CustomField.objects.get_or_create(
        name="azure_database_name",
        type="STR",
        defaults={
            "label": "Azure Database Name",
            "description": "Used by the Azure blueprints",
            "show_as_attribute": True,
            "show_on_servers": True
        },
    )

    CustomField.objects.get_or_create(
        name="azure_server_name",
        type="STR",
        defaults={
            "label": "Azure Server Name",
            "description": "Used by the Azure blueprints",
            "show_as_attribute": True,
            "show_on_servers": True
        },
    )

    CustomField.objects.get_or_create(
        name="azure_location",
        type="STR",
        defaults={
            "label": "Azure Location",
            "description": "Used by the Azure blueprints",
            "show_as_attribute": True,
            "show_on_servers": True
        },
    )

    CustomField.objects.get_or_create(
        name="resource_group_name",
        type="STR",
        defaults={
            "label": "Azure Resource Group",
            "description": "Used by the Azure blueprints",
            "show_as_attribute": True,
            "show_on_servers": True
        },
    )
    
    CustomField.objects.get_or_create(
        name="azure_database_id",
        type="STR",
        defaults={
            "label": "Azure Database ID",
            "description": "Used by the Azure blueprints",
        },
    )

def _get_client(handler):
    """
    Get the client using newer methods from the CloudBolt main repo if this CB is running
    a version greater than 9.2.1. These internal methods implicitly take care of much of the other
    features in CloudBolt such as proxy and ssl verification.
    Otherwise, manually instantiate clients without support for those other CloudBolt settings.
    """
    if CB_VERSION_93_PLUS:
        from resourcehandlers.azure_arm.azure_wrapper import configure_arm_client

        wrapper = handler.get_api_wrapper()
        sql_client = configure_arm_client(wrapper, sql.SqlManagementClient)
    else:
        # TODO: Remove once versions <= 9.2.1 are no longer supported.
        credentials = ClientSecretCredential(
            client_id=rh.client_id,
            client_secret=rh.secret,
            tenant_id=get_tenant_id_for_azure(rh)
        )
        sql_client = sql.SqlManagementClient(credentials, handler.serviceaccount)

    set_progress("Connection to Azure established")

    return sql_client


def run(job, **kwargs):
    resource = kwargs.get("resource")
    
    # get or create custom field as needed 
    create_custom_fields_as_needed()

    azure_region = "{{azure_region}}"
    
    env = Environment.objects.get(id=azure_region)
    
    rh = env.resource_handler.cast()
    
    location = env.node_location
    
    set_progress("Location: %s" % location)

    resource_group = "{{ resource_group }}"

    database_name = "{{ database_name }}"

    server_name = database_name + "-server"

    server_username = "{{ server_username }}"
    server_password = "{{ server_password }}"

    sql_client = _get_client(rh)

    set_progress('Creating server "%s"...' % server_name)
    params = {
        "location": location,
        "version": "12.0",
        "administrator_login": server_username,
        "administrator_login_password": server_password,
    }
    async_server_create = sql_client.servers.begin_create_or_update(
        resource_group, server_name, params,
    )
    while not async_server_create.done():
        set_progress("Waiting for sql server account to be created...")
        async_server_create.wait(20)

    set_progress(
        'Creating database "%s" on server "%s"...' % (database_name, server_name)
    )
    async_db_create = sql_client.databases.begin_create_or_update(
        resource_group, server_name, database_name, {"location": location}
    )
    # Wait for completion and return created object
    while not async_db_create.done():
        set_progress("Waiting for sql database account to be created...")
        async_db_create.wait(20)

    database = async_db_create.result()
    assert database.name == database_name

    db = sql_client.databases.get(resource_group, server_name, database_name)
    assert db.name == database_name

    resource.name = db.name
    resource.azure_server_name = server_name
    resource.azure_database_name = db.name
    resource.azure_database_id = db.id
    resource.resource_group_name = resource_group
    resource.azure_location = location
    resource.azure_rh_id = rh.id
    resource.save()

    set_progress('Database "%s" has been created.' % database_name)