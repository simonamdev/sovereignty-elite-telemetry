// https://stackoverflow.com/questions/9705123/how-can-i-get-sin-cos-and-tan-to-use-degrees-instead-of-radians
export function degreesToRadians(angle) {
    return angle * (Math.PI / 180);
};

export function radiansToDegrees(angle) {
    return (angle * 180) / Math.PI;
};

const planetRadiusKm = 524;
const planetCircumferenceKm = 2 * Math.PI * planetRadiusKm;

// When using radians below
const xOffset = 1051.8538;
const yOffset = 997.1719;

export function lonLatToXY(originLon, originLat, lon, lat) {
    let dx = planetCircumferenceKm * Math.cos(degreesToRadians(lat)) * Math.cos(degreesToRadians(lon));
    let dy = planetCircumferenceKm * Math.cos(degreesToRadians(lat)) * Math.sin(degreesToRadians(lon));
    // let dx = (lon - originLon) * planetCircumferenceKm * Math.cos((originLat + lat) * Math.PI / 360) / 360;
    // let dy = (originLat - lat) * planetCircumferenceKm / 360;
    // console.log('dx: ' + dx + ', dy: ' + dy);
    return {
        x: dx - xOffset,
        y: dy - yOffset
    };
};

export function normalise(num, min, man) {
    return (num - min) / (max - min);
};
