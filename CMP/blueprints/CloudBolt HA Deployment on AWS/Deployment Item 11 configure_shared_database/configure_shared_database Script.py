from common.methods import set_progress
from infrastructure.models import Server,CustomField
from django.conf import settings
import paramiko,time

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
    
def run(job, *args, **kwargs):
    resource = kwargs.get('resource')
    upload_dir = getattr(settings, "MEDIA_ROOT", None)
    proserv_path = getattr(settings, "PROSERV_DIR", None)
    key_file_path = f"{proserv_path}{resource.ec2_key_name}.pem"
    first_instance = True
    for server_id in resource.server_ids.split(","):
        server = Server.objects.get(id=int(server_id))
        if first_instance:
            server.execute_script(script_contents="sudo runuser -l root -c 'systemctl stop postgresql-14'")
            server.execute_script(script_contents="sudo runuser -l root -c 'systemctl disable postgresql-14'")
            set_progress(f"Copying database setting file on server '{server.hostname}'")
            copy_file_to_or_from_remote_server(server,key_file_path,f"{proserv_path}db_section.txt",f"/tmp/db_section.txt","upload")
            set_progress(f"Modifying customer_setting.py file on server '{server.hostname}'")
            # Note:- As EFS mounting is done already,we dont need to modify customer_setting.py file in each instance
            server.execute_script(script_contents="sudo runuser -l root -c 'cat /tmp/db_section.txt | base64 --decode >> /var/opt/cloudbolt/proserv/customer_settings.py'")
            server.execute_script(script_contents="sudo runuser -l root -c 'systemctl restart httpd'")
            server.execute_script(script_contents="sudo runuser -l root -c 'systemctl start postgresql-14'")
            server.execute_script(script_contents="sudo runuser -l root -c 'systemctl enable postgresql-14'")
            set_progress(f"Creating relations in database on server '{server.hostname}'. This may take 15-20 minutes, Be patient and wait")
            server.execute_script(script_contents="sudo runuser -l root -c '/opt/cloudbolt/manage.py migrate'",timeout=1200)
            first_instance = False
        server.execute_script(script_contents="sudo runuser -l root -c 'systemctl restart httpd'")