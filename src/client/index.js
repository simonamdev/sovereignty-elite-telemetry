// import Service from './service';

const testUrl = 'ws://127.0.0.1:3000/';

console.log('Setting up comms');
// const wsService = new Service(testUrl);
// wsService.setup();
//
// // Setup an event to respond on latency checks
// wsService.socket.on('latency', (inVar) => {
//     console.log(inVar);
// });

let ws = new WebSocket(testUrl);
ws.onopen = () => {
    console.log('Connected to server');
};

ws.onmessage = (event) => {
    let data = JSON.parse(event.data);
    console.log(data);
    if (data['event'] === 'LatencyCheck') {
        let currentTime = new Date();
        let timeDifference = Math.abs(currentTime.getTime() - new Date(data.time).getTime());
        console.log(currentTime.getTime());
        console.log(`Time difference: ${timeDifference}ms`);
    }
}
