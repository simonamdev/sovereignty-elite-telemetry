import time
import requests

url = 'http://127.0.0.1:5000/data'


pads = [
    {
        'number': 1,
        'lon': 43.321926,
        'lat': -64.391991,
        'heading': 225
    },
    {
        'number': 2,
        'lon': 43.321926,
        'lat': -64.391991,
        'heading': 225
    },
    {
        'number': 3,
        'lon': 43.261738,
        'lat': -64.440659,
        'heading': 31
    },
    {
        'number': 4,
        'lon': 43.269848,
        'lat': -64.437202,
        'heading': 49
    },
    {
        'number': 5,
        'lon': 43.504578,
        'lat': -64.527588,
        'heading': 114
    },
    {
        'number': 6,
        'lon': 43.478378,
        'lat': -64.564034,
        'heading': 113
    },
    {
        'number': 7,
        'lon': 43.623196,
        'lat': -64.590424,
        'heading': 284
    },
    {
        'number': 8,
        'lon': 43.598091,
        'lat': -64.613457,
        'heading': 289
    }
]


while True:
    for pad in pads:
        data = {
            'lon': pad['lon'],
            'lat': pad['lat'],
            'heading': pad['heading'],
            'timestamp': int(time.time())
        }
        response = requests.post(
            url=url,
            json=data)
        print(response.status_code, pad)
        time.sleep(1)
