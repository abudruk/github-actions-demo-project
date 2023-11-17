import requests
from urllib.parse import urlparse
from urllib.parse import parse_qs

from utilities.models import ConnectionInfo
from common.methods import set_progress

        
RESOURCE_IDENTIFIER = 'openshift_project_name'


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
        
def get_projects(openshift_ci, verify=False):
    """
    Gets all projects in an OpenShift cluster
    """
    openshift_token = get_openshift_oauth_token(openshift_ci.protocol, openshift_ci.ip, openshift_ci.username, openshift_ci.password)
    
    headers = {'Authorization': f'Bearer {openshift_token}', 
        'Accept': 'application/json', 'Content-Type': 'application/json'}
    
    url = f'{openshift_ci.protocol}://api.{openshift_ci.ip}:{openshift_ci.port}/apis/project.openshift.io/v1/projects'
    
    r = requests.get(url, headers=headers, verify=verify)
    
    if r.status_code != 200:
        raise Exception("Return code: {}, response text: {}".format(r.status_code, r.text))
    
    projects = r.json().get('items')
    
    return projects


def discover_resources(**kwargs):
    discovered_projects = []
    
    openshift_ci = ConnectionInfo.objects.filter(name='Openshift Connection Info').first()
    
    if not openshift_ci:
        return "FAILURE", "Openshift not configured. Use the Openshift Admin page to do the configuration.", ""
    
    try:
        projects = get_projects(openshift_ci)
    except Exception as e:
        return 'FAILURE', f'{e}', f'Failed to get projects'
        
    for project in projects:
        project = project.get('metadata')
        
        set_progress(f"Found {project.get('name')}")
        
        display_name = project.get('annotations').get('openshift.io/display-name')
        description = project.get('annotations').get('openshift.io/description')
        
        if display_name == '' or display_name is None:
            display_name = project.get('name')
        
        discovered_projects.append({
            'name': display_name,
            'openshift_project_name': project.get('name'),
            'openshift_project_description': description
        })
    
    return discovered_projects