"""
Deletes Cosmos database from Azure
"""
import azure.mgmt.cosmosdb as cosmosdb
from azure.common.credentials import ServicePrincipalCredentials
from common.methods import set_progress
from resourcehandlers.azure_arm.models import AzureARMHandler
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
    Get the client using newer methods from the CloudBolt main repo if this CB is running
    a version greater than 9.2. These internal methods implicitly take care of much of the other
    features in CloudBolt such as proxy and ssl verification.
    Otherwise, manually instantiate clients without support for those other CloudBolt settings.
    """
    import settings
    from common.methods import is_version_newer

    cb_version = settings.VERSION_INFO["VERSION"]
    if is_version_newer(cb_version, "9.2"):
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


def run(job, **kwargs):
    resource = kwargs.pop("resources").first()

    account_name = resource.attributes.get(field__name="azure_account_name").value
    resource_group = resource.attributes.get(field__name="resource_group_name").value
    rh_id = resource.attributes.get(field__name="azure_rh_id").value
    # location = resource.attributes.get(field__name='azure_location').value
    rh = AzureARMHandler.objects.get(id=rh_id)
    
    client = _get_client(rh)

    set_progress("Deleting database %s..." % account_name)
    command = client.database_accounts.begin_delete(resource_group, account_name)
    command.wait()
    set_progress("response: %s" % command.result())

    return "", "", ""