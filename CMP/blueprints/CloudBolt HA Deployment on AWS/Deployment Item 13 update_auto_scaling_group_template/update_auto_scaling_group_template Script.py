from common.methods import set_progress
from infrastructure.models import Server,CustomField
from resources.models import Resource
from django.conf import settings
from resourcehandlers.aws.models import AWSHandler
import paramiko,time,base64

def run(job, *args, **kwargs):
    proserv_path = getattr(settings, "PROSERV_DIR", None)
    # resource = Resource.objects.get(id=1264)  # For testing only
    resource = kwargs.get('resource')
    blueprint = resource.blueprint
    key_file_path = f"{proserv_path}{resource.ec2_key_name}.pem"
    filesystem_id = resource.efs_id
    region = resource.aws_region_ha
    launch_template_id = resource.launch_template_id
    rh = AWSHandler.objects.get(id = resource.aws_rh_id)
    wrapper = rh.get_api_wrapper()
    ec2_client = wrapper.get_boto3_client('ec2', rh.serviceaccount, rh.servicepasswd , region)
    efs_dns_name = f"{filesystem_id}.efs.{region}.amazonaws.com"
    
    user_data = """#!bin/bash
sudo runuser -l root -c 'yum install nfs-utils'
sudo runuser -l root -c 'sed -i "/autostart=true/c\\autostart=false" /etc/supervisord.d/jobengine.conf'
sudo runuser -l root -c 'sed -i "/autorestart=true/c\\autorestart=false" /etc/supervisord.d/jobengine.conf'
sudo runuser -l root -c 'supervisorctl reload'
sudo runuser -l root -c 'mkdir /mnt/efs'
sudo runuser -l root -c 'rm -rf /var/opt/cloudbolt'
sudo runuser -l root -c 'rm -rf /var/log/cloudbolt/jobs'
sudo runuser -l root -c 'rm -rf /var/www/html/cloudbolt/static'
sudo runuser -l root -c 'mkdir /var/opt/cloudbolt'
sudo runuser -l root -c 'mkdir /var/log/cloudbolt/jobs'
sudo runuser -l root -c 'mkdir /var/www/html/cloudbolt/static'
sudo runuser -l root -c 'mount -t nfs4 -o nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2,noresvport {}:/ /mnt/efs'
sudo runuser -l root -c 'mount -t nfs4 -o nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2,noresvport {}:/cloudbolt /var/opt/cloudbolt'
sudo runuser -l root -c 'mount -t nfs4 -o nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2,noresvport {}:/jobs /var/log/cloudbolt/jobs'
sudo runuser -l root -c 'sudo mount -t nfs4 -o nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2,noresvport {}:/static /var/www/html/cloudbolt/static'
sudo runuser -l root -c 'echo "{}:/cloudbolt /var/opt/cloudbolt nfs rw,hard,intr,rsize=8192,wsize=8192,timeo=14 0 0\n" >> /etc/fstab'	
sudo runuser -l root -c 'echo "{}:/jobs /var/log/cloudbolt/jobs nfs rw,hard,intr,rsize=8192,wsize=8192,timeo=14 0 0\n" >> /etc/fstab'
sudo runuser -l root -c 'echo "{}:/static /var/www/html/cloudbolt/static nfs rw,hard,intr,rsize=8192,wsize=8192,timeo=14 0 0" >> /etc/fstab'
sudo runuser -l root -c 'sed -i "/autostart=false/c\\autostart=true" /etc/supervisord.d/jobengine.conf'
sudo runuser -l root -c 'sed -i "/autorestart=false/c\\autorestart=true" /etc/supervisord.d/jobengine.conf'
sudo runuser -l root -c 'supervisorctl reload'
sudo runuser -l root -c 'systemctl restart httpd'""".format(efs_dns_name,efs_dns_name,efs_dns_name,efs_dns_name,efs_dns_name,efs_dns_name,efs_dns_name)

    user_data_bytes = user_data.encode("ascii")
    user_data_base64_bytes = base64.b64encode(user_data_bytes)
    user_data_base64_string = user_data_base64_bytes.decode("ascii")
    response = ec2_client.describe_launch_templates(LaunchTemplateIds=[launch_template_id,])
    source_version = response['LaunchTemplates'][0]['LatestVersionNumber']
    lt_response = ec2_client.create_launch_template_version(
        LaunchTemplateId=launch_template_id,
        SourceVersion=str(source_version),
        VersionDescription="Updated version with auto-mount EFS",
        LaunchTemplateData = {
            'UserData': user_data_base64_string,
        }
    )
    new_version = lt_response['LaunchTemplateVersion']['VersionNumber']
    mlt_resp = ec2_client.modify_launch_template(
        LaunchTemplateId=launch_template_id,
        DefaultVersion=str(new_version)
    )
    # Clear Blueprint level customfields which are used as buffer variables on order form
    for cf_name in blueprint.get_cf_values_as_dict().keys():
        CustomField.objects.get(name=cf_name).delete()
        
    return "SUCCESS", f"Auto scaling group {resource.auto_scaling_group_name} configured successfully to auto-configure newly created instances... ", ""