'''
Connection Info: Create a Connection Info with name "Ansible Tower"
https://docs.ansible.com/ansible-tower/2.2.0/html/userguide/job_templates.html
Ansible Tower integration requires the following option(s) enabled on a job template:
    Enabled Concurrent Jobs: True (Checked)
    Limit: PROMPT ON LAUNCH = True (Checked)
    Extra Variables: PROMPT ON LAUNCH = True (Checked)
Extra Vars: Any CloudBolt parameter attatched to Build Items (server) in a blueprint and have a name
    pre-pending with "ansible_var_" will automatically be added to the HOST extra vars.  Any similar named
    parameter attached to the Resource will be added to the Job Template Run extra vars.
Examples
    ansible_var_myhostvar
        Variable Name: myhostvar
        Value: From order form input
    ansible_var_job_template_var
        Variable Name: job_template_var
        Value: From order form input
'''
from common.methods import set_progress
from utilities.models import ConnectionInfo
from utilities.helpers import get_ssl_verification
from infrastructure.models import Server
import requests
import json
import time

CONN, _ = ConnectionInfo.objects.get_or_create(name='Ansible Tower')
assert isinstance(CONN, ConnectionInfo)

BASE_URL = "{}://{}:{}/api/v2".format(CONN.protocol, CONN.ip, CONN.port)
HEADERS = {'Content-Type': 'application/json'}

# Must be a multi-select type for the action input
ANSIBLE_TEMPLATE = {{ ansible_template }}


def generate_options_for_ansible_template(**kwargs):
    get_token()
    options = []
    options.append((None, '------'))
    templates = get_tower_templates()
    for t in templates:
        name = t['name']
        id = t['id']
        options.append((id, name))
    return options


def get_token():
    url = BASE_URL + '/tokens/'
    auth = (CONN.username, CONN.password)
    data = {'application': '', 'description': 'CloudBolt Access Token', 'scope': 'write'}
    response = requests.post(url, headers=HEADERS, auth=auth, json=data, verify=get_ssl_verification())
    results = response.json()
    token = results['token']
    HEADERS['Authorization'] = 'Bearer ' + token
    return response


def delete_token(token):
    url = BASE_URL + '/tokens/{}/'.format(token['id'])
    response = requests.delete(url, headers=HEADERS, verify=get_ssl_verification())
    return response


def get_tower_templates():
    url = BASE_URL + '/job_templates/'
    response = requests.get(url, headers=HEADERS, verify=get_ssl_verification()).json()
    templates = []
    results = response.get('results', None)
    for r in results:
        ask_limit_on_launch = r.get('ask_limit_on_launch', None)
        if ask_limit_on_launch:
            templates.append(r)
    return templates


def get_template_details(template_id):
    url = BASE_URL + '/job_templates/' + template_id + '/'
    response = requests.get(url, headers=HEADERS, verify=get_ssl_verification()).json()
    host_config_key = response.get('host_config_key', None)
    inventory_id = response.get('inventory', None)
    related = response.get('related', None)
    if related:
        related = response['related']
        launch = related.get('launch', None)
    return (host_config_key, launch, inventory_id)


def get_ansible_extra_vars_for_resource(order):
    extra_vars = {}
    boi = order.orderitem_set.first().blueprintorderitem
    extra_vars_cfvs = boi.custom_field_values.filter(field__name__startswith='ansible_var_')
    if extra_vars_cfvs:
        for cfv in extra_vars_cfvs:
            key = cfv.field.name.replace('ansible_var_', '')
            val = cfv.value
            extra_vars[key] = val
    return str(extra_vars)


def get_ansible_extra_vars_for_server(server):
    assert isinstance(server, Server)
    extra_vars = {}
    extra_vars_cfvs = server.custom_field_values.filter(field__name__startswith='ansible_var_')
    if extra_vars_cfvs:
        for cfv in extra_vars_cfvs:
            key = cfv.field.name.replace('ansible_var_', '')
            val = cfv.value
            extra_vars[key] = val
    return extra_vars


def add_host_to_inventory(server, inventory_id):
    '''
    https://docs.ansible.com/ansible-tower/3.1.0/html/userguide/inventories.html#add-a-new-host
    The name field can be the server hostname or ipaddress
    '''
    url = BASE_URL + '/hosts/'
    vars = ''
    extra_vars = get_ansible_extra_vars_for_server(server)
    if extra_vars:
        set_progress('Ansible Tower: Host Extra Variables {}'.format(extra_vars))
        vars = json.dumps(extra_vars)

    host = {
        "name": server.ip,
        "description": "Added from CloudBolt",
        "inventory": inventory_id,
        "enabled": True,
        "instance_id": "",
        "variables": vars
    }
    response = requests.post(url, headers=HEADERS, json=host, verify=get_ssl_verification())
    return response


def run_template(server, host_config_key, launch_url, order):
    url = "{}://{}:{}{}".format(CONN.protocol, CONN.ip, CONN.port, launch_url)
    extra_vars = get_ansible_extra_vars_for_resource(order)
    params = {"limit": server.ip, "extra_vars": ""}
    if extra_vars:
        params['extra_vars'] = extra_vars
    set_progress('Ansible Tower: Launching Job Template')
    set_progress('Ansible Tower: Template Params: {}'.format(params))
    response = requests.post(url, headers=HEADERS, json=params, verify=get_ssl_verification())
    status = wait_for_complete(response.json().get('job', None))
    return status


def wait_for_complete(job_template_id):
    url = BASE_URL + '/jobs/{}/'.format(job_template_id)
    status = 'pending'
    while status in ['pending', 'waiting', 'running']:
        response = requests.get(url, headers=HEADERS, verify=get_ssl_verification())
        status = response.json().get('status', None)
        set_progress('Ansible Tower: Job ID: {} Status: {}'.format(job_template_id, status))
        if status in ['successful', 'failed']:
            result = response.json().get('result_stdout', None)
            set_progress(result)
            return status
        else:
            time.sleep(10)


def run(job=None, logger=None, server=None, resource=None, **kwargs):
    order = resource.jobs.first().get_order()
    for template_id in ANSIBLE_TEMPLATE:
        token = get_token().json()
        host_config_key, launch_url, inventory_id = get_template_details(template_id=template_id)
        add_host_to_inventory(server, inventory_id)
        status = run_template(server, host_config_key, launch_url, order)
        delete_token(token)
        if status != 'successful':
            msg = "Ansible Tower: Job Failed"
            return "FAILURE", "", msg
        else:
            return "SUCCESS", "", ""