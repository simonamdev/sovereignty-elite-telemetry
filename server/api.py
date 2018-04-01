import time

from flask import Flask, request, abort
from flask_socketio import SocketIO, emit

app = Flask(__name__)
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


"""
Websocket Routes
"""


@socketio.on('latency', namespace='/')
def latency_check(data):
    current_time = int(round(time.time() * 1000))
    emit('latencyResponse', {'timestamp': current_time, 'timestamp_client': data['timestamp']})


if __name__ == '__main__':
    socketio.run(app, debug=debug_mode)
