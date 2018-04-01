import * as http from 'http';
import * as express from 'express';
import * as path from 'path';
import * as cors from 'cors';
import * as SocketIO from 'socket.io';

const development = process.env.NODE_ENV !== 'production';

// app.use(cors());
const app = express();
const server = http.Server(app);
const io = new SocketIO(server, {
    origins: '*'
});
const port = process.env.PORT || 3000;

// io.set('origins', 'http://127.0.0.1:3000');
io.on('connection', (socket) => {
    console.log('Client connected');
    // Latency Check
    socket.on('latency', () => {
        socket.emit('latency');
    });
});

app.use('/static', express.static('dist'));

app.get('/', (req, res) => {
    res.sendFile(path.resolve('dist/index.html'));
});

server.listen(port, () => {
    console.log(
        `SOV Elite Telemetry running on port ${port}, in dev mode: ${process.env.NODE_ENV}`
    );
});
