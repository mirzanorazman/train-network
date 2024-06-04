import {Station} from './Station'

export class Package {
    name: string;
    weight: number;
    location: Station;
    destination: Station;

    constructor(name: string, weight: number, location: Station, destination: Station){
        this.name = name;
        this.weight = weight;
        this.location = location;
        this.destination = destination;
    }
}