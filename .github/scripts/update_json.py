import sys
import json
import shutil
from datetime import datetime

def main():
    if len(sys.argv) != 6:
        print("Not enough arguments are provided")
        sys.exit(1)

    asset_file_path = sys.argv[1]
    input_file_path = sys.argv[2]
    output_file_path = sys.argv[3]
    content_type = sys.argv[4]
    comparing_key = sys.argv[5]
    
    # asset_file_path = "/home/dell/Downloads/recurring-jobs Assets/assets/asset_files/recurring-jobs.json"
    # input_file_path = "/home/dell/Downloads/recurring-jobs.json"    
    # output_file_path = "/home/dell/Downloads/modified_recurring-jobs_new.json"
    
    
    print("asset_file_path", asset_file_path)
    print("input_file_path", input_file_path)
    print("output_file_path", output_file_path)
    

    with open(asset_file_path, "r") as asset_file:
        records = json.load(asset_file)
        for record in records:
            # print("record", record)
            name = record['name']  
            artifact_path = record['artifact_path']  
            sha = record['sha']  
            libraryimageurl = record['library-image-url']  
            
            
            print("name", name)
            print("artifact_path", artifact_path)
            print("sha", sha)
            print("library-image-url", libraryimageurl)
            
            updated = False
            with open(input_file_path, 'r+') as input_file:
                # print("input_file", input_file)
                input_data = json.load(input_file)
                
                print("input_data", input_data)
                for item in input_data:
                    # print("item", item)
                    if item.get(comparing_key) == name:
                        print("Match Found , Deleting the Record")   
                        # item["artifact_path"] = artifact_path
                        # item["sha"] = sha
                        # item["library-image-url"] = libraryimageurl
                        # item["last_updated"] = datetime.now().strftime("%Y-%m-%d")
                        try:
                            del item
                        except Exception as e:
                            print(e)
                            print("Exception Occurred while deleting the object".format(name))
                        updated =True
                    
                        
                  
                   
                # if not updated:
                print(" Adding the New Record ")
                item = record 
                item["collection_type"] = content_type
                item["last_updated"] = datetime.now().strftime("%Y-%m-%d")
                
                input_data.append(item)

                    # # Write the updated data to a new file
                with open(output_file_path, 'w') as output_file:
                    json.dump(input_data, output_file, indent=2)

                
                # use copyfile() 
                shutil.copyfile(output_file_path, input_file_path)

if __name__ == "__main__":
    main()