#!/usr/bin/env bash

echo "
----------------------
  Update the local repository
----------------------
"
# sudo yum clean all
sudo yum update -y

echo "
----------------------
  Setup MongoDB Repo
----------------------
"

if [ -f "$/etc/yum.repos.d/mongodb.repo" ]; then
  # update the mongo db repo permission
  sudo chmod 777 /etc/yum.repos.d/mongodb.repo
else
  # create mongodb repo file 
  sudo touch /etc/yum.repos.d/mongodb.repo

  # update the mongo db repo permission to udate the file
  sudo chmod 777 /etc/yum.repos.d/mongodb.repo
fi

# update mongodb repo file content
sudo echo $'[mongodb-org-6.0] \nname=MongoDB Repository \nbaseurl=https://repo.mongodb.org/yum/redhat/$releasever/mongodb-org/6.0/x86_64/ \ngpgcheck=1 \nenabled=1 \ngpgkey=https://www.mongodb.org/static/pgp/server-6.0.asc' > /etc/yum.repos.d/mongodb.repo

# set default permission for the mongo db repo file 
sudo chmod 644 /etc/yum.repos.d/mongodb.repo

echo "
----------------------
  MongoDB Repo File
----------------------
"
sudo cat /etc/yum.repos.d/mongodb.repo

echo "
----------------------
  Installing MongoDB
  Reference - https://www.mongodb.com/docs/manual/tutorial/install-mongodb-on-red-hat/
----------------------
"
sudo yum install -y mongodb-org

echo "
----------------------
  Start MongoDB Process
----------------------
"
sudo systemctl start mongod

echo "
----------------------
  Verify MongoDB Process has started
----------------------
"
sudo systemctl daemon-reload

echo "
----------------------
  Set mongodb to start automatically on system startup
----------------------
"
sudo systemctl enable mongod

echo "
------------------------
  Enable mongodb port for all ipv4
------------------------
"
sudo chmod 777 /etc/mongod.conf
sudo sed -i 's/127.0.0.1/0.0.0.0/' /etc/mongod.conf
sudo chmod 644 /etc/mongod.conf
sudo systemctl restart mongod

echo "
----------------------
  Mongodb Status
----------------------
"
sudo systemctl status mongod


echo "
----------------------
  UFW (FIREWALL)
----------------------
"
# install firewalld
sudo yum install -y firewalld

# start firewalld and enable it to auto-start at system boot, then check its status.
sudo systemctl start firewalld
sudo systemctl enable firewalld
sudo systemctl status firewalld

# the following commands to allow HTTP and HTTPS traffic
sudo firewall-cmd --zone=public --add-port=80/tcp --permanent
sudo firewall-cmd --zone=public --add-port=8081/tcp --permanent
sudo firewall-cmd --zone=public --add-port=27017/tcp --permanent
sudo firewall-cmd --permanent --zone=public --add-service=http
sudo firewall-cmd --permanent --zone=public --add-service=https
sudo firewall-cmd --reload

echo  "
----------------------
  All incoming traffic on TCP ports 27017
----------------------
"

echo  "
----------------------
 Setup MongoDB WEB UI
----------------------
"
# install docker
sudo yum install -y yum-utils
sudo yum-config-manager  --add-repo https://download.docker.com/linux/centos/docker-ce.repo
sudo yum install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin

# start docker
sudo systemctl start docker

# install docker-compose
sudo curl -L "https://github.com/docker/compose/releases/download/1.23.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# check docker-compose version
docker-compose --version

# add docker user and group
sudo usermod -aG docker ${USER}
sudo ln -s /usr/local/bin/docker-compose /usr/bin/docker-compose
sudo service docker restart

echo "
----------------------
 Create MongoDB docker compose yaml file
----------------------
"
cur_dir=$(pwd)

mkdir $cur_dir/mongo_web

# get ec2 intance public ip
PUBLIC_IP=$(curl -s ifconfig.me)
IN_V="PUBLIC_IP"

# create python file to conver json to yaml
sudo echo -e 'import yaml \ndata={ \n"version": "3", \n"services": { \n"mongo-express": { \n"image": "mongo-express:latest", \n"container_name": "mongo-web", \n"restart": "unless-stopped", \n"ports": [ \n"8081:8081" \n], \n"environment": { \n"ME_CONFIG_MONGODB_ADMINUSERNAME": "root", \n"ME_CONFIG_MONGODB_ADMINPASSWORD": "password", \n"ME_CONFIG_MONGODB_URL": "mongodb://PUBLIC_IP:27017/" \n} \n} \n} \n} \nf=open("docker-compose.yaml","w") \nf.write(yaml.dump(data)) \nf.close' > $cur_dir/mongo_web/convert_json_to_yaml.py

# set ec2 instance public ip
sudo sed -i "s/${IN_V}/${PUBLIC_IP}/" $cur_dir/mongo_web/convert_json_to_yaml.py

# change dir
cd $cur_dir/mongo_web/

# convert json to yaml file
python convert_json_to_yaml.py

# start docker-compose
sudo docker-compose up -d

echo "
---------------------- 
  Mongodb Install successfully
----------------------
"