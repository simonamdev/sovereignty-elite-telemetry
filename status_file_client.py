import json
import random
import time
import requests
import os

url = 'http://127.0.0.1:5000/data'

user_directory = os.path.expanduser('~')
status_file_directory = os.path.join(user_directory, 'Saved Games\Frontier Developments\Elite Dangerous')
status_file_path = os.path.join(status_file_directory, 'Status.json')
status_file_exists = os.path.isfile(status_file_path)
print('Status file at path: {} exists: {}'.format(status_file_path, status_file_exists))

last_time_modified = 0
while True:
    time_modified = os.stat(status_file_path).st_mtime
    if time_modified > last_time_modified:
        last_time_modified = time_modified
        # Read the file
        file_data = {}
        with open(status_file_path, 'r') as status_file:
            file_data = json.loads(status_file.readline())
            print(file_data)
    time.sleep(0.01)
