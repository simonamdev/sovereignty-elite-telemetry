import * as io from 'socket.io-client';

export default class Service {
    constructor(url) {
        this.url = url;
        this.socket = io(url);
    }

    setup() {
        this.setupConnectionEvents();
    }

    setupConnectionEvents() {
        this.socket.on('error', () => {
            console.log('Error');
        });

        this.socket.on('connect_failed', () => {
            console.log('Unable to connect');
            // this.close();
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnecting');
            this.close();
        });

        this.socket.on('reconnecting', () => {
            console.log('Attempting to reconnect');
        });

        this.socket.on('reconnect_failed', () => {
            console.log('Unable to reconnect');
        });
    }

    checkLatency() {
        let timeNow = new Date().getTime();
        this.socket.emit('latency', { timestamp: timeNow });
    }

    close() {
        this.socket.close();
    }
}
