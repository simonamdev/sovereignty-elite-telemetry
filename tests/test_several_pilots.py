import json
import time
import requests
import random

url = 'http://127.0.0.1:5000/data'

pilots = [
    'Pilot A',
    'Pilot B',
    'Pilot C',
    'Pilot D',
    'Pilot E'
]

path = 'data/isola_square.json'

amount = 0

with open(path, 'r') as data_file:
    for line in data_file:
        line_data = json.loads(line)
        data = {
            'name': random.choice(pilots),
            'ship': 'Viper MK3',
            'lon': line_data['Longitude'],
            'lat': line_data['Latitude'],
            'heading': line_data['Heading'],
            'timestamp': int(time.time())
        }
        response = requests.post(
            url=url,
            json=data)
        print(data)
        print(response.status_code)
        time.sleep(0.01)
