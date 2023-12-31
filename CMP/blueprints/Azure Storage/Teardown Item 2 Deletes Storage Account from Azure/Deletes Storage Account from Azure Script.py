"""
Deletes Storage Account from Azure
"""
from common.methods import set_progress
from resourcehandlers.azure_arm.models import AzureARMHandler
from azure.common.credentials import ServicePrincipalCredentials
import azure.mgmt.storage as storage
from azure.identity import ClientSecretCredential

def get_tenant_id_for_azure(handler):
    '''
        Handling Azure RH table changes for older and newer versions (> 9.4.5)
    '''
    if hasattr(handler,"azure_tenant_id"):
        return handler.azure_tenant_id

    return handler.tenant_id
    

def _get_client(handler):
    """
    Get the clients using newer methods from the CloudBolt main repo if this CB is running
    a version greater than 9.2.2. These internal methods implicitly take care of much of the other
    features in CloudBolt such as proxy and ssl verification.
    Otherwise, manually instantiate clients without support for those other CloudBolt settings.
    """
    import settings
    from common.methods import is_version_newer

    cb_version = settings.VERSION_INFO["VERSION"]
    if is_version_newer(cb_version, "9.2.2"):
        wrapper = handler.get_api_wrapper()
        storage_client = wrapper.storage_client
    else:
        # TODO: Remove once versions <= 9.2.2 are no longer supported.
        credentials = ClientSecretCredential(
            client_id=rh.client_id,
            client_secret=rh.secret,
            tenant_id=get_tenant_id_for_azure(rh)
        )
        storage_client = storage.StorageManagementClient(
            credentials, handler.serviceaccount
        )

    set_progress("Connection to Azure established")

    return storage_client


def run(job, **kwargs):
    resource = kwargs.pop("resources").first()

    account_name = resource.attributes.get(field__name="azure_account_name").value
    resource_group = resource.attributes.get(field__name="resource_group_name").value
    rh_id = resource.attributes.get(field__name="azure_rh_id").value
    rh = AzureARMHandler.objects.get(id=rh_id)

    storage_client = _get_client(rh)
    set_progress("Deleting storage account %s..." % account_name)
    storage_client.storage_accounts.delete(resource_group, account_name)

    return "", "", ""