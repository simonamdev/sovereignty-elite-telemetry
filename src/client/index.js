import Service from './service';
import * as PIXI from 'pixi.js'

import * as circleImage from './images/circle.png';
import * as triangleImage from './images/triangle.png';
import * as viperImage from './images/test-viper.png';
import * as arenaImage from './images/isola3-large.jpg';
// import * as arenaImage from './images/isola2-small.jpg';

import { degreesToRadians, lonLatToXY, normalise } from './conversions';

import Pilot from './models/pilot';
import Pane from './pane';

import './scss/index.scss';

// Create side Pane
let pane = new Pane();
pane.createPane();

// Currently hardcoded at 1920x1080, but ideally we get the width of the window
const width = 1920;
const height = 1080;

// Centre of image co-ordinates:

// CENTRE JUST ABOVE THE SQUARE PLATFORM BELOW THE SPIRES
// const centreLon = 43.428566;
// const centreLat = -64.492012;
const centreHeading = 65;

const testUrl = 'http://127.0.0.1:5000/';
const shipImageSideSize = 35;
const imageScale = 1;
const imageOffsetAngle = 0;
// const imageOffsetAngle = centreHeading;
const imageX = 960;
const imageY = 540;
// const imageY = window.innerHeight / 2;

const headingOffset = -53;
// const headingOffset = 116; // Heading does not point directly up in the image
const originLon = 43.471321;
const originLat = -63.881687;


console.log('Setting up comms');
const wsService = new Service(testUrl);
wsService.setup();

// Setup an event to respond on latency checks
// wsService.socket.on('latency', (inVar) => {
//     console.log(inVar);
// });

let contestantData = {};

let x = 0.0;
let y = 0.0;
let lon = 0.0;
let lat = 0.0;
let heading = 0.0;
let altitude = 0.0;
let debugInfo = '';

// RIGHT BEHIND PAD: 43.682201, -64.596343, 289

// wsService.socket.on('latencyResponse', (response) => {
//     let requestTime = response['timestamp_client'];
//     let serverTime = response['timestamp'];
//     let latency = serverTime - requestTime;
//     console.log(`Time sent: ${requestTime}, Time received: ${serverTime}, Latency: ${latency}ms`);
// });

wsService.socket.on('overlayPositionUpdate', (data) => {
    console.log(`Position Update data: ${JSON.stringify(data)}`);
    updatePilotData(data);
});

let updatePilotData = (data) => {
    let contestantNames = getContestantNames();
    let pilotAlreadyRegistered = inArray(data.name, contestantNames);
    if (pilotAlreadyRegistered) {
        // Update data
        contestantData[data.name].updateLocation(
            data.lon,
            data.lat,
            data.heading
        );
    } else {
        // Init image and pass to new pilot
        let pixiData = initialiseShipImage(data);
        let image = pixiData[0];
        let text = pixiData[1];
        contestantData[data.name] = new Pilot(
            data.name,
            data.isContestant,
            {
                lon: data.lon,
                lat: data.lat,
                heading: data.heading
            },
            data.ship,
            image,
            text
        );
    }
};

let getContestantNames = () => {
    return Object.keys(contestantData);
};

let inArray = (val, arr) => {
    return arr.indexOf(val) >= 0;
};

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

let initialiseShipImage = (data) => {
    console.log(`Initialising image for pilot: ${data.name}`);
    // Load in the image of the viper
    let image = new Image();
    image.src = viperImage;
    let viperTex = new PIXI.BaseTexture(image);
    let texture = new PIXI.Texture(viperTex);
    PIXI.Texture.addToCache(texture, `viper-${data.name}`);
    let viper = PIXI.Sprite.fromImage(`viper-${data.name}`);

    viper.width = shipImageSideSize;
    viper.height = shipImageSideSize;

    // Set the rotation anchor point by the center
    viper.anchor.x = 0.5;
    viper.anchor.y = 0.5;

    // Add the viper
    app.stage.addChild(viper);

    viper.interactive = true;
    viper.buttonMode = true;
    viper.on('pointerdown', (event) => {
        pane.showPane();
    });

    // Add the debug text
    let debugText = new PIXI.Text(
        'Waiting for Data',
        {
            align: 'center',
            fill: '#ffffff'
        }
    );

    app.stage.addChild(debugText);

    return [viper, debugText];
};

let updateShipImage = (pilot) => {
    // console.log(`Updating image location for ${pilot.name}`);
    let location = pilot.location;
    // Values need to be mapped
    let position = lonLatToXY(originLon, originLat, location.lon, location.lat);
    let x = Math.abs(position.x) * 32 + 200;
    let y = Math.abs(position.y) * 24 - 12;
    // console.log(`[${pilot.name}] X: ${x}, Y: ${y}`);
    let heading = degreesToRadians(location.heading + headingOffset);
    let shipImage = pilot.image;

    // Update ship image
    shipImage.rotation = heading;
    shipImage.x = x;
    shipImage.y = y;

    // // Update debug info
    let headingInDegrees = parseInt((heading * 180) / Math.PI);
    let debugInfo = `
    Name: ${pilot.name},
    Lon: ${lon},
    Lat: ${lat},
    X: ${x},
    Y: ${y},
    Heading: ${headingInDegrees}`;

    let debugText = pilot.text;

    debugText.text = debugInfo;
    debugText.position.x = x;
    debugText.position.y = y;
};


let mapNormalisedPositionToCentre = (x, y) => {
    return {
        x: (width * 0.5) + (width * 0.5 * x),
        y: (height * 0.5) + (height * 0.5 * x)
    };
};

// let addCircle = (lon, lat) => {
//     let image = new Image();
//     image.src = circleImage;
//     let circleTex = new PIXI.BaseTexture(image);
//     let texture = new PIXI.Texture(circleTex);
//     PIXI.Texture.addToCache(texture, 'circle');
//     let position = lonLatToXY(originLon, originLat, lon, lat);
//     console.log(position);
//     let circle = PIXI.Sprite.fromImage('circle');
//     // let centrePos = mapNormalisedPositionToCentre(position.x, position.y);
//     // console.log(`X: ${centrePos.x}, Y: ${centrePos.y}`);
//     circle.anchor.x = 0.5;
//     circle.anchor.y = 0.5;
//     circle.x = Math.abs(position.x) * 32.0;
//     // circle.x = position.x;
//     circle.y = Math.abs(position.y) * 24.0;
//     // circle.y = position.y;
//     console.log(`X: ${position.x}, Y: ${position.y}`);
//     circle.scale.x = 0.025;
//     circle.scale.y = 0.025;
//     app.stage.addChild(circle);
// }
// Place the top left point
// addCircle(originLon, originLat);

// Start the loop
let gameLoop = (delta) => {
    let pilotNames = getContestantNames();
    for (let i = 0; i < pilotNames.length; i++) {
        let pilot = pilotNames[i];
        if (contestantData.hasOwnProperty(pilot)) {
            updateShipImage(contestantData[pilot]);
        }
    }
}

app.ticker.add(delta => gameLoop(delta));

// Resize to fit the window
app.renderer.view.style.position = 'absolute';
app.renderer.view.style.display = 'block';
app.renderer.autoResize = true;
app.renderer.resize(window.innerWidth, window.innerHeight);

document.body.appendChild(app.view);
