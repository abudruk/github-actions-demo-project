import requests
from urllib.parse import urlparse
from urllib.parse import parse_qs

from utilities.models import ConnectionInfo
from common.methods import set_progress

def get_openshift_oauth_token(protocol, domain, username, password, verify=False):
    params = {
         'client_id': 'openshift-challenging-client',
         'response_type': 'token',
     }
    
    response = requests.head(
    	f'{protocol}://oauth-openshift.apps.{domain}/oauth/authorize',
        params=params,
         verify=verify,
         auth=(username, password),
     )
    
    if response.status_code == 302:
        parsed_url = urlparse(response.headers['Location'])
        access_token = parse_qs(parsed_url.fragment)['access_token'][0]
        return access_token
    else:
        set_progress(f"Failed to get access token. Status code: {response.status_code}, Response: {response.json()}")
        return None

def delete_project(project_name, openshift_ci, verify=False):
    """
    Deletes the Project with specified project_name in Openshift Cluster.
    """
    
    openshift_token = get_openshift_oauth_token(openshift_ci.protocol, openshift_ci.ip, openshift_ci.username, openshift_ci.password)
    
    headers = {'Authorization': f'Bearer {openshift_token}', 
        'Accept': 'application/json', 'Content-Type': 'application/json'}
    
    url = f'{openshift_ci.protocol}://api.{openshift_ci.ip}:{openshift_ci.port}/apis/project.openshift.io/v1/projects/{project_name}'
    
    r = requests.delete(url, headers=headers, verify=verify)
    
    if r.ok:
        return
    
    raise Exception("Return code: {}, response text: {}".format(r.status_code, r.text))

def run(resource, **kwargs):
    openshift_ci = ConnectionInfo.objects.filter(name='Openshift Connection Info').first()
    
    if not openshift_ci:
        return "FAILURE", "Openshift not configured. Use the Openshift Admin page to do the configuration.", ""
        
    delete_project(resource.openshift_project_name, openshift_ci)
    
    return 'SUCCESS', f'{resource.openshift_project_name} deleted successfully', ''