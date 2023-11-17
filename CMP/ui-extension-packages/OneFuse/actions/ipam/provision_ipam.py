if __name__ == '__main__':
    import os
    import sys
    import django

    os.environ.setdefault("DJANGO_SETTINGS_MODULE", "settings")
    sys.path.append('/opt/cloudbolt')
    django.setup()

import json
from common.methods import set_progress
from resourcehandlers.models import ResourceNetwork
from onefuse.cloudbolt_admin import CbOneFuseManager, Utilities
from utilities.logger import ThreadLogger
from jobs.models import Job

logger = ThreadLogger(__name__)


def run(job, **kwargs):
    server = job.server_set.first()
    if server:
        utils = Utilities(logger)
        logger.debug(f"Dictionary of keyword args passed to this"
                     f" plug-in: {kwargs.items()}")
        hook_point = kwargs.get("hook_point")
        properties_stack = utils.get_cb_object_properties(server,
                                                              hook_point)
        endpoint_policies = utils.get_connection_and_policy_values(
            'OneFuse_IpamPolicy_Nic', properties_stack)
        logger.debug(f'endpoint_policies: {endpoint_policies}')
        if endpoint_policies:
            for endpoint_policy in endpoint_policies:
                onefuse_endpoint = endpoint_policy["endpoint"]
                policy_name = endpoint_policy["policy"]
                nic_suffix = int(endpoint_policy["suffix"])
                logger.debug(f"Starting OneFuse IPAM Policy: "
                             f"{policy_name}, Endpoint: {onefuse_endpoint}")
                try:
                    tracking_id = server.OneFuse_Tracking_Id
                except:
                    tracking_id = ""
                from xui.onefuse.globals import VERIFY_CERTS
                ofm = CbOneFuseManager(onefuse_endpoint, VERIFY_CERTS,
                                       logger=logger)
                hostname = server.hostname
                set_progress(f'Calling OneFuse to provision IPAM '
                             f'Managed Object. Policy: {policy_name}')
                ipam_json = ofm.provision_ipam(policy_name, properties_stack,
                                               hostname, tracking_id)
                ipam_json["endpoint"] = onefuse_endpoint
                ip_address = ipam_json.get("ipAddress")
                nic_property = f'OneFuse_Ipam_Nic{nic_suffix}'
                utils.check_or_create_cf(nic_property)
                server.set_value_for_custom_field(nic_property,
                                                  json.dumps(ipam_json))
                ip_network = ipam_json.get("network")
                dns_domain = ipam_json.get("dnsSuffix")
                if ipam_json.get("primaryDns"):
                    domain_name_server = ipam_json.get("primaryDns")
                domain_name_server = ''
                if ipam_json.get("secondaryDns"):
                    if domain_name_server:
                        domain_name_server += ','
                    domain_name_server += ipam_json.get("secondaryDns")
                # It seems that the only way to drive the network is to set it
                # here (before vm provision)and then update the NICs later
                server.set_value_for_custom_field(f'sc_nic_{nic_suffix}',
                                                  ip_network)
                server.set_value_for_custom_field(f'sc_nic_{nic_suffix}_ip',
                                                  ip_address)
                if dns_domain:
                    server.set_value_for_custom_field(f'dns_domain',
                                                      dns_domain)
                if domain_name_server:
                    server.set_value_for_custom_field(f'domain_name_server',
                                                      domain_name_server)
                logger.debug(f'all nics: {server.nics.all()}')
                # Not able to set NICs at this stage, being set during
                # Pre-Network Configuration
                server.OneFuse_Tracking_Id = ipam_json["trackingId"]
                server.save()
                logger.info(f"IP being set to: {ip_address}")
        else:
            logger.info("OneFuse_IpamPolicy_NicN parameter is not set on "
                         "the server")

        additional_policies = utils.get_connection_and_policy_values(
            'OneFuse_IpamPolicy_Additional_', properties_stack)
        logger.debug(f'additional_policies: {additional_policies}')
        if additional_policies:
            for additional_policy in additional_policies:
                onefuse_endpoint = additional_policy["endpoint"]
                policy_name = additional_policy["policy"]
                nic_suffix = additional_policy["suffix"]
                logger.debug(f"Starting OneFuse IPAM Policy: "
                             f"{policy_name}, Endpoint: {onefuse_endpoint}")
                try:
                    tracking_id = server.OneFuse_Tracking_Id
                except:
                    tracking_id = ""
                from xui.onefuse.globals import VERIFY_CERTS
                ofm = CbOneFuseManager(onefuse_endpoint, VERIFY_CERTS,
                                       logger=logger)
                try:
                    name_key = f'OneFuse_Naming_Additional_{nic_suffix}'
                    name_prop = properties_stack[name_key]
                    ipam_hostname = name_prop["name"]
                except KeyError:
                    ipam_hostname = f'{server.hostname}-{nic_suffix}'
                ipam_json = ofm.provision_ipam(policy_name,
                                               properties_stack,
                                               ipam_hostname,
                                               tracking_id)
                ipam_json["endpoint"] = onefuse_endpoint
                nic_property = f'OneFuse_Ipam_Additional_{nic_suffix}'
                utils.check_or_create_cf(nic_property)
                server.set_value_for_custom_field(nic_property,
                                                  json.dumps(ipam_json))
                server.OneFuse_Tracking_Id = ipam_json["trackingId"]
                server.save()
        else:
             logger.info("OneFuse_Ipam_Additional_ parameters is not set on "
                         "the server") 
        
        return "SUCCESS", "", ""

    else:
        logger.error("Server was not found")
        return "FAILURE", "", "Server was not found"


if __name__ == '__main__':
    job_id = sys.argv[1]
    job = Job.objects.get(id=job_id)
    run = run(job)
    if run[0] == 'FAILURE':
        set_progress(run[1])