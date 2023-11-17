# Jupyter Notebook UI Extension
### Setting Up:
- Import the UI extension from the Content Library.
- On the UI Extensions page, click "Sync Static Assets."
- Run these commands in the terminal:
    ```                 
    sudo mkdir /var/run/cloudbolt/jupyterd  
    chown cloudbolt /var/run/cloudbolt/jupyterd  
    service jupyterd restart  
    service httpd restart  
    ```  
                
### Accessing Jupyter Notebook:
- Go to the *All Admin* page.
- You'll find the *Jupyter Notebook* link under the *Admin Extensions* section.
- Click on the link to launch the Jupyter Notebook.

### Creating Files:
- By default, Jupyter starts in the /home/cloudbolt directory.
- Your notebook files will be saved there.
- Create a new Django Shell-Plus File and dive right in!

### Additional Information:
- For additional details and troubleshooting tips, consult the [User Guide](https://cloudboltsoftware.github.io/cloudbolt-forge/sites/NewJupyterXUI/jupyter.html) on the [CloudBolt Forge website.](https://cloudboltsoftware.github.io/cloudbolt-forge/)
