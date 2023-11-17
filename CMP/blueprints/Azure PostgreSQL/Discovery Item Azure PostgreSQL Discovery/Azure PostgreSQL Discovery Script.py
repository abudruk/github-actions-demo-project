import azure.mgmt.resource.resources as resources
from azure.mgmt.rdbms import postgresql
from msrestazure.azure_exceptions import CloudError
from azure.core.exceptions import AzureError,ResourceNotFoundError
from resourcehandlers.azure_arm.azure_wrapper import URI

from common.methods import set_progress
from resourcehandlers.azure_arm.models import AzureARMHandler

RESOURCE_IDENTIFIER = "azure_database_name"


def get_tenant_id_for_azure(handler):
    '''
        Handling Azure RH table changes for older and newer versions (> 9.4.5)
    '''
    if hasattr(handler,"azure_tenant_id"):
        return handler.azure_tenant_id

    return handler.tenant_id


def discover_resources(**kwargs):

    discovered_azure_sql = []
    for handler in AzureARMHandler.objects.all():
        set_progress(
            "Connecting to Azure Postgresql \
        DB for handler: {}".format(
                handler
            )
        )
        
        wrapper = handler.get_api_wrapper()
        
        azure_client = postgresql.PostgreSQLManagementClient(
            wrapper.credentials, handler.serviceaccount
        )
        azure_resources_client = wrapper.resource_client

        # for resource_group in azure_resources_client.resource_groups.list():
        for server in azure_client.servers.list():
            resource_group_name = URI(server.id).resource_group_name
            try:
                azure_client.databases.list_by_server(resource_group_name, server.name)
            except ResourceNotFoundError:
                set_progress("Azure DB server '{}' not found under resource group '{}'".format(server.name,resource_group.name))
                continue
            else:
                try:
                    for db in azure_client.databases.list_by_server(
                        resource_group_name, server.name
                    ):
                        if db.name in [
                            "azure_maintenance",
                            "azure_sys",
                            "postgres",
                        ]:
                            continue
                        discovered_azure_sql.append(
                            {
                                "name": server.name,
                                "azure_server_name": server.name,
                                "azure_database_name": db.name,
                                "resource_group_name": resource_group_name,
                                "azure_rh_id": handler.id,
                            }
                        )
                except (CloudError, AzureError) as e:
                    set_progress("Azure Error: {}".format(e))
                    continue

    return discovered_azure_sql