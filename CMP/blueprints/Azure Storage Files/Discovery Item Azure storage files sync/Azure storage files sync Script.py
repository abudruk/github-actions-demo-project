"""
Discover Azure storage files
"""
from azure.identity import ClientSecretCredential
import azure.mgmt.storage as storage
import azure.mgmt.resource.resources as resources
from azure.storage.file import FileService
from azure.storage.file.models import File
from msrestazure.azure_exceptions import CloudError

from common.methods import set_progress
from resourcehandlers.azure_arm.models import AzureARMHandler
from infrastructure.models import CustomField


RESOURCE_IDENTIFIER = "azure_file_identifier"

def get_tenant_id_for_azure(handler):
    '''
        Handling Azure RH table changes for older and newer versions (> 9.4.5)
    '''
    if hasattr(handler,"azure_tenant_id"):
        return handler.azure_tenant_id
    
    return handler.tenant_id

def create_custom_fields_as_needed():
    CustomField.objects.get_or_create(
        name='azure_storage_account_name', type='STR',
        defaults={'label':'Storage Account Name', 'description':'Storage account name where the file resides', 'show_as_attribute':True, 'show_on_servers': True}
    )

    CustomField.objects.get_or_create(
        name='azure_storage_file_name', type='STR',
        defaults={'label':'File Name', 'description':'The given name for this file', 'show_as_attribute':True, 'show_on_servers': True}
    )

    CustomField.objects.get_or_create(
        name='azure_account_key', type='STR',
        defaults={'label':'Account Key', 'description':'Used to authenticate this blueprint when making requests to Azure storage account', 'show_as_attribute':True, 'show_on_servers': True}
    )

    CustomField.objects.get_or_create(
        name='azure_account_key_fallback', type='STR',
        defaults={'label':'Account Key Fallback', 'description':'Used to authenticate this blueprint when making requests to Azure storage account', 'show_as_attribute':True, 'show_on_servers': True}
    )

    CustomField.objects.get_or_create(
        name='azure_storage_file_share_name', type='STR',
        defaults={'label':'Share Name', 'description':'Share where this files resides in'}
    )
    
    
def discover_resources(**kwargs):
    discovered_azure_sql = []
    
    # get or create custom fields if needed
    create_custom_fields_as_needed()
    
    for handler in AzureARMHandler.objects.all():
        
        set_progress('Connecting to Azure storage files for handler: {}'.format(handler))
        
        wrapper = handler.get_api_wrapper()
        
        azure_client = wrapper.storage_client
        azure_resources_client = wrapper.resource_client

        for resource_group in azure_resources_client.resource_groups.list():
            try:
                for st in azure_client.storage_accounts.list_by_resource_group(resource_group.name):
                    
                    try:
                        res = azure_client.storage_accounts.list_keys(resource_group.name, st.name)
                    except Exception as err:
                        continue
                    
                    keys = res.keys
                    file_service = FileService(
                        account_name=st.name, account_key=keys[1].value)
                    
                    for share in file_service.list_shares():
                        
                        for file in file_service.list_directories_and_files(share_name=share.name):
                            
                            if type(file) is File:
                                set_progress("Found '{}' file in '{}' file share from '{}' storage account in '{}' resource group".format(file.name,share.name,st.name,resource_group.name))
                                
                                data = {
                                    'name': share.name,
                                    'azure_storage_file_name': file.name,
                                    'azure_file_identifier': share.name + '_' + file.name,
                                    'resource_group_name': resource_group.name,
                                    'azure_rh_id': handler.id,
                                    'azure_storage_account_name': st.name,
                                    'azure_account_key': keys[0].value,
                                    'azure_account_key_fallback': keys[1].value,
                                    'azure_storage_file_share_name': share.name
                                }
                                
                                if data not in discovered_azure_sql:
                                    discovered_azure_sql.append(data)
                                
            except Exception as e:
                raise e
                
    return discovered_azure_sql