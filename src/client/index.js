import Service from './service';

const testUrl = 'http://127.0.0.1:3000/';

console.log('Setting up comms');
const wsService = new Service(testUrl);
wsService.setup();

// Setup an event to respond on latency checks
wsService.socket.on('latency', (inVar) => {
    console.log(inVar);
});
