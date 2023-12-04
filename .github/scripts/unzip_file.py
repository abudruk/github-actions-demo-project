import zipfile
import os
import sys

def unzip_file(zip_path, extract_path):
    with zipfile.ZipFile(zip_path, 'r') as zip_ref:
        zip_ref.extractall(extract_path)

if __name__ == "__main__":
    if len(sys.argv) != 2:
        print("Usage: python unzip_file.py <zipFilePath>")
        sys.exit(1)

    zip_path = sys.argv[1]
    extract_path = "downloads"  # Replace with the desired extraction path

    unzip_file(zip_path, extract_path)