import * as http from 'http';
import * as express from 'express';
import * as path from 'path';
import * as cors from 'cors';
import * as SocketIO from 'socket.io';
import * as expressWs from 'express-ws';

const development = process.env.NODE_ENV !== 'production';

// app.use(cors());
const app = express();
const expressWebSock = new expressWs(app);

const port = process.env.PORT || 3000;

let sockets = [];

app.use('/static', express.static('dist'));

app.get('/', (req, res) => {
    res.sendFile(path.resolve('dist/index.html'));
});

app.ws('/', (ws, req) => {
    console.log('Sending latency');
    ws.on('latencyCheck', (msg) => {
        console.log('Latency Check');
    });
    sendLatencyTime(ws);
    sockets.push(ws);
    console.log(`Sockets connected: ${sockets.length}`);
});

let addSocket = (ws) => {
    sockets.push(ws);
    for (let i = sockets.length - 1;)
};

let sendLatencyTime = (ws) => {
    let data = {
        'time': new Date(),
        'event': 'LatencyCheck'
    };
    ws.send(JSON.stringify(data));
};

app.listen(port);
