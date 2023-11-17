import ast
import json
from urllib import response

from accounts.models import Group
from api.v3.internal_api_client import InternalAPIClient
from common.methods import set_progress
from django.contrib.auth.models import User
from infrastructure.models import CustomField
from resourcehandlers.aws.models import AWSHandler
from tags.models import TaggableAttribute
from tenants.models import Tenant


def run(job, resource, *args, **kwargs):
    cb_admin_username = "{{cb_admin_username}}"
    account = "{{aws_account}}"
    access_key = "{{aws_access_key}}"
    access_secret = "{{aws_access_secret}}"
    region = "{{aws_region}}"
    amis = {{aws_amis}}
    groups = {{groups}}
    subnets = "{{subnets}}"
    keypair_name = "{{aws_keypair_name}}"
    private_key = """{{aws_private_key}}"""
    env_parameters = """{{parameters}}"""
    tags = """{{tags}}"""
    tenant = "{{tenant}}"
    tech_params = None
    delete_on_failure = "{{delete_on_failure}}"


    if subnets:
        subnets = ast.literal_eval(subnets)

    if env_parameters:
        env_parameters = json.loads(env_parameters)
        tech_params = env_parameters.get("techSpecificParameters", [])

    if tags:
        tags = json.loads(tags)

    admin_user = User.objects.get(username=cb_admin_username)

    api_client = InternalAPIClient(admin_user, "http", "192.168.1.171", "8001")

    # Create Resource Handler
    set_progress("Creating Resource Handler")
    rh_payload = {
        "name": account,
        "accessKeyId": access_key,
        "secretAccessKey": access_secret
    }
    
    if tenant:
        rh_payload["tenant"] = f"/api/v3/cmp/tenants/{tenant}/"

    api_resp = api_client.post("/api/v3/cmp/resourceHandlers/aws/", payload=rh_payload)
    if not api_resp.success:
        set_progress(api_resp.response)
        return "FAILURE", "Onboarding Failed", "Resource Handler Create"

    rh_id = api_resp.response["id"]
    set_progress(f"Resource Handler Created: {rh_id}")

    # Create Region Environment
    set_progress("Importing Region")
    region_payload = {"name": region}
    api_resp = api_client.post(f"/api/v3/cmp/resourceHandlers/aws/{rh_id}/regions/", payload=region_payload)
    if not api_resp.success:
        remove_failed_rh(api_client, rh_id, delete_on_failure)
        return "FAILURE", "Onboarding Failed", "Region Import Failed"

    success, api_resp = _get_environment_hrefs(api_client, rh_id)
    if not success:
        remove_failed_rh(api_client, rh_id, delete_on_failure)
        return "FAILURE", "Onboarding Failed", "Could not retrieve Environments"

    env_hrefs = api_resp

    set_progress("Import Region Complete")

    # Update Environment add group(s), parameters, preconfigurations, and AWS paramater options
    set_progress("Updating Environment")

    success, api_resp = _update_envs(api_client, env_hrefs, groups, tech_params)
    if not success:
        remove_failed_rh(api_client, rh_id, delete_on_failure)
        return "FAILURE", "Onboarding Failed", "Adding Group to environment"
    set_progress("Environment Updated")

    set_progress("Adding params to env")
    if env_parameters:
        success, api_resp = _add_params_to_env(api_client, env_hrefs, env_parameters)
        if not success:
            set_progress(api_resp)
            remove_failed_rh(api_client, rh_id, delete_on_failure)
            return "FAILURE", "Onboarding Failed", "Adding Parameters to environment"
    set_progress("Added params to env")

    # Import AMI's
    set_progress("Importing AMI's")
    ami_payload = {
        "region": region,
        "amiIds": amis,
    }
    success, api_resp = _import_amis(api_client, rh_id, env_hrefs, ami_payload)
    if not success:
        remove_failed_rh(api_client, rh_id, delete_on_failure)
        return "FAILURE", "Onboarding Failed", "AMI Import Failed"

    set_progress("Import AMI's Complete")

    # Add Private Key
    set_progress("Adding Private Key")
    sshkey_payload = {
        "type": "stored",
        "resourceHandler": f"/api/v3/cmp/resourceHandlers/aws/{rh_id}/",
        "name": keypair_name,
        "privateKey": private_key,
    }
    set_progress("Added Private Key")

    api_resp = api_client.post("/api/v3/cmp/sshKeys/", payload=sshkey_payload)
    if not api_resp.success:
        set_progress(api_resp.response)
        remove_failed_rh(api_client, rh_id, delete_on_failure)
        return "FAILURE", "Onboarding Failed", "Adding Private Key"

    # Import Network
    set_progress("Updating Subnets")
    success, api_resp = _import_network(api_client, env_hrefs, subnets)
    if not success:
        remove_failed_rh(api_client, rh_id, delete_on_failure)
        return "FAILURE", "Onboarding Failed", "Network Import Failed"
        
    set_progress("Creating Resource Handler Tags")
    if tags:
        for tag in tags:
            tags_payload = {
                "tagName": tag.get("tagName", ""),
                "attribute": tag.get("attribute", ""),
                "resourceHandler": f"/api/v3/cmp/resourceHandlers/aws/{rh_id}/"
            }
            api_resp = api_client.post("/api/v3/cmp/resourceHandlerTagMappings/", payload=tags_payload)
            if not api_resp.success:
                set_progress(api_resp.response)
                remove_failed_rh(api_client, rh_id, delete_on_failure)
                return "FAILURE", "Onboarding Failed", "Resource Handler Tags creation Failed"


    set_progress("Creating Resource Handler Tags Complete")



    CustomField.objects.get_or_create(name="has_aws_services", label="Group has AWS services", type="BOOL")

    for grp_gid in groups:
        grp = Group.objects.get(global_id=grp_gid)
        set_progress(f"Setting has_aws_access to {grp.name}...")
        grp.has_aws_services = True
        grp.save()

    return "SUCCESS", f"Successfully Onboarded AWS Account {account}", ""


