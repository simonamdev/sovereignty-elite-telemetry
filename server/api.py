import json
import time

from flask import Flask, request, abort
from flask_socketio import SocketIO, emit
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
socketio = SocketIO(app)

api_header_name = 'API-KEY'
debug_mode = True
api_key = 'test'


def check_api_key():
    request_api_key = request.headers.get(api_header_name)
    if not api_key == request_api_key:
        abort(401)


"""
API Routes
"""


@app.route('/')
def index():
    return 'Index Page'


@app.route('/data', methods=['POST'])
def data():
    data_dict = request.get_json()
    print(data_dict)
    socketio.emit('overlayPositionUpdate', data_dict)
    return 'OK'


"""
Websocket Routes
"""


@socketio.on('latency', namespace='/')
def latency_check(data):
    print(data)
    current_time = int(round(time.time() * 1000))
    emit('latencyResponse', {'timestamp': current_time, 'timestamp_client': data['timestamp']})


@socketio.on('positionUpdate', namespace='/')
def latency_check(data):
    print('X: {}, Y: {}'.format(data['x'], data['y']))
    emit('overlayPositionUpdate', data)


if __name__ == '__main__':
    socketio.run(app, debug=debug_mode)
