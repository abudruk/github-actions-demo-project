from common.methods import set_progress
from azure.storage.blob import BlobServiceClient, PublicAccess
from resources.models import Resource
from utilities.logger import ThreadLogger
from resourcehandlers.azure_arm.models import AzureARMHandler
from azure.core.exceptions import ResourceNotFoundError

logger = ThreadLogger(__name__)


def generate_options_for_blob_name(server=None, **kwargs):
    """
    Generate delete blob options
    """
    resource = kwargs.get('resource', None)
    options = []
    if resource is None:
        return options

    sub_resources = Resource.objects.filter(parent_resource_id=resource.id, lifecycle="ACTIVE")

    for sub_resource in sub_resources:
            options.append((sub_resource.id, sub_resource.name))

    return options


def delete_blob(job, resource, blob_object, block_blob_service):
    """
    Delete selected blob present inside azure storage container 
    """
    # check for container presence inside azure storage
    try:
        job.set_progress('Deleting blob {0}...'.format(blob_object.name))
        blob_client = block_blob_service.get_blob_client(container=resource.azure_container_name, blob=blob_object.name)
        blob_client.delete_blob()
    except Exception as error:
        return "FAILURE", f"Failed to delete blob '{blob_object.name}'", f"{error}"
    except ResourceNotFoundError:
        return "FAILURE", f"Failed to delete Blob.'", f"Container don't exist."
        

def run(job, resource, *args, **kwargs):
    set_progress(f"Starting Provision of {resource} resource blob.")
    logger.info(f"Starting Provision of {resource} resource blob.")

    blob_name = "{{ blob_name }}"

    # blob resource object 
    blob_object = Resource.objects.get(id=int(blob_name), parent_resource_id=resource.id, lifecycle="ACTIVE")
    
    rh = AzureARMHandler.objects.get(id=resource.azure_rh_id)
    wrapper = rh.get_api_wrapper()
    storage_account_key = wrapper.storage_client.storage_accounts.list_keys(resource.resource_group_name, resource.azure_account_name).keys[0].value

     # block blob service object to establish connection
    block_blob_service = BlobServiceClient(
        account_url=f"https://{resource.azure_account_name}.blob.core.windows.net/",
        credential=storage_account_key,
    )

    # delete azure storage container blob
    delete_blob(job, resource, blob_object, block_blob_service)

    # delete blob resource from cb server
    blob_object.delete()

    return "SUCCESS", f"Successfully deleted blob -> '{blob_object.name}'", ""