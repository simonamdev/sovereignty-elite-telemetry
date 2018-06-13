import time
import requests

url = 'http://127.0.0.1:5000/data'

# Pad 5
current_lon = 43.623199
current_lat = -64.590439
heading = 109

# Pad 6
# current_lon = 43.603252
# current_lat = -64.614822
# heading = 109


while True:
    data = {
        'lon': current_lon,
        'lat': current_lat,
        'heading': heading,
        'timestamp': int(time.time())
    }
    response = requests.post(
        url=url,
        json=data)
    print(response.status_code, data)
    time.sleep(1)