def generate_options_for_groups(**kwargs):
    options = []

    for group in Group.without_unassigned.all():
       
        options.append((group.global_id, group.name))

    return options
    
def generate_options_for_tenant(**kwargs):
    options = []
    for t in Tenant.objects.all():
        options.append((t.global_id, t.label))

    return options


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


def _import_amis(api_client, rh_id, env_hrefs, ami_payload):
    api_resp = api_client.post(f"/api/v3/cmp/resourceHandlers/aws/{rh_id}/amis/", payload=ami_payload)
    if not api_resp.success:
        return False, api_resp

    osb_hrefs = []
    for image in api_resp.response:
        osb_href = image.get("_links", {}).get("osBuild", {}).get("href", None)
        osb_hrefs.append(osb_href)

    for osb_href in osb_hrefs:
        osb_payload = {
            "environments": env_hrefs,
        }
    
        api_resp = api_client.patch(osb_href, payload=osb_payload)
        if not api_resp.success:
            return False, api_resp

    return True, ""


def _import_network(api_client, env_hrefs, subnets):
    nic_payload = []

    for env_href in env_hrefs:
        env_nic_href = f"{env_href}networks/"
        api_resp = api_client.get(env_nic_href)
        if not api_resp.success:
            set_progress(api_resp.response)
            return False, api_resp

        for network in api_resp.response:
            if network["title"] in subnets:
                nic_payload.append(
                    {
                        "network": network["network"],
                        "nics": [1],
                    },
                )

        if nic_payload:
            api_resp = api_client.post(env_nic_href, payload=nic_payload)
            if not api_resp.success:
                set_progress(api_resp.response)
                return False, api_resp

    return True, ""
    
def remove_failed_rh(api_client, rh_id, delete_on_failure):
    if delete_on_failure:
        api_resp = api_client.delete(f"/api/v3/cmp/resouceHandlers/azure/{rh_id}/?clearRelatedItems=y")
        if not api_resp.success:
            return False, api_resp
    return True, ""