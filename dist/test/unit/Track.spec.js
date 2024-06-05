"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Station_1 = require("../../models/Station");
const Track_1 = require("../../models/Track");
describe('Track', () => {
    it('should create a track with the given start, end, and time', () => {
        const start = new Station_1.Station('A');
        const end = new Station_1.Station('B');
        const track = new Track_1.Track('T1', start, end, 30);
        (0, chai_1.expect)(track.start).to.equal(start);
        (0, chai_1.expect)(track.end).to.equal(end);
        (0, chai_1.expect)(track.journeyTimeInMinutes).to.equal(30);
    });
});
