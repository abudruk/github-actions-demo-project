"""
Deletes an Azure Storage File
"""
from common.methods import set_progress
from resourcehandlers.azure_arm.models import AzureARMHandler
from azure.storage.file import FileService

def run(job, **kwargs):
    resource = kwargs.pop('resources').first()
    
    cf_value = resource.get_cf_values_as_dict()
    
    azure_storage_account_name = cf_value.get('azure_storage_account_name', '')
    azure_account_key = cf_value.get('azure_account_key', '')
    
    if azure_storage_account_name == "" or azure_account_key =="":
        return "WARNING", F"The file hasn't been uploaded to the { resource.name} folder, it may be provision failed", ""
        
    set_progress("Connecting To Azure File Service...")
    
    # get file service object
    file_service = FileService(account_name=azure_storage_account_name, account_key=azure_account_key)

    set_progress("Connection to Azure established")
    
    share_name = cf_value.get('azure_storage_file_share_name', '')
    file_name = cf_value.get('azure_storage_file_name', '')
    
    if share_name == "" or file_name =="":
        return "SUCCESS", "File deleted successfully.", ""
    
    set_progress("Deleting file %s..." % file_name)
    
    # delete file
    file_service.delete_file(file_name=file_name, share_name=share_name, directory_name='')
    
    # delete folder
    file_service.delete_share(share_name=share_name)
    
    return "SUCCESS", "File deleted successfully.", ""