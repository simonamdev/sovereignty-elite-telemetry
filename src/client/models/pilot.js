// Pilot class
// Describes the pilot, details such as name, whether a contestant, current location, etc

export default class Pilot {
    constructor(name, isContestant, location, ship, image, text) {
        this.name = name;
        this.isContestant = isContestant;
        this.location = location;
        this.ship = ship;
        this.image = image;
        this.text = text;
    }

    updateLocation(lon, lat, heading) {
        this.location = {
            lon: lon,
            lat: lat,
            heading: heading
        };
    }
}
