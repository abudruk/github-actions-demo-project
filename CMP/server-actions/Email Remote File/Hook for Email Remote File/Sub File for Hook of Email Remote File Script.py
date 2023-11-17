#!/bin/env python

import os

from django.template.loader import render_to_string                                                  

from utilities.mail import send_mail                                                                 


def create_temp_file(basename, contents):
    
    tmpdir = '/tmp'                                                                                  
    tempfile_path = os.path.join(tmpdir, basename)                                          
                                                                                                     
    # Write a temporary file so that it can be attached to an email                                                        
    with open(tempfile_path, 'w') as fd:                                                   
        fd.write(contents) 
   
    return tempfile_path
   
    
def run(Job, server, **kwargs):
    
    remote_file = "{{ remote_file }}"
    recipients = "{{comma_delimmited_recipients}}"
    file_contents = server.execute_script(script_contents="cat {}".format(remote_file))

    file_basename = os.path.basename(remote_file)
    
    recipient_list = recipients.split(',')                                                       
    addresses = [r.strip() for r in recipient_list]                                              
    subject = 'Remote file from server {}'.format(server)                                         
    body = "Please find attached file '{}' from server '{}', compliments of CloudBolt!".format(
        file_basename, server)
    
    mime_type = "text/plain"
    if file_basename.endswith(".html") or file_basename.endswith(".htm"):
        mime_type = "text/html"
    elif file_basename.endswith(".csv"):
        mime_type = "text/csv"
        
    remote_file_path = create_temp_file(file_basename, file_contents)
    send_mail(subject, body, None, addresses,                                                    
              attachments=[(remote_file_path, mime_type)],                                   
              filter_recipients=False)
              
    # Delete the temp file now that it's in the archive                                              
    os.remove(remote_file_path)

    return "", "", ""