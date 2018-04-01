import Service from './service';

const testUrl = 'http://localhost:5000/';
// const testUrl = 'http://127.0.0.1:5000/';

console.log('Setting up comms');
const wsService = new Service(testUrl);
wsService.setup();

// Setup an event to respond on latency checks
// wsService.socket.on('latency', (inVar) => {
//     console.log(inVar);
// });

wsService.socket.on('latencyResponse', (response) => {
    let requestTime = response['timestamp_client'];
    let serverTime = response['timestamp'];
    let latency = serverTime - requestTime;
    console.log(`Time sent: ${requestTime}, Time received: ${serverTime}, Latency: ${latency}ms`);
})

setInterval(() => {
    console.log('Checking latency');
    wsService.checkLatency();
}, 1000);
