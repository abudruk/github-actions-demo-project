"""
Creates an CosmosDB database in Azure.
"""
import settings

import azure.mgmt.cosmosdb as cosmosdb
from azure.common.credentials import ServicePrincipalCredentials
from msrestazure.azure_exceptions import CloudError

from common.methods import is_version_newer, set_progress
from infrastructure.models import CustomField
from infrastructure.models import Environment
from utilities.exceptions import CloudBoltException
from azure.identity import ClientSecretCredential


cb_version = settings.VERSION_INFO["VERSION"]
CB_VERSION_93_PLUS = is_version_newer(cb_version, "9.2.1")


def get_tenant_id_for_azure(handler):
    '''
        Handling Azure RH table changes for older and newer versions (> 9.4.5)
    '''
    if hasattr(handler,"azure_tenant_id"):
        return handler.azure_tenant_id

    return handler.tenant_id

def _get_client(handler):
    """
    Get the client using newer methods from the CloudBolt main repo if this CB is running
    a version greater than 9.2. These internal methods implicitly take care of much of the other
    features in CloudBolt such as proxy and ssl verification.
    Otherwise, manually instantiate clients without support for those other CloudBolt settings.
    """
    if CB_VERSION_93_PLUS:
        from resourcehandlers.azure_arm.azure_wrapper import configure_arm_client

        wrapper = handler.get_api_wrapper()
        cosmosdb_client = configure_arm_client(wrapper, cosmosdb.CosmosDBManagementClient)
    else:
        # TODO: Remove once versions <= 9.2 are no longer supported.
        credentials = ClientSecretCredential(
            client_id=handler.client_id,
            client_secret=handler.secret,
            tenant_id=get_tenant_id_for_azure(handler)
        )
        cosmosdb_client = cosmosdb.CosmosDBManagementClient(credentials, handler.serviceaccount)

    set_progress("Connection to Azure established")

    return cosmosdb_client


def generate_options_for_azure_env_id(server=None, **kwargs):
    options = [('', '--Select Environment--')]
    # options = []
    envs = Environment.objects.filter(
        resource_handler__resource_technology__name="Azure"
    )

    options.extend([(env.id, env.name) for env in envs])
    return options


def generate_options_for_resource_group(control_value=None, **kwargs):
    """Dynamically generate options for resource group form field based on the user's selection for Environment.
    
    This method requires the user to set the resource_group parameter as dependent on environment.
    """
    set_progress("$"*55)
    set_progress(f"control_value : {control_value}")
    set_progress(f"kwargs : {kwargs.items()}")
    if control_value in [None,""]:
        return []
    if control_value:
        # return [(control_value,control_value)]
        env = Environment.objects.get(id=int(control_value))
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
        name="azure_account_name",
        type="STR",
        defaults={
            "label": "Azure Account Name",
            "description": "Used by the Azure blueprints",
            "show_as_attribute": True,
        },
    )

    CustomField.objects.get_or_create(
        name="azure_location",
        type="STR",
        defaults={
            "label": "Azure Location",
            "description": "Used by the Azure blueprints",
            "show_as_attribute": True,
        },
    )

    CustomField.objects.get_or_create(
        name="resource_group_name",
        type="STR",
        defaults={
            "label": "Azure Resource Group",
            "description": "Used by the Azure blueprints",
            "show_as_attribute": True,
        },
    )


def run(job, **kwargs):
    resource = kwargs.get("resource")
    create_custom_fields_as_needed()

    azure_env_id = "{{ azure_env_id }}"
    env = Environment.objects.get(id=azure_env_id)
    rh = env.resource_handler.cast()
    location = env.node_location
    set_progress("Location: %s" % location)

    resource_group = "{{ resource_group }}"
    account_name = "{{ account_name }}"
    
    client = _get_client(rh)

    # Missing dataa
    server_params = {
        "location": location,
        "version": "12.0",
        "administrator_login": "mysecretname",
        "administrator_login_password": "HusH_Sec4et",
        "locations": [{"location_name": location}],
    }

    set_progress("Creating database %s..." % account_name)

    try:
        command = client.database_accounts.begin_create_or_update(
            resource_group, account_name, server_params,
        )
    except CloudError as e:
        msg = """The Azure Cosmos DB API was not able to connect.
                                     Please verify that you listed a valid Account Name.
                                     The account name provided was {}.
                                     Please see the Azure docs for more information
                                     https://docs.microsoft.com/en-us/azure/templates/microsoft.documentdb/2015-04-01/databaseaccounts.
                                """.format(
            account_name
        )
        raise CloudBoltException(msg) from e

    while not command.done():
        set_progress("Waiting for database to be created...")
        command.wait(20)

    # resource.name = "Azure CosmosDB - " + account_name
    resource.name = account_name
    resource.azure_account_name = account_name
    resource.resource_group_name = resource_group
    resource.azure_location = location
    resource.azure_rh_id = rh.id
    resource.save()

    # Verify that we can connect to the new database
    set_progress("Verifying the connection to the new database...")
    db = client.database_accounts.get(resource_group, account_name)  # noqa: F841
    set_progress("Database %s has been created." % account_name)