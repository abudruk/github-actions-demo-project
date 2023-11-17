#!/usr/bin/env bash

echo "
----------------------
  Update the local repository
----------------------
"
sudo yum update -y

echo "
----------------------
  Install NODE & NPM
----------------------
"
# set noderepo
curl –sL https://rpm.nodesource.com/setup_14.x | sudo bash -

# Install nodejs
sudo yum install -y nodejs

# check the node version
node --version

# check the npm version
npm --version

## You may also need development tools to build native addons:
sudo yum install -y gcc gcc-c++ make

## To install the Yarn package manager, run:
curl -sL https://dl.yarnpkg.com/rpm/yarn.repo | sudo tee /etc/yum.repos.d/yarn.repo

# install yarn
sudo yum install -y yarn


echo "
----------------------
  PM2
----------------------
"
# install pm2 with npm
sudo npm install -g pm2

# set pm2 to start automatically on system startup
sudo pm2 startup systemd

sleep 60

echo "
----------------------
  Setup NGINX
----------------------
"
# Install EPEL source
sudo yum install -y epel-release

# install nginx
sudo yum install -y nginx

# start nginx and enable it to auto-start at system boot, then check its status.
sudo systemctl enable nginx
sudo systemctl start nginx
sudo systemctl status nginx

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
sudo firewall-cmd --zone=public --add-port=8004/tcp --permanent
sudo firewall-cmd --permanent --zone=public --add-service=http
sudo firewall-cmd --permanent --zone=public --add-service=https
sudo firewall-cmd --reload

echo "
----------------------
  Setup MERN Stack Web Application
----------------------
"

echo "
----------------------
  Install wget, git and unzip packages
----------------------
"
# Install git 
sudo yum install -y git

# Install wget
sudo yum install -y wget

# Install unzip 
sudo yum install -y unzip


echo "
----------------------
  Download MERN Stack E-Book Application Zip
----------------------
"
cur_dir=$(pwd)

cd $cur_dir

# clone back end project from github
sudo wget https://github.com/CloudBoltSoftware/cloudbolt-forge/raw/master/blueprints/mern_stack_on_centos/mern-stack-e-book-demo.zip

# unzip e-book application
sudo unzip $cur_dir/mern-stack-e-book-demo.zip

echo "
-----------------------------------
  Setup E-Book API
---------------------------------
"
# update ownership
sudo chown centos:centos -R $cur_dir/mern-stack-e-book-demo

# Navigate into the back-end directory and install all required npm package
cd $cur_dir/mern-stack-e-book-demo/backend

echo "
-----------------------------------
  Update MongoDB Connection String
---------------------------------
"
# get ec2 intance public ip
PUBLIC_IP=$(curl -s ifconfig.me)
IN_MO_DB="mongodb_connection_string"
OU_MO_DB="mongodb://{{blueprint_context.mongodbvm.server.ip}}:27017/cloudbolt"

sudo sed -i "s|${IN_MO_DB}|${OU_MO_DB}|g"  config/default.json

echo "
----------------------
  Install npm
----------------------
"
sudo npm install

echo "
----------------------
  Start pm2 server
----------------------
"
# Start the API using the PM2 process manager
sudo pm2 start app.js

echo "
-----------------------------------
  Setup E-Book UI
---------------------------------
"
cd $cur_dir/mern-stack-e-book-demo/frontend

# update public ip in .env file
sudo sed -i "s|PUBLIC_IP|${PUBLIC_IP}|g"  .env

# update package.json file
sudo sed -i "s|PUBLIC_IP|${PUBLIC_IP}|g"  package.json

# update backend api endpoint
sudo sed -i "s|PUBLIC_IP|${PUBLIC_IP}|g" src/utils/constant.js

echo "
----------------------
  Install & Build npm
----------------------
"
sudo npm install

# generate react build folder
sudo npm run build


echo "
--------------------------------------------------------------
  Configure NGINX to serve the Node.js API and React front-end
--------------------------------------------------------------
"

# Negigate the Nginx server directory
cd /etc/nginx

# change permission, to add new config file
sudo  chmod 777 conf.d

# Create a MERN Stack config file for a API.
sudo echo -e "upstream my_nodejs_upstream { \n server 127.0.0.1:4000; \n keepalive 64; \n }  \n server {  \n   listen 8004;  \n   server_name PUBLIC_IP;   \n  root $cur_dir/mern-stack-e-book-demo/bacnkend;   \n location / {    \n    proxy_set_header X-Forwarded-For proxy_add_x_forwarded_for;    \n    proxy_set_header Host http_host;    \n    proxy_set_header X-NginX-Proxy true;   \n    proxy_http_version 1.1;    \n    proxy_set_header Upgrade http_upgrade;    \n   proxy_set_header Connection "upgrade";   \n     proxy_max_temp_file_size 0;   \n     proxy_pass http://my_nodejs_upstream/;  \n     proxy_redirect off; \n     proxy_read_timeout 240s;  \n } \n }" > /etc/nginx/conf.d/mern_stack_api.conf

# Create a MERN Stack config file for a front-end web application.
sudo echo -e "server { \n listen 0.0.0.0:80; \n   server_name UI_PUBLIC_IP; \n\n # react app & front-end files \n location / {  \n    root $cur_dir/mern-stack-e-book-demo/frontend/build; \n try_files \$uri /index.html; \n } \n # node api reverse proxy \n location /api/ { \n proxy_pass http://API_PUBLIC_IP:8004/; \n } \n }" > /etc/nginx/conf.d/mern_stack_frontend.conf

# update public ip in API config
sudo sed -i "s|PUBLIC_IP|${PUBLIC_IP}|g"  /etc/nginx/conf.d/mern_stack_api.conf
sudo sed -i "s|UI_PUBLIC_IP|${PUBLIC_IP}|g"  /etc/nginx/conf.d/mern_stack_frontend.conf
sudo sed -i "s|API_PUBLIC_IP|${PUBLIC_IP}|g"  /etc/nginx/conf.d/mern_stack_frontend.conf
sudo sed -i 's/proxy_add_x_forwarded_for/$proxy_add_x_forwarded_for/' /etc/nginx/conf.d/mern_stack_api.conf
sudo sed -i 's/http_host/$http_host/' /etc/nginx/conf.d/mern_stack_api.conf
sudo sed -i 's/http_upgrade/$http_upgrade/' /etc/nginx/conf.d/mern_stack_api.conf

# reset the default permissions and ownership
sudo chmod 644 /etc/nginx/conf.d/mern_stack_api.conf
sudo chown root:root /etc/nginx/conf.d/mern_stack_api.conf
sudo chmod 644 /etc/nginx/conf.d/mern_stack_frontend.conf
sudo chown root:root /etc/nginx/conf.d/mern_stack_frontend.conf

# reset the default permission
sudo chmod 755 conf.d

# change permission, to update the user name in file
sudo chmod 777 nginx.conf

# update username
sudo sed -i 's/user nginx;/user centos;/' nginx.conf

# reset the default permission
sudo chmod 644 nginx.conf

# reload nginx config files
sudo nginx -s reload

# disbale SE linux
sudo setenforce 0


echo "
--------------------------------------
  Restart Nginx Server & Check Status
--------------------------------------
"
# Restart the Nginx Server
sudo systemctl restart nginx

# Nginx server status
sudo systemctl status nginx

echo "
-----------------------------------
  Import sample book data
---------------------------------
"
sudo curl -X POST http://${PUBLIC_IP}:8004/api/books -H "Content-Type: application/json" -d @$cur_dir/mern-stack-e-book-demo/backend/data/sample_book.json

echo "
----------------------
  MERN Stack Web Application deployment completed successfully.
----------------------
"