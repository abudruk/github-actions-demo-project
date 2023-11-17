from common.methods import set_progress
from infrastructure.models import Server,CustomField
from resources.models import Resource
from django.conf import settings
import paramiko,time

def copy_file_to_or_from_remote_server(server,key_file_path,from_path,To_path,action):
    try_again = True
    while try_again:
        try:
            ssh_client = paramiko.SSHClient()
            ssh_client.set_missing_host_key_policy(paramiko.AutoAddPolicy())
            host_name = server.ip
            resp = ssh_client.connect(hostname=host_name,username='centos',key_filename=key_file_path,timeout = 180)
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
    
        
def run(job, *args, **kwargs):
    proserv_path = getattr(settings, "PROSERV_DIR", None)
    # resource = Resource.objects.get(id=1194)  # For testing purpose only
    resource = kwargs.get('resource')
    key_file_path = f"{proserv_path}{resource.ec2_key_name}.pem"
    server_ut_dict = {}
    unique_token = ""
    server_id_having_ut = -1
    script_content = f"""#!/usr/bin/env bash
my_out="NA"
my_out=$(grep "UNIQUE_TOKEN" {proserv_path}customer_settings.py)
if [[ "$my_out" == "" ]]
then
    echo "NA"
else
    echo "$my_out"
fi"""

    
    
    replace_autostart = """sudo runuser -l root -c 'sed -i "/autostart=true/c\\autostart=false" /etc/supervisord.d/jobengine.conf'"""
    replace_autorestart = """sudo runuser -l root -c 'sed -i "/autorestart=true/c\\autorestart=false" /etc/supervisord.d/jobengine.conf'"""
    
    for server_id in resource.server_ids.split(","):
        server = Server.objects.get(id=int(server_id))
        
        set_progress(f"Copying key_file on server '{server.hostname}'")
        copy_file_to_or_from_remote_server(server,key_file_path,key_file_path,f"/tmp/{resource.ec2_key_name}.pem","upload")
        
        set_progress(f"Installing Putty on server '{server.hostname}'")
        script_output = server.execute_script(script_contents="sudo runuser -l root -c 'yum -y install putty'",timeout=360)  # defualt timeout is 120
        
        set_progress(f"Converting .PEM file to .PPK(private key) on server '{server.hostname}'")
        command_to_exec = "sudo runuser -l root -c 'puttygen /tmp/{}.pem -o /tmp/{}.ppk -O private'".format(resource.ec2_key_name,resource.ec2_key_name)
        script_output = server.execute_script(script_contents=command_to_exec,timeout=300)
        
        set_progress("Modifying permissions of '{}.pem' and 'secret-key-for-apache.bin' file".format(resource.ec2_key_name))
        script_output = server.execute_script(script_contents="sudo runuser -l root -c 'chmod 600 /tmp/{}.pem'".format(resource.ec2_key_name))
        script_output = server.execute_script(script_contents="sudo runuser -l root -c 'chmod 777 /var/opt/cloudbolt/secrets/secret-key-for-apache.bin'")
        
        set_progress(f"Setting 'autostart=false' and 'autorestart=false' in file '/etc/supervisord.d/jobengine.conf'  on server '{server.hostname}'")
        script_output = server.execute_script(script_contents=replace_autostart,timeout=240)
        script_output = server.execute_script(script_contents=replace_autorestart,timeout=240)
        script_output = server.execute_script(script_contents="sudo runuser -l root -c 'supervisorctl reload'",timeout=240)  #New added
        
        set_progress(f"Checking Unique token on server '{server.hostname}'")
        script_output = server.execute_script(script_contents=script_content)
        set_progress(f"Unique token found on server '{server.hostname}' is '{script_output}'")
        server_ut_dict[int(server_id)] = script_output.split("\n")[0].split("=")[-1].replace(" ","").replace("'","")    # e.g. server_ut_dict = {116: '929d7b95-97e8-484a-8ebb-621b9954e498', 117: 'NA'}
    if all(value == "NA" for value in server_ut_dict.values()):  # e.g. server_ut_dict = {116: 'NA', 117: 'NA'}
        set_progress("Case :- All instances DOESN'T have UNIQUE_TOKEN")
        server_id = list(server_ut_dict.keys())[0]
        server = Server.objects.get(id=int(server_id))
        command_to_exec = f"sudo runuser -l root -c 'uuidgen'"
        unique_token = server.execute_script(script_contents=command_to_exec)
        unique_token = unique_token.split("\n")[0]
        """
        This code block copies UNIQUE_TOKEN from local machine
        with open(f"{proserv_path}/customer_settings.py","r") as f:
            for line in f.readlines():
                if line.find("UNIQUE_TOKEN") != -1:
                    print(line)
                    unique_token = line.split("\n")[0].split("=")[-1].replace(" ","").replace("'","")
        """
        
    elif all(value != "NA" for value in server_ut_dict.values()):  # e.g. server_ut_dict = {116: '929d7b95-97e8-484a-8ebb-621b9954e498', 117: '929d7b95-97e8-585a-8ebb-121b9643d832'}
        set_progress("Case :- All instances have UNIQUE_TOKEN")
        unique_token = next(iter(server_ut_dict.values()))
        server_id_having_ut = next(iter(server_ut_dict.keys()))
        
    # elif any(value != "NA" for value in server_ut_dict.values()):
    else:    # e.g. server_ut_dict = {116: '929d7b95-97e8-484a-8ebb-621b9954e498', 117: 'NA'}
        set_progress("Case :- At least one instances has UNIQUE_TOKEN")
        for key,value in server_ut_dict.items():
            if value != "NA":
                unique_token = value   #.split("=")[-1].replace(" ","").replace("'","")
                server_id_having_ut = key
    
    CustomField.objects.get_or_create(
        name='unique_token',
        defaults={
            "label": 'Unique Token ID',
            "type": 'STR',
            'show_as_attribute': False,
            "description": 'Used by the HA Architecture blueprint'
        }
        ) 
    resource.unique_token = unique_token
    resource.save()
    
    
    from_path = f"{proserv_path}UniqueToken.txt"
    with open(from_path, "w") as f:
        f.write(f"UNIQUE_TOKEN = '{unique_token}'\n")
    to_path = "/tmp/unique_token.txt"
    
    for server_id in resource.server_ids.split(","):
        server = Server.objects.get(id=int(server_id))
        if server.id == server_id_having_ut:
            continue
        
        copy_file_to_or_from_remote_server(server,key_file_path,from_path,to_path,"upload")
        
        if server_ut_dict[int(server_id)] != "NA":
            #Delete UNIQUE_TOKEN entry in customer_settings.py before appending it with common value
            command_to_exec = """sudo runuser -l root -c 'sed -i "/UNIQUE_TOKEN/d" {}customer_settings.py'""".format(proserv_path)
            server.execute_script(script_contents=command_to_exec)
            
        command_to_exec = f"sudo runuser -l root -c 'cat {to_path} >> {proserv_path}customer_settings.py'"
        server.execute_script(script_contents=command_to_exec)
    
    #Copy BIN(secret-key-for-apache.bin) file from the first CloudBolt instance to the rest insatances.    
    from_path = f"{proserv_path}secret-key-for-apache.bin"
    to_path = "/var/opt/cloudbolt/secrets/secret-key-for-apache.bin"
    first_instance = True
    for server_id in resource.server_ids.split(","):
        server = Server.objects.get(id=int(server_id))
        if first_instance:
            set_progress(f"Copying pg_password from server '{server.hostname}'")
            pg_pwd = server.execute_script(script_contents="sudo runuser -l root -c 'sudo grep postgresql_pass /var/opt/cloudbolt/.postgresql_password'")
            pg_pwd= pg_pwd.split("=")[-1].rstrip("\n")
            db_backup_cmd = f"sudo runuser -l root -c 'PGPASSWORD={pg_pwd} pg_dump -h localhost -p 5432 -U cb_dba -w --clean -F t -f /tmp/cloudbolt.tar cloudbolt'"
            set_progress(f"Taking database backup from server '{server.hostname}'")
            server.execute_script(script_contents=db_backup_cmd,timeout=360)
            
            first_instance = False
            # Download secret-key-for-apache.bin
            copy_file_to_or_from_remote_server(server,key_file_path,to_path,from_path,"download")
        else:
            copy_file_to_or_from_remote_server(server,key_file_path,from_path,to_path,"upload")