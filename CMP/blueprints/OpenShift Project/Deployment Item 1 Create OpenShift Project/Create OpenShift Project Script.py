import requests
import json
from urllib.parse import urlparse
from urllib.parse import parse_qs

from utilities.models import ConnectionInfo
from common.methods import set_progress
from infrastructure.models import CustomField
from utilities.logger import ThreadLogger

logger = ThreadLogger(__name__)

def create_custom_fields_as_needed():
    CustomField.objects.get_or_create(
        name='openshift_project_name',
        label='Openshift Project Name',
        defaults={'type': 'STR',
                  'show_as_attribute': True
                  }
    )
    CustomField.objects.get_or_create(
        name='openshift_project_description',
        label='Openshift Project Description',
        defaults={'type': 'STR',
                  'show_as_attribute': True
                  }
    )

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
    
    
def run(resource, **kwargs):
    create_custom_fields_as_needed()
    projectname = '{{ project_name }}'
    display_name = '{{ display_name }}'
    description = '{{ description }}'

    set_progress('Creating Project in OpenShift Cluster...')

    openshift_ci = ConnectionInfo.objects.get(name='Openshift Connection Info')
    
    openshift_token = get_openshift_oauth_token(openshift_ci.protocol, openshift_ci.ip, openshift_ci.username, openshift_ci.password)

    base_url = f'{openshift_ci.protocol}://api.{openshift_ci.ip}:{openshift_ci.port}/apis/project.openshift.io/v1'
    
    headers = {'Authorization': f'Bearer {openshift_token}', 
        'Accept': 'application/json', 'Content-Type': 'application/json'}
    
    url = f'{base_url}/projectrequests'
    data = {
            "kind": "ProjectRequest",
            "apiVersion": "project.openshift.io/v1",
            "metadata": { "name": projectname, },
            "displayName": display_name,
            "description": description
        }
    
    try:
        r = requests.post(url, headers=headers, data=json.dumps(data), verify=False)
    except Exception as e:
        return 'FAILURE', f'{e}', f'Failed to create project {projectname}'
        
    if r.status_code != 201:
        set_progress("Return code: {}, response text: {}".format(r.status_code, r.text))
        return 'FAILURE', f'{r.text}', f'{r.status_code}'
     
    # Create Resource in Cloudbolt
    resource.name = display_name
    resource.openshift_project_name = projectname
    resource.openshift_project_description = description
    resource.save()

    return 'SUCCESS', f'{projectname} Successfully created', ''