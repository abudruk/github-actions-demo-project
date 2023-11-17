from common.methods import set_progress
import paramiko,time,base64
from infrastructure.models import Server,CustomField
from django.conf import settings
from resourcehandlers.aws.models import AWSHandler

def copy_file_to_or_from_remote_server(server,key_file_path,from_path,To_path,action):
    try_again = True
    while try_again:
        try:
            ssh_client = paramiko.SSHClient()
            ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            host_name = server.ip
            resp = ssh_client.connect(hostname=host_name,username='centos',key_filename=key_file_path,timeout = 60)
            sftp = ssh_client.open_sftp()
            if action == "upload":
                set_progress(f"""Copying file from '{from_path}' to server '{server.hostname}'""")
                sftp.put(from_path,To_path)
            elif action == "download":
                set_progress(f"""Copying file from server '{server.hostname}' to local '{To_path}'""")
                sftp.get(from_path,To_path)
            sftp.close()
        except paramiko.SSHException as sshException:
            set_progress(f"""SSHException {sshException} while connecting to server '{server.hostname}'... retrying""")
        else:
            try_again = False   #try_again is set to False only if there is no exception
            set_progress(f"""Copying file is completed successfully...""")
        finally:
            ssh_client.close()
            time.sleep(5)
            
def get_boto3_client(service_name='ec2',**kwargs):
    region = None
    rh = kwargs.get('resource_handler')
    region = kwargs.get('region', None)
    service_name = kwargs.get('service')
    wrapper = rh.get_api_wrapper()
    return wrapper.get_boto3_client(service_name, rh.serviceaccount, rh.servicepasswd , region)
    
def run(job, *args, **kwargs):
    resource = kwargs.get('resource')
    base_name = resource.base_name
    aws_ha_region = resource.aws_region_ha
    rh = AWSHandler.objects.get(id = resource.aws_rh_id)
    auto_scaling_client = get_boto3_client(service='autoscaling', resource_handler = rh, region=aws_ha_region)
    
    upload_dir = getattr(settings, "MEDIA_ROOT", None)
    proserv_path = getattr(settings, "PROSERV_DIR", None)
    username = '{{username}}'
    email_id = '{{email_id}}'
    password = '{{password}}'
    
    product_license_file = "{{product_license_file}}"
    key_file_path = f"{proserv_path}{resource.ec2_key_name}.pem"
    from_path = f"{upload_dir}{product_license_file}"
    # MEDIA_ROOT = os.path.join(VARDIR, "www/html/cloudbolt/static/uploads/")
    fname = product_license_file.split("/")[-1]
    to_path = f"/tmp/{fname}"
    
    from_path_userdetails = f"{proserv_path}SuperUserDetails.txt"
    to_path_userdetails = "/tmp/SuperUserDetails.txt"
    userdetails = '''from django.contrib.auth.models import User;User.objects.create_superuser("{}","{}","{}")'''.format(username,email_id,password)
    user_b64_string = (base64.b64encode(userdetails.encode("ascii"))).decode("ascii")
    with open(from_path_userdetails, "w") as f:
        f.write(user_b64_string)
    
    # Putting back original scaling policy which was altered to avoid increase in insances during setup
    load_balancer_arn = resource.ha_load_balancer_arn
    target_group_arn = resource.target_group_arn
    if resource.asg_metric_type in ["ALBRequestCountPerTarget"]:
        resource_label = f'''{"/".join(load_balancer_arn.split("/")[1:])}/targetgroup/{"/".join(target_group_arn.split("/")[1:])}''' #if metric_type == "ALBRequestCountPerTarget" else None
        predefined_metric_specification = {'PredefinedMetricType': resource.asg_metric_type,'ResourceLabel': resource_label}
    else:
        predefined_metric_specification = {'PredefinedMetricType': resource.asg_metric_type}
        asg_lb_resp = auto_scaling_client.attach_load_balancer_target_groups(AutoScalingGroupName=resource.auto_scaling_group_name, TargetGroupARNs=[resource.target_group_arn],)
    try:
        auto_scaling_client.put_scaling_policy(
                AutoScalingGroupName=resource.auto_scaling_group_name,
                PolicyName=f"SP-{base_name}",
                PolicyType='TargetTrackingScaling',
                AdjustmentType='ChangeInCapacity',
                TargetTrackingConfiguration={
                    'PredefinedMetricSpecification': predefined_metric_specification,
                    'TargetValue': int(resource.asg_policy_targetvalue)   # Restoring original target value
                },
            )
    except:
        set_progress(f"threshold value updating to {resource.asg_policy_targetvalue} is failed...")
    else:
        set_progress(f"threshold value updated to {resource.asg_policy_targetvalue} successfully...")
    
    replace_autostart = """sudo runuser -l root -c 'sed -i "/autostart=false/c\\autostart=true" /etc/supervisord.d/jobengine.conf'"""
    replace_autorestart = """sudo runuser -l root -c 'sed -i "/autorestart=false/c\\autorestart=true" /etc/supervisord.d/jobengine.conf'"""
        
    first_instance = True
    if fname.split(".")[-1].lower() == 'bin':
        for server_id in resource.server_ids.split(","):
            server = Server.objects.get(id=int(server_id))
            if first_instance:
                host_name = server.ip
                # hostname = "54.226.167.57"
                set_progress(f"Establishing connection with server '{server.hostname}'")
                copy_file_to_or_from_remote_server(server,key_file_path,from_path,to_path,"upload")
                command_to_exec = f"sudo runuser -l root -c '/opt/cloudbolt/manage.py load_license -f /tmp/{fname}'"
                set_progress(f"Applying Product license to server '{server.hostname}'")
                server.execute_script(script_contents=command_to_exec,timeout=180)
                
                copy_file_to_or_from_remote_server(server,key_file_path,from_path_userdetails,to_path_userdetails,"upload")
                set_progress(f"Creating superuser...")
                server.execute_script(script_contents="sudo runuser -l root -c 'cat /tmp/SuperUserDetails.txt | base64 --decode | /opt/cloudbolt/manage.py shell'",timeout=300)
                server.execute_script(script_contents="sudo runuser -l root -c '/opt/cloudbolt/manage.py quick_setup_off'",timeout=300)
                first_instance = False
            
            set_progress(f"Setting 'autostart=true' and 'autorestart=true' in file '/etc/supervisord.d/jobengine.conf'  on server '{server.hostname}'")
            script_output = server.execute_script(script_contents=replace_autostart,timeout=240)
            script_output = server.execute_script(script_contents=replace_autorestart,timeout=240)
            script_output = server.execute_script(script_contents="sudo runuser -l root -c 'supervisorctl reload'",timeout=240)  #New added
            set_progress(f"Restarting httpd service on server '{server.hostname}'")
            server.execute_script(script_contents="sudo runuser -l root -c 'systemctl restart httpd'")
        
        return "SUCCESS", "Product License has been applied on all servers succcessfully ", ""
    else:
        return "FAILURE", "Product License must be with extension '.bin' ", ""