"""
Restart Azure Web App
"""
from common.methods import set_progress
from azure.common.credentials import ServicePrincipalCredentials
from azure.mgmt.web import WebSiteManagementClient
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
    Get the clients using newer methods from the CloudBolt main repo if this CB is running
    a version greater than 9.2.1. These internal methods implicitly take care of much of the other
    features in CloudBolt such as proxy and ssl verification.
    Otherwise, manually instantiate clients without support for those other CloudBolt settings.
    :param handler:
    :return:
    """
    import settings
    from common.methods import is_version_newer

    set_progress("Connecting To Azure...")

    cb_version = settings.VERSION_INFO["VERSION"]
    if is_version_newer(cb_version, "9.2.1"):
        from resourcehandlers.azure_arm.azure_wrapper import configure_arm_client

        wrapper = handler.get_api_wrapper()
        web_client = configure_arm_client(wrapper, WebSiteManagementClient)
    else:
        # TODO: Remove once versions <= 9.2.1 are no longer supported.
        credentials = ClientSecretCredential(
            client_id=handler.client_id,
            client_secret=handler.secret,
            tenant_id=get_tenant_id_for_azure(handler)
        )
        web_client = WebSiteManagementClient(credentials, handler.serviceaccount)

    set_progress("Connection to Azure established")

    return web_client


def run(job, **kwargs):
    resource = kwargs.get("resource")

    # Connect to Azure Management Service
    set_progress("Connecting To Azure Management Service...")
    handler = AzureARMHandler.objects.first()

    web_client = _get_client(handler)
    set_progress("Successfully Connected To Azure Management Service!")

    # Restart Web App
    web_client.web_apps.restart(
        resource_group_name=resource.resource_group_name, name=resource.name
    )