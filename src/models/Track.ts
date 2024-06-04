import {Station} from './Station'

export class Track {
    name: string;
    start: Station;
    end: Station;
    journeyTimeInMinutes: number;

    constructor(name: string, start: Station, end: Station, time: number){
        this.name = name;
        this.start = start;
        this.end = end;
        this.journeyTimeInMinutes = time;
    }
}