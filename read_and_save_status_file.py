import json
import time
import os

url = 'http://127.0.0.1:5000/data'

current_directory = os.path.dirname(os.path.relpath(__file__))
save_file_path = os.path.join(current_directory, 'saved_data_{}.json'.format(
    int(time.time())
))

user_directory = os.path.expanduser('~')
status_file_directory = os.path.join(user_directory, 'Saved Games\Frontier Developments\Elite Dangerous')
status_file_path = os.path.join(status_file_directory, 'Status.json')
status_file_exists = os.path.isfile(status_file_path)
print('Status file at path: {} exists: {}'.format(status_file_path, status_file_exists))

if not status_file_exists:
    print('ERROR: Cannot find status file.json')
    input('Press any key to exit')

last_time_modified = 0
data = {}
while True:
    time_modified = os.stat(status_file_path).st_mtime
    if time_modified > last_time_modified:
        last_time_modified = time_modified
        # Read the file
        print('Reading status file')
        with open(status_file_path, 'r') as status_file:
            for line in status_file:
                if line[0] == '{':
                    data = json.loads(line)
        # data_to_be_saved = {
        #     'full_data': data,
        #     'lon': data['Longitude'],
        #     'lat': data['Latitude'],
        #     'heading': data['Heading'],
        #     'altitude': data['Altitude'],
        #     'timestamp': int(time.time())
        # }
        print('Writing data')
        with open(save_file_path, 'a', encoding='utf8') as save_file:
            save_file.write(json.dumps(data) + '\n')
        print(data)
    time.sleep(0.01)
