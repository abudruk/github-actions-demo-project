import requests
from utilities.models import ConnectionInfo
import ast
import json
from datetime import datetime
from common.methods import set_progress
from resourcehandlers.models import ResourceHandler


def run(resource, **kwargs):
    openstack = OpenstackAPI()
    openstack_ci = openstack.get_connection_info()
    if not openstack_ci:
        return "FAILURE", 'Connection info object not configured, please create connection info object with name same as "{}", IP, Port, Protocol, Username, Password.'.format("Openstack Connection Info"), ""
    oc_api = OpenstackAPI(host=openstack_ci.ip, token=openstack.get_token(), port=openstack_ci.port)
    if not oc_api.check_token_validation():
        set_progress('Token validation failed')
        token = oc_api.generate_token()
        oc_api.token = token
        oc_api.headers = {
            'X-auth-token': token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    oc_api.delete_project(resource.openstack_project_id)
    return 'SUCCESS', '', ''


class OpenstackAPI(object):
    """Object for API calls to Openstack Cluster."""

    def __init__(self, host=None, token=None, port=443, protocol='http'):
        """API Object Constructor."""
        self.BASE_URL = f'{protocol}://{host}:{port}'
        self.host = host
        self.token = token
        self.headers = {
            'X-auth-token': token,
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
        self.port = port
        self.protocol = protocol

    def delete_project(self, project_id):
        set_progress('Deleting project')
        """Deletes the Project with specified project_id in Openstack Cluster."""
        url = f'{self.BASE_URL}/v3/projects/{project_id}'
        r = requests.delete(url, headers=self.headers)
        if r.ok:
            return
        raise Exception("Return code: {}, response text: {}".format(r.status_code, r.text))

    def get_connection_info(self):
        if not ConnectionInfo.objects.filter(name__iexact='Openstack Connection Info').exists():
            return None
        
        ci_obj = ConnectionInfo.objects.filter(name__iexact='Openstack Connection Info').first()
        description = ci_obj.description
        if description == '':
            ci_obj = update_connection_info(ci_obj)
        return ci_obj

    def get_token(self):
        connection_info = self.get_connection_info()
        if connection_info:
            headers = ast.literal_eval(connection_info.headers)
            return headers.get('X-auth-token')
        return None

    def generate_token(self):
        set_progress('Generating new token')
        connection_info = self.get_connection_info()
        if connection_info:
            description = ast.literal_eval(connection_info.description)
            username = connection_info.username
            password = connection_info.password
            project_id = description.get('project_id')
        data = {
            "auth": {
                "identity": {
                    "methods": [
                        "password"
                    ],
                    "password": {
                        "user": {
                            "name": username,
                            "domain": {
                                "name": "Default"
                            },
                            "password": password
                        }
                    }
                },
                "scope": {
                    "project": {
                        "id": project_id
                    }
                }
            }
        }
        url = f'{self.BASE_URL}/v3/auth/tokens'
        r = requests.post(url, json=data)
        if r.status_code != 201:
            raise Exception("Return code: {}, response text: {}".format(r.status_code, r.text))
        headers = {
               "X-auth-token": str(r.headers['X-Subject-Token']),
            }
        description = {
            "project_id": project_id,
            "expires_at": str(r.json()['token'].get("expires_at"))
        }
        connection_info.headers = str(headers)
        connection_info.description = str(description)
        connection_info.save()
        return str(r.headers['X-Subject-Token'])

    def check_token_validation(self):
        set_progress('Validating token')
        connection_info = self.get_connection_info()
        if connection_info:
            description = ast.literal_eval(connection_info.description)
            expiration_date = description.get("expires_at")
            if expiration_date is None:
                return False
            timenow = datetime.now()
            expires_at = datetime.strptime(expiration_date, "%Y-%m-%dT%H:%M:%S.%fZ") 
            diff = timenow - expires_at
            diff_min = round(diff.total_seconds()/60)
            if diff_min > 30:
                return False
            else:
                return True
        return False

def update_connection_info(ci_obj):
    set_progress('Updating Connection Info')
    rh = ResourceHandler.objects.filter(ip=ci_obj.ip)
    if rh:
        rh_obj = rh.first().cast()
        headers = {
                "X-auth-token": ""
            }
        ci_obj.headers = str(headers)
        ci_obj.description = {
                "project_id": rh_obj.project_id,
                "expires_at": None
            }
        ci_obj.save()
        return ci_obj