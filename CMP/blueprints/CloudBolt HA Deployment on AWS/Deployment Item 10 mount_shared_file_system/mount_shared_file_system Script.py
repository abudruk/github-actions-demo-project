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
    proserv_path = getattr(settings, "PROSERV_DIR", None)
    # resource = Resource.objects.get(id=1264)  # For testing only
    resource = kwargs.get('resource')
    key_file_path = f"{proserv_path}{resource.ec2_key_name}.pem"
    filesystem_id = resource.efs_id
    region = resource.aws_region_ha
    efs_dns_name = f"{filesystem_id}.efs.{region}.amazonaws.com"
    first_instance = True
    
    for server_id in resource.server_ids.split(","):
        server = Server.objects.get(id=int(server_id))
        set_progress(f"Installing NFS Client on '{server.hostname}'")
        script_output = server.execute_script(script_contents="sudo runuser -l root -c 'yum install nfs-utils'",timeout=360)  # Default timeout is 120
        
        set_progress(f"Creating /mnt/efs directory on '{server.hostname}'")
        script_output = server.execute_script(script_contents="sudo runuser -l root -c 'mkdir -p /mnt/efs'")
        
        set_progress(f"Mounting EFS file system on '{server.hostname}'")
        
        script_output = server.execute_script(script_contents="sudo runuser -l root -c 'mount -t nfs4 -o nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2,noresvport {}:/ /mnt/efs'".format(efs_dns_name))
        
        if first_instance:
            server.execute_script(script_contents="sudo runuser -l root -c 'mv /var/opt/cloudbolt /mnt/efs/cloudbolt'")
            is_exist = server.execute_script(script_contents="[ -d '/var/log/cloudbolt/jobs' ] && echo 'YES' || echo 'NO'")
            if is_exist.split("\n")[0] == "YES":
                server.execute_script(script_contents="sudo runuser -l root -c 'mv /var/log/cloudbolt/jobs /mnt/efs/jobs'")
            else:
                server.execute_script(script_contents="sudo runuser -l root -c 'mkdir -p /mnt/efs/jobs'")
            server.execute_script(script_contents="sudo runuser -l root -c 'mv /var/www/html/cloudbolt/static /mnt/efs/static'")
            first_instance = False
        else:
            server.execute_script(script_contents="sudo runuser -l root -c 'rm -rf /var/opt/cloudbolt'")
            server.execute_script(script_contents="sudo runuser -l root -c 'rm -rf /var/log/cloudbolt/jobs'")
            server.execute_script(script_contents="sudo runuser -l root -c 'rm -rf /var/www/html/cloudbolt/static'")
        
        set_progress(f"Creating some required directories on '{server.hostname}'")    
        server.execute_script(script_contents="sudo runuser -l root -c 'mkdir -p /var/opt/cloudbolt'")  # here -p avoinds error if dir already exists
        server.execute_script(script_contents="sudo runuser -l root -c 'mkdir -p /var/log/cloudbolt/jobs'")
        server.execute_script(script_contents="sudo runuser -l root -c 'mkdir -p /var/www/html/cloudbolt/static'")
        
        set_progress(f"Mapping some required directories with EFS on '{server.hostname}'")
        server.execute_script(script_contents="sudo runuser -l root -c 'mount -t nfs4 -o nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2,noresvport {}:/cloudbolt /var/opt/cloudbolt'".format(efs_dns_name)) 
        server.execute_script(script_contents="sudo runuser -l root -c 'mount -t nfs4 -o nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2,noresvport {}:/jobs /var/log/cloudbolt/jobs'".format(efs_dns_name)) 
        server.execute_script(script_contents="sudo runuser -l root -c 'sudo mount -t nfs4 -o nfsvers=4.1,rsize=1048576,wsize=1048576,hard,timeo=600,retrans=2,noresvport {}:/static /var/www/html/cloudbolt/static'".format(efs_dns_name)) 
        
        set_progress(f"Updating fstab file on '{server.hostname}'")
        local_file_path = f"{proserv_path}fstab_setting.txt"
        remote_file_path = f"/tmp/fstab_setting.txt"
        lines = []
        lines.append("""{}:/cloudbolt /var/opt/cloudbolt nfs rw,hard,intr,rsize=8192,wsize=8192,timeo=14 0 0\n""".format(efs_dns_name))
        lines.append("""{}:/jobs /var/log/cloudbolt/jobs nfs rw,hard,intr,rsize=8192,wsize=8192,timeo=14 0 0\n""".format(efs_dns_name))
        lines.append("""{}:/static /var/www/html/cloudbolt/static nfs rw,hard,intr,rsize=8192,wsize=8192,timeo=14 0 0""".format(efs_dns_name))
        with open(local_file_path, "w") as f:
            f.writelines(lines)
            
        copy_file_to_or_from_remote_server(server,key_file_path,local_file_path,remote_file_path,"upload")
        
        server.execute_script(script_contents=f"sudo runuser -l root -c 'cat {remote_file_path} >> /etc/fstab'")