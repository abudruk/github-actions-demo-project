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
    
    print("asset_file_path", asset_file_path)
    print("input_file_path", input_file_path)
    print("output_file_path", output_file_path)
    

    with open(asset_file_path, "r") as asset_file:
        records = json.load(asset_file)
        for record in records:
            name = record[comparing_key]  
            artifact_path = record['artifact_path']  
            sha = record['sha']  
            libraryimageurl = record['library-image-url']  
            
            print("name", name)
            print("artifact_path", artifact_path)
            print("sha", sha)
            print("library-image-url", libraryimageurl)
            
            with open(input_file_path, 'r+') as input_file:
                # print("input_file", input_file)
                input_data = json.load(input_file)
                
                print("input_data", input_data)
                for item in input_data:
                    # print("item", item)
                    if item.get(comparing_key) == name:
                        print("Match Found , Deleting this Completed Record")   
                        try:
                            # del input_data.remove(item)
                            print("Removing Element ", item)
                            element_to_remove = item
                            #Filter list where we take off this item from list t, the item that should be deleted. 
                            input_data = [object for object in input_data if object != element_to_remove]

                        except Exception as e:
                            print(e)
                            print("Exception Occurred while deleting the object".format(name))
                    
                        
                # if not updated:
                print("Adding New Record with Updated Details ")
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