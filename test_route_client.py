import random
from time import sleep

import requests

url = 'http://127.0.0.1:5000/data'

current_lon = 43.617710
current_lat = -64.589546
heading = 225


def add_some_movement():
    global current_lon, current_lon, heading
    # change these additions
    current_lon += random.randint(0, 0)
    current_lon += random.randint(0, 0)
    # heading += 45

while True:
    data = {
        'lon': current_lon,
        'lat': current_lat,
        'heading': heading
    }
    response = requests.post(
        url=url,
        json=data)
    print(response.status_code, data)
    add_some_movement()
    sleep(1)
