"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Track = void 0;
class Track {
    constructor(name, start, end, time) {
        this.name = name;
        this.start = start;
        this.end = end;
        this.journeyTimeInMinutes = time;
    }
}
exports.Track = Track;
