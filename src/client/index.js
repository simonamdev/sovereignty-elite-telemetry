import Service from './service';
import * as PIXI from 'pixi.js'

import * as viperImage from './images/test-viper.png';
import * as arenaImage from './images/isola1-small.jpg';

import { degreesToRadians, lonLatToXY } from './conversions';

import './scss/index.scss';

const testUrl = 'http://127.0.0.1:5000/';
const imageSideSize = 23;
const originLon = 43.458008;
const originLat = -64.533900;

console.log('Setting up comms');
const wsService = new Service(testUrl);
wsService.setup();

// Setup an event to respond on latency checks
// wsService.socket.on('latency', (inVar) => {
//     console.log(inVar);
// });

let x = 0.0;
let y = 0.0;
let heading = 0.0;

wsService.socket.on('latencyResponse', (response) => {
    let requestTime = response['timestamp_client'];
    let serverTime = response['timestamp'];
    let latency = serverTime - requestTime;
    console.log(`Time sent: ${requestTime}, Time received: ${serverTime}, Latency: ${latency}ms`);
});

wsService.socket.on('overlayPositionUpdate', (response) => {
    console.log(`Position Update Response: ${JSON.stringify(response)}`);
    // Values need to be mapped
    // Currently hardcoded at 1920x1080, but ideally we get the width of the window
    const width = 1920;
    const height = 1080;
    let position = lonLatToXY(originLon, originLat, response.lon, response.lat);
    x = position.x * width;
    y = position.y * height;
    heading = degreesToRadians(response.heading);
    console.log('X: ' + x + ', Y: ' + y + ', Heading: ' + heading);
});

// let latencyCheck = setInterval(() => {
//     console.log('Checking latency');
//     wsService.checkLatency();
// }, 1000);
//
// let positionEmit = setInterval(() => {
//     let x = Math.random() * 560;
//     let y = Math.random() * 560;
//     let heading = Math.random() * 360;
//     // console.log(`X: ${x}, Y: ${y}`);
//     let timeNow = new Date().getTime();
//     let data = {
//         timestamp: timeNow,
//         x: x,
//         y: y,
//         heading: heading
//     };
//     wsService.socket.emit('positionUpdate', data);
// }, 500);

// Rendering Part
let app = new PIXI.Application({width: 1920, height: 1080});

// Load in image of the arena
let image = new Image();
image.src = arenaImage;
let arenaTex = new PIXI.BaseTexture(image);
let texture = new PIXI.Texture(arenaTex);
PIXI.Texture.addToCache(texture, 'arena');
let arenaTex = PIXI.Sprite.fromImage('arena');

// Add the arena image
app.stage.addChild(arenaTex);

// Load in the image of the viper
let image = new Image();
image.src = viperImage;
let viperTex = new PIXI.BaseTexture(image);
let texture = new PIXI.Texture(viperTex);
PIXI.Texture.addToCache(texture, 'viper');
let viper = PIXI.Sprite.fromImage('viper');

viper.width = imageSideSize;
viper.height = imageSideSize;

// Set the rotation anchor point by the center
viper.anchor.x = 0.5;
viper.anchor.y = 0.5;

// Add the viper
app.stage.addChild(viper);

// Start the loop
let gameLoop = (delta) => {
    viper.x = x;
    viper.y = y;
    viper.rotation = heading;
}

app.ticker.add(delta => gameLoop(delta));

// Resize to fit the window
app.renderer.view.style.position = 'absolute';
app.renderer.view.style.display = 'block';
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

document.body.appendChild(app.view);
