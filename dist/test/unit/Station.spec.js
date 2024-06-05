"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Station_1 = require("../../models/Station");
describe('Station', () => {
    it('should create a station with the given name', () => {
        const station = new Station_1.Station('A');
        (0, chai_1.expect)(station.name).to.equal('A');
    });
});
