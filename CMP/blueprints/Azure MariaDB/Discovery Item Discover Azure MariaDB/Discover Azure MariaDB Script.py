import azure.mgmt.resource.resources as resources
from azure.mgmt.rdbms import mariadb
from azure.identity import ClientSecretCredential

from common.methods import set_progress
from resourcehandlers.azure_arm.models import AzureARMHandler
from infrastructure.models import CustomField
from utilities.logger import ThreadLogger

logger = ThreadLogger(__name__)


RESOURCE_IDENTIFIER = "azure_database_server_id"



def get_tenant_id_for_azure(handler):
    '''
        Handling Azure RH table changes for older and newer versions (> 9.4.5)
    '''
    if hasattr(handler,"azure_tenant_id"):
        return handler.azure_tenant_id

    return handler.tenant_id

def create_custom_fields_as_needed():
    CustomField.objects.get_or_create(
        name="azure_rh_id",
        type="STR",
        defaults={
            "label": "RH ID",
            "description": "Used by the Azure blueprints"
        },
    )

    CustomField.objects.get_or_create(
        name="azure_database_name",
        type="STR",
        defaults={
            "label": "Database Name",
            "description": "Used by the Azure blueprints",
            "show_as_attribute": True,
        },
    )

    CustomField.objects.get_or_create(
        name="azure_server_name",
        type="STR",
        defaults={
            "label": "Server Name",
            "description": "Used by the Azure blueprints",
            "show_as_attribute": True,
        },
    )

    CustomField.objects.get_or_create(
        name="azure_location",
        type="STR",
        defaults={
            "label": "Location",
            "description": "Used by the Azure blueprints",
            "show_as_attribute": True,
        },
    )

    CustomField.objects.get_or_create(
        name="resource_group_name",
        type="STR",
        defaults={
            "label": "Resource Group",
            "description": "Used by the Azure blueprints",
            "show_as_attribute": True,
        },
    )

    CustomField.objects.get_or_create(
        name="azure_database_server_id",
        type="STR",
        defaults={
            "label": "Database Server ID",
            "description": "Used by the Azure blueprints"
        },
    )


def discover_resources(**kwargs):
    
    # get or create custom fields if needed
    create_custom_fields_as_needed()

    discovered_azure_sql = []
    
    for handler in AzureARMHandler.objects.all():
        
        set_progress("Connecting to Azure sql DB for handler: {}".format(handler))
        
        wrapper = handler.get_api_wrapper()
        
        azure_client = mariadb.MariaDBManagementClient(wrapper.credentials, handler.serviceaccount)
        azure_resources_client = wrapper.resource_client
        # azure_resources_client = resources.ResourceManagementClient(wrapper.credentials, handler.serviceaccount)

            
        for server in azure_client.servers.list(): 
            
            resource_group = server.id.split("/")[4]
            
            try:
                maria_db_rsp = azure_client.databases.list_by_server(resource_group, server.name)
            except Exception as e:
                set_progress("Azure Error: {}".format(e))
                continue
            
            for db in maria_db_rsp:
                    
                if db.name in ["information_schema", "performance_schema", "mariadb", "mysql"]:
                    continue
                
                data = {
                        "name": server.name,
                        "azure_server_name": server.name,
                        "azure_database_name": db.name,
                        "resource_group_name": resource_group,
                        "azure_rh_id": handler.id,
                        "azure_database_server_id":db.id
                    }
                
                if data not in discovered_azure_sql:
                    discovered_azure_sql.append(
                        data
                    )
                
                logger.info(f"Finished syncing maria db : {server.name}")

    return discovered_azure_sql