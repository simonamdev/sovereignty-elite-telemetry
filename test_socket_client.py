from threading import Thread

import time
from socketIO_client import SocketIO

host = 'localhost'
port = 5000


class TwoWayClient(object):
    def on_event(self, event):
        print(event)

    def __init__(self):
        self.socketio = SocketIO(host, port)
        self.socketio.on('latencyResponse', self.on_event)

        self.receive_events_thread = Thread(target=self._receive_events_thread)
        self.receive_events_thread.daemon = True
        self.receive_events_thread.start()

        while True:
            self.socketio.emit('latency', {'timestamp': int(time.time())})

    def _receive_events_thread(self):
        self.socketio.wait(seconds=0.1)


def main():
    TwoWayClient()


if __name__ == "__main__":
    main()
