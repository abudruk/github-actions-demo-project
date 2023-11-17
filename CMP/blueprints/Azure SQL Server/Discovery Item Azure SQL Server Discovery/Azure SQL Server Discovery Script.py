from common.methods import set_progress
from resourcehandlers.azure_arm.models import AzureARMHandler
from azure.mgmt.sql import SqlManagementClient
from msrestazure.azure_exceptions import CloudError
from azure.core.exceptions import AzureError
import azure.mgmt.resource.resources as resources


RESOURCE_IDENTIFIER = 'azure_server_name'


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
        set_progress('Connecting to Azure sql \
        DB for handler: {}'.format(handler))
        
        wrapper = handler.get_api_wrapper()
        
        azure_client = SqlManagementClient(wrapper.credentials, handler.serviceaccount)
        azure_resources_client = wrapper.resource_client

        for resource_group in azure_resources_client.resource_groups.list():
            try:
                for server in azure_client.servers.list_by_resource_group(resource_group.name):
                    discovered_azure_sql.append(
                            {
                                'name': server.name,
                                'azure_server_name': server.name,
                                'resource_group_name': resource_group.name,
                                'azure_rh_id': handler.id
                            }
                        )
            except (CloudError, AzureError):
                continue

    return discovered_azure_sql