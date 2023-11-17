import json
import time
from urllib import response

from accounts.models import Group
from api.v3.internal_api_client import InternalAPIClient
from common.methods import set_progress
from django.contrib.auth.models import User
from infrastructure.models import CustomField
from resourcehandlers.azure_arm.models import AzureARMHandler
from servicecatalog.models import (ServiceBlueprint,
                                   ServiceBlueprintGroupPermissions)
from tags.models import TaggableAttribute
from tenants.models import Tenant


def run(job, resource, *args, **kwargs):
    account = "{{resource_handler_name}}"
    cb_admin_username = "{{cb_admin_username}}"
    subscription_id = "{{subscription_id}}"
    application_id = "{{application_id}}"
    region = "{{region}}"
    directory_id = "{{directory_id}}"
    password = "{{password}}"
    tenant = "{{tenant}}"
    tech_params = []
    env_parameters = """{{parameters}}"""
    groups = {{groups}}
    subnets = {{subnets}}
    tags = """{{tags}}"""
    username = "{{username}}"
    images_input = """{{images}}"""
    delete_on_failure = {{delete_on_failure}}


    if env_parameters:
        env_parameters = json.loads(env_parameters)
        tech_params = env_parameters.get("techSpecificParameters", [])

    if tags:
        tags = json.loads(tags)
        
    if images_input:
        images_input = json.loads(images_input)


    admin_user = User.objects.get(username=cb_admin_username)
    
    api_client = InternalAPIClient(admin_user, "http", "192.168.1.171", "8001")
    
    # Create Resource Handler
    set_progress("Creating Resource Handler")
    rh_payload = {
        "name": account,
        "description": "Azure Resource Handler",
        "subscriptionId": subscription_id,
        "applicationId": application_id,
        "directoryId": directory_id,
        "authenticationKey": password,
        "cloudEnvironment": "PUBLIC",
        "ssl": False
    }

    if tenant:
        rh_payload["tenant"] = f"/api/v3/cmp/tenants/{tenant}/"

    api_resp = api_client.post("/api/v3/cmp/resourceHandlers/azure/", payload=rh_payload)
    if not api_resp.success:
        set_progress(api_resp.response)
        return "FAILURE", "Onboarding Failed", "Resource Handler Create"

    rh_id = api_resp.response["id"]
    set_progress(f"Resource Handler Created: {rh_id}")
    
    # Create Region Environment
    set_progress("Importing Region")
    region_payload = {"name": region}
    api_resp = api_client.post(f"/api/v3/cmp/resourceHandlers/azure/{rh_id}/regions/", payload=region_payload)
    if not api_resp.success:
        remove_failed_rh(api_client, rh_id, delete_on_failure)
        return "FAILURE", "Onboarding Failed", "Region Import Failed"

    success, api_resp = _get_environment_hrefs(api_client, rh_id)
    if not success:
        remove_failed_rh(api_client, rh_id, delete_on_failure)
        return "FAILURE", "Onboarding Failed", "Could not retrieve Environments"

    env_hrefs = api_resp

    time.sleep(30)

    set_progress("Import Region Complete")

    # Create Images
    set_progress("Creating Images")
    if images_input:
        for image in images_input:
            images_payload = image
            success, api_resp = _import_images(api_client, rh_id, env_hrefs, images_payload, username)
            if not success:
                remove_failed_rh(api_client, rh_id, delete_on_failure)
                return "FAILURE", "Onboarding Failed", "Image creation Failed"

    set_progress("Creating Images Complete")

    # Update Environment add group(s), parameters, preconfigurations, and Azure paramater options
    set_progress("Updating Environment")

    success, api_resp = _update_envs(api_client, env_hrefs, groups, tech_params)

    if not success:
        remove_failed_rh(api_client, rh_id, delete_on_failure)
        return "FAILURE", "Onboarding Failed", "Adding Group to environment"

    if env_parameters:
        success, api_resp = _add_params_to_env(api_client, env_hrefs, env_parameters)
        if not success:
            remove_failed_rh(api_client, rh_id, delete_on_failure)
            return "FAILURE", "Onboarding Failed", "Adding Parameters to environment"

    set_progress("Environment Updated")

    # Import Network
    set_progress("Updating Subnets")
    success, api_resp = _import_network(api_client, rh_id, region, subnets)
    if not success:
        remove_failed_rh(api_client, rh_id, delete_on_failure)
        return "FAILURE", "Onboarding Failed", "Network Import Failed"
        
    # Create Resource Handler Tags
    set_progress("Creating Resource Handler Tags")
    if tags:
        for tag in tags:
            set_progress(tag)

            tags_payload = {
                "tagName": tag.get("tagName", ""),
                "attribute": tag.get("attribute", ""),
                "resourceHandler": f"/api/v3/cmp/resourceHandlers/azure/{rh_id}/"
            }
            api_resp = api_client.post("/api/v3/cmp/resourceHandlerTagMappings/", payload=tags_payload)
            if not api_resp.success:
                remove_failed_rh(api_client, rh_id, delete_on_failure)
                return "FAILURE", "Onboarding Failed", "Resource Handler Tags creation Failed"


    set_progress("Creating Resource Handler Tags Complete")

    CustomField.objects.get_or_create(name="has_azure_services", label="Group has Azure services", type="BOOL")

    for grp_gid in groups:
        grp = Group.objects.get(global_id=grp_gid)
        set_progress(f"Setting has_azure_access to {grp.name}...")
        grp.has_azure_services = True
        grp.save()

    return "SUCCESS", f"Successfully Onboarded Azure Account {account}", ""


def generate_options_for_groups(**kwargs):
    options = []
    # CustomField.objects.get_or_create(name="azure_account", label="Azure Account", type="STR")

    for group in Group.without_unassigned.all():
       
        options.append((group.global_id, group.name))

    return options

def generate_options_for_delete_on_failure(**kwargs):
    options = [
        (True, "Yes"),
        (False, "No"),
    ]

    return options
    
def generate_options_for_tenant(**kwargs):
    options = []
    for t in Tenant.objects.all():
        options.append((t.global_id, t.label))

    return options

def remove_failed_rh(api_client, rh_id, delete_on_failure):
    if delete_on_failure:
        api_resp = api_client.delete(f"/api/v3/cmp/resouceHandlers/azure/{rh_id}/?clearRelatedItems=y")
        if not api_resp.success:
            return False, api_resp
    return True, ""

def _get_environment_hrefs(api_client, rh_id):
    params = {
        "filter": f"resource_handler.global_id:{rh_id}",
    }
    api_resp = api_client.get("/api/v3/cmp/environments/", params=params)
    if not api_resp.success:
        return False, api_resp
        
    env_hrefs = []
    envs = api_resp.response.get("_embedded", {}).get("environments", {})
    for env in envs:
        env_href = env.get("_links", {}).get("self", {}).get("href", None)
        if env_href:
            env_hrefs.append(env_href)

    return True, env_hrefs


def _update_envs(api_client, env_hrefs, groups, tech_params):
    env_payload = {
        "groups": [f"/api/v3/cmp/groups/{gid}/" for gid in groups],
    }

    tech_param_payload = {}
    for tech_param in tech_params:
        name = tech_param.get("name", None)
        options = tech_param.get("options", [])

        if not name:
            continue

        tech_param_payload[name] = options

    if tech_param_payload:
        env_payload["techSpecificParameters"] = tech_param_payload

    for env_href in env_hrefs:

        api_resp = api_client.patch(f"{env_href}", payload=env_payload)

        if not api_resp.success:
            return False, api_resp

    return True, "Successfully updated environment(s)"


def _add_params_to_env(api_client, env_hrefs, env_parameters):
    parameters = env_parameters.get("parameters", [])
    preconfigs = env_parameters.get("preconfigurations", [])

    if not parameters and not preconfigs:
        return True, "No environment parameters"

    env_param_payload = {}
    params_payload = []

    for param in parameters:
        success, api_resp = _create_param_preconfig_payload(api_client, "parameter", param)
        if not success:
            return False, api_resp

        params_payload.append(api_resp)

    for preconfig in preconfigs:
        success, api_resp = _create_param_preconfig_payload(api_client, "preconfiguration", preconfig)
        if not success:
            return False, api_resp

        params_payload.append(api_resp)

    if params_payload:
        env_param_payload["parameters"] = params_payload

    if env_param_payload:
        for env_href in env_hrefs:
            api_resp = api_client.post(f"{env_href}parameters/", payload=env_param_payload)
            if not api_resp.success:
                return False, api_resp

    return True, "Successfully Added Parameters to environment(s)"


def _create_param_preconfig_payload(api_client, param_source, param):
    param_source_plural = f"{ param_source}s"
    name = param.get("name", None)
    params = {
        "filter": f"name:{name}",
    }
    api_resp = api_client.get(f"/api/v3/cmp/{param_source_plural}/", params=params)
    if not api_resp.success:
        return False, api_resp

    total = api_resp.response.get("total", 0)
    if total != 1:
        return False, f"Expected 1 row returned for {param_source} {name}, got {total}"

    param_href = api_resp.response["_embedded"][param_source_plural][0]["_links"]["self"]["href"]

    param_payload = {
        param_source: param_href,
    }

    options = param.get("options", None)
    if options:
        param_payload["options"] = options

    if param_source == "parameter":
        constraints = param.get("constraints", None)
        if constraints:
            param_payload["constraints"] = constraints

    return True, param_payload

def _import_images(api_client, rh_id, env_hrefs, images_payload, username):
    api_resp = api_client.post(f"/api/v3/cmp/resourceHandlers/azure/{rh_id}/images/", payload=images_payload)
    if not api_resp.success:
        return False, api_resp

    for resp in api_resp.response:
        osb_href = resp.get("_links", {}).get("osBuild", {}).get("href", None)

        if osb_href:
            osb_payload = {
                "environments": env_hrefs,
            }

            api_resp = api_client.patch(osb_href, payload=osb_payload)
            if not api_resp.success:
                return False, api_resp

            # Update credentials
            images = api_resp.response.get("_links", {}).get("images", [])
            for img in images:
                img_href = img.get("href", None)
                
                if img_href:
                    img_payload = {
                        "username": username,
                    }

                    api_resp = api_client.patch(f"{img_href}credentials/", payload=img_payload)
        return True, ""


def _import_network(api_client, rh_id, region, subnets):
    nic_payload = []

    for subnet in subnets:
        network_payload = {
            "region": region,
            "network": subnet,
        }
        api_resp = api_client.post(f"/api/v3/cmp/resourceHandlers/azure/{rh_id}/networks/?environmentAssociation=true", payload=network_payload)
        if not api_resp.success:
            return False, api_resp
    
    return True, ""