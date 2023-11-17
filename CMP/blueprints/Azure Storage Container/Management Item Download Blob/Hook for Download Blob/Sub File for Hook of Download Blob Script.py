import os
from common.methods import set_progress
from azure.storage.blob import BlobServiceClient, PublicAccess
from utilities.logger import ThreadLogger
from resourcehandlers.azure_arm.models import AzureARMHandler

logger = ThreadLogger(__name__)


def generate_options_for_blob_name(**kwargs):
    """
    Generate options for blob
    """
    blob_names = []
    resource = kwargs.get('resource')

    if resource:
        rh = AzureARMHandler.objects.get(id=resource.azure_rh_id)
        wrapper = rh.get_api_wrapper()
        storage_account_key = wrapper.storage_client.storage_accounts.list_keys(resource.resource_group_name, resource.azure_account_name).keys[0].value
        block_blob_service = BlobServiceClient(
            account_url=f"https://{resource.azure_account_name}.blob.core.windows.net/",
            credential=storage_account_key,
        )
        # fetched all blobs from container 
        container_client = block_blob_service.get_container_client(container=resource.azure_container_name)
        blobs = container_client.list_blobs()

        blob_names.extend([blob.name for blob in blobs])

    return blob_names


def run(resource, *args, **kwargs):
    set_progress(f"Starting Provision of {resource} resource blob.")
    logger.info(f"Starting Provision of {resource} resource blob.")

    blob_name = "{{ blob_name }}"
    download_to = "{{ download_to }}"

    # validate provided path
    if not os.path.isdir(download_to):
        logger.warning(f"Bad path: '{download_to}'")
        return "FAILURE", "The path to save the blob isn't a valid path.", ""

    full_path_to_blob = os.path.join(download_to, blob_name)
    
    rh = AzureARMHandler.objects.get(id=resource.azure_rh_id)
    wrapper = rh.get_api_wrapper()
    storage_account_key = wrapper.storage_client.storage_accounts.list_keys(resource.resource_group_name, resource.azure_account_name).keys[0].value

     # block blob service object to establish connection
    block_blob_service = BlobServiceClient(
        account_url=f"https://{resource.azure_account_name}.blob.core.windows.net/",
        credential=storage_account_key,
    )

    set_progress(f"Downloading '{blob_name}' from Blob storage to directory '{download_to}'...")

    try:
        blob_client = block_blob_service.get_blob_client(container=resource.azure_container_name, blob=blob_name)
        with open(file=full_path_to_blob, mode="wb") as sample_blob:
            download_stream = blob_client.download_blob()
            sample_blob.write(download_stream.readall())
    except Exception as e:
        return "FAILURE", f"Failed to download `{blob_name}`.", f"{e}"

    return "SUCCESS", f"Downloaded `{blob_name}` successfully.", ""