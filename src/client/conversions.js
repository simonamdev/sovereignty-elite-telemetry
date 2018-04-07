// https://stackoverflow.com/questions/9705123/how-can-i-get-sin-cos-and-tan-to-use-degrees-instead-of-radians
export function degreesToRadians(angle) {
    return angle * (Math.PI / 180);
};

const planetRadiusKm = 524;
const planetCircumferenceKm = 2 * Math.PI * planetRadiusKm;

export function lonLatToXY(originLon, originLat, lon, lat) {
    let dx = (lon - originLon) * planetCircumferenceKm * Math.cos((originLat + lat) * Math.PI / 360) / 360;
    let dy = (originLat - lat) * planetCircumferenceKm / 360;
    console.log('dx: ' + dx + ', dy: ' + dy);
    return {
        x: dx,
        y: dy
    };
};

export function normalise(num, min, man) {
    return (num - min) / (max - min);
};
