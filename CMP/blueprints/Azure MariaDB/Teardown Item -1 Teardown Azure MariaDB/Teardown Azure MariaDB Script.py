"""
Deletes a MariaDB in Azure
"""
from common.methods import set_progress
from azure.common.credentials import ServicePrincipalCredentials
from resourcehandlers.azure_arm.models import AzureARMHandler
from azure.mgmt.rdbms import mariadb
from azure.identity import ClientSecretCredential

def get_tenant_id_for_azure(handler):
    '''
        Handling Azure RH table changes for older and newer versions (> 9.4.5)
    '''
    if hasattr(handler,"azure_tenant_id"):
        return handler.azure_tenant_id

    return handler.tenant_id


def run(job, **kwargs):
    resource = kwargs.pop("resources").first()
    
    cf_value = resource.get_cf_values_as_dict()
    
    rh_id = cf_value.get("azure_rh_id", "")
    
    if rh_id is None or rh_id == "":
        return "SUCCESS", "Maria DB deleted successfully.", ""
        
    rh = AzureARMHandler.objects.get(id=rh_id)

    set_progress("Connecting To Azure...")
    credentials = ClientSecretCredential(
        client_id=rh.client_id,
        client_secret=rh.secret,
        tenant_id=get_tenant_id_for_azure(rh)
    )
    client = mariadb.MariaDBManagementClient(credentials, rh.serviceaccount)
    
    set_progress("Connection to Azure established")
    
    server_name = cf_value.get("azure_server_name", "")
    database_name = cf_value.get("azure_database_name", "")
    resource_group = cf_value.get("resource_group_name", "")
    
    if database_name != "" and server_name != "" and server_name.startswith(database_name):
    
        set_progress("Deleting database %s from %s..." % (server_name, database_name))
    
        client.databases.begin_delete(resource_group, server_name, database_name)

    set_progress("Deleting server %s..." % server_name)
    
    client.servers.begin_delete(resource_group, server_name).wait()

    return "SUCCESS", "Maria DB deleted successfully.", ""