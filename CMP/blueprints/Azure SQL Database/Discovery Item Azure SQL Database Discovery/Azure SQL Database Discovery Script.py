from azure.common.credentials import ServicePrincipalCredentials
from azure.mgmt import sql
from msrestazure.azure_exceptions import CloudError
from infrastructure.models import CustomField
from common.methods import set_progress
from resourcehandlers.azure_arm.models import AzureARMHandler


RESOURCE_IDENTIFIER = "azure_database_id"


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
    a version greater than 9.2.1. These internal methods implicitly take care of much of the other
    features in CloudBolt such as proxy and ssl verification.
    Otherwise, manually instantiate clients without support for those other CloudBolt settings.
    """
    import settings
    from common.methods import is_version_newer

    cb_version = settings.VERSION_INFO["VERSION"]
    if is_version_newer(cb_version, "9.2.1"):
        from resourcehandlers.azure_arm.azure_wrapper import configure_arm_client

        wrapper = handler.get_api_wrapper()
        sql_client = configure_arm_client(wrapper, sql.SqlManagementClient)
    else:
        # TODO: Remove once versions <= 9.2.1 are no longer supported.
        credentials = ServicePrincipalCredentials(
            client_id=handler.client_id, secret=handler.secret, tenant=get_tenant_id_for_azure(handler)
        )
        sql_client = sql.SqlManagementClient(credentials, handler.serviceaccount)

    set_progress("Connection to Azure established")

    return sql_client

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
    
    
def discover_resources(**kwargs):
    
    # get or create custom fields
    create_custom_fields_as_needed()
    
    discovered_azure_sql = []
    for handler in AzureARMHandler.objects.all():
        set_progress("Connecting to Azure sql DB for handler: {}".format(handler))

        sql_client = _get_client(handler)

        for server in sql_client.servers.list():
            try:
                for db in sql_client.databases.list_by_server(
                    server.as_dict()["id"].split("/")[-5], server.name
                ):
                    if db.name == "master":
                        continue
                    discovered_azure_sql.append(
                        {
                            "name": db.name,
                            "azure_database_id": db.id,
                            # "azure_server_name": server.name + "-server",
                            "azure_server_name": server.name,
                            "azure_database_name": db.name,
                            "resource_group_name": server.as_dict()["id"].split("/")[-5],
                            "azure_rh_id": handler.id,
                            "azure_location": db.location,
                        }
                    )
            except CloudError as e:
                set_progress("Azure Clouderror: {}".format(e))
                continue

    return discovered_azure_sql