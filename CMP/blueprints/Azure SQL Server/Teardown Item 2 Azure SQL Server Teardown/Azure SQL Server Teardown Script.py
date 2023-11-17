"""
Deletes an Azure Sql Server
"""
from common.methods import set_progress
from azure.common.credentials import ServicePrincipalCredentials
from resourcehandlers.azure_arm.models import AzureARMHandler
from azure.mgmt.sql import SqlManagementClient
from azure.identity import ClientSecretCredential

def get_tenant_id_for_azure(handler):
    '''
        Handling Azure RH table changes for older and newer versions (> 9.4.5)
    '''
    if hasattr(handler,"azure_tenant_id"):
        return handler.azure_tenant_id

    return handler.tenant_id


def run(job, **kwargs):
    resource = kwargs.pop('resources').first()

    server_name = resource.attributes.get(field__name='azure_server_name').value
    resource_group = resource.attributes.get(
        field__name='resource_group_name').value
    rh_id = resource.attributes.get(field__name='azure_rh_id').value
    rh = AzureARMHandler.objects.get(id=rh_id)

    set_progress("Connecting To Azure...")
    credentials = ClientSecretCredential(
        client_id=rh.client_id,
        client_secret=rh.secret,
        tenant_id=get_tenant_id_for_azure(rh)
    )
    client = SqlManagementClient(credentials, rh.serviceaccount)
    set_progress("Connection to Azure established")

    set_progress("Deleting server %s" % (server_name))
    client.servers.begin_delete(resource_group, server_name).wait()

    return "", "", ""