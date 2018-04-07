import Service from './service';
import * as PIXI from 'pixi.js'

import * as triangleImage from './images/triangle.png';
import * as viperImage from './images/test-viper.png';
import * as arenaImage from './images/isola1-small.jpg';

import { degreesToRadians, lonLatToXY } from './conversions';

import './scss/index.scss';

// Currently hardcoded at 1920x1080, but ideally we get the width of the window
const width = 1920;
const height = 1080;

const testUrl = 'http://127.0.0.1:5000/';
const shipImageSideSize = 70;
const imageScale = 1;
const imageOffsetAngle = 0;
const imageX = 960;
const imageY = 540;
// const imageY = window.innerHeight / 2;

const headingOffset = 0; // Heading does not point directly up in the image
// const headingOffset = 116; // Heading does not point directly up in the image
const originLon = 43.460500;
const originLat = -64.534150;
// const originLon = 42.622185;
// const originLat = -64.288918;

// Centre of image co-ordinates:
const centreLon = 43.54425;
const centreLat = -64.459335;
const centreHeading = 65;

// Planet details
// Pad numbers are LEFT TO RIGHT not actual pad numbers
// LON, LAT, HEADING

// Pad 1: 43.321926, -64.391991, 225
// Pad 2: 43.321926, -64.391991, 225
// Pad 3: 43.261738, -64.440659, 31
// Pad 4: 43.269848, -64.437202, 49
// Pad 5: 43.504578, -64.527588, 114
// Pad 6: 43.478378, -64.564034, 113
// Pad 7: 43.623196, -64.590424, 284
// Pad 8: 43.598091, -64.613457, 289

let pads = [
    {
        'number': 1,
        'lon': 43.321926,
        'lat': -64.391991,
        'heading': 225
    },
    {
        'number': 2,
        'lon': 43.321926,
        'lat': -64.391991,
        'heading': 225
    },
    {
        'number': 3,
        'lon': 43.261738,
        'lat': -64.440659,
        'heading': 31
    },
    {
        'number': 4,
        'lon': 43.269848,
        'lat': -64.437202,
        'heading': 49
    },
    {
        'number': 5,
        'lon': 43.504578,
        'lat': -64.527588,
        'heading': 114
    },
    {
        'number': 6,
        'lon': 43.478378,
        'lat': -64.564034,
        'heading': 113
    },
    {
        'number': 7,
        'lon': 43.623196,
        'lat': -64.590424,
        'heading': 284
    },
    {
        'number': 8,
        'lon': 43.598091,
        'lat': -64.613457,
        'heading': 289
    }
];


console.log('Setting up comms');
const wsService = new Service(testUrl);
wsService.setup();

// Setup an event to respond on latency checks
// wsService.socket.on('latency', (inVar) => {
//     console.log(inVar);
// });

let x = 0.0;
let y = 0.0;
let lon = 0.0;
let lat = 0.0;
let heading = 0.0;
let altitude = 0.0;
let debugInfo = '';

// RIGHT BEHIND PAD: 43.682201, -64.596343, 289

wsService.socket.on('latencyResponse', (response) => {
    let requestTime = response['timestamp_client'];
    let serverTime = response['timestamp'];
    let latency = serverTime - requestTime;
    console.log(`Time sent: ${requestTime}, Time received: ${serverTime}, Latency: ${latency}ms`);
});

wsService.socket.on('overlayPositionUpdate', (response) => {
    console.log(`Position Update Response: ${JSON.stringify(response)}`);
    // Values need to be mapped
    let position = lonLatToXY(originLon, originLat, response.lon, response.lat);
    lon = response.lon;
    lat = response.lat;
    x = position.x * width;
    y = position.y * height;
    heading = degreesToRadians(response.heading + headingOffset);
    altitude = response.altitude;
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
arenaTex.anchor.x = 0.5;
arenaTex.anchor.y = 0.5;
arenaTex.rotation = degreesToRadians(imageOffsetAngle);
arenaTex.x = imageX;
arenaTex.y = imageY;
arenaTex.scale.x = imageScale;
arenaTex.scale.y = imageScale;

// Add the arena image
app.stage.addChild(arenaTex);

// Load in the image of the viper
let image = new Image();
image.src = viperImage;
let viperTex = new PIXI.BaseTexture(image);
let texture = new PIXI.Texture(viperTex);
PIXI.Texture.addToCache(texture, 'viper');
let viper = PIXI.Sprite.fromImage('viper');

viper.width = shipImageSideSize;
viper.height = shipImageSideSize;

// Set the rotation anchor point by the center
viper.anchor.x = 0.5;
viper.anchor.y = 0.5;

// Add the viper
// app.stage.addChild(viper); // Do not add the viper for now

debugInfo = `Lon: ${lon},
Lat: ${lat},
X: ${x},
Y: ${y},
Heading: ${heading},
Altitude: ${altitude}`;

// Add the debug text
let debugText = new PIXI.Text(
    debugInfo,
    {
        align: 'center',
        fill: '#ffffff'
    }
);
// app.stage.addChild(debugText); // Do not add the text

let image = new Image();
image.src = triangleImage;
let triTex = new PIXI.BaseTexture(image);
let texture = new PIXI.Texture(triTex);
PIXI.Texture.addToCache(texture, 'triangle');
// Add the pad triangles
for (let i = 0; i < pads.length; i++) {
    let pad = pads[i];
    console.log(pad);
    let triangle = PIXI.Sprite.fromImage('triangle');
    let position = lonLatToXY(originLon, originLat, pad.lon, pad.lat);
    // let position = lonLatToXY(centreLon, centreLat, pad.lon, pad.lat);
    let x = position.x * width;
    let y = position.y * height;
    triangle.x = x;
    triangle.y = y;
    triangle.anchor.x = 0.5;
    triangle.anchor.y = 0.5;
    const triangleScale = 0.1;
    triangle.scale.x = triangleScale;
    triangle.scale.y = triangleScale;
    triangle.rotation = degreesToRadians(pad['heading']);
    app.stage.addChild(triangle); // Do not add the text
}

// Start the loop
let gameLoop = (delta) => {
    // Update viper image
    viper.rotation = heading;
    viper.x = x;
    viper.y = y;
    // Update debug info
    let headingInDegrees = parseInt((heading * 180) / Math.PI);
    debugInfo = `Lon: ${lon},
    Lat: ${lat},
    X: ${x},
    Y: ${y},
    Heading: ${headingInDegrees},
    Altitude: ${altitude}`;
    debugText.text = debugInfo;
    debugText.position.x = x;
    debugText.position.y = y
}

app.ticker.add(delta => gameLoop(delta));

// Resize to fit the window
app.renderer.view.style.position = 'absolute';
app.renderer.view.style.display = 'block';
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

document.body.appendChild(app.view);
