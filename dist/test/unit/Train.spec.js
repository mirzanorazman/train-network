"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Station_1 = require("../../models/Station");
const Train_1 = require("../../models/Train");
const Package_1 = require("../../models/Package");
describe('Train', () => {
    it('should create a train with the given name, capacity, and location', () => {
        const location = new Station_1.Station('A');
        const train = new Train_1.Train('T', 6, location);
        (0, chai_1.expect)(train.name).to.equal('T');
        (0, chai_1.expect)(train.capacityInKg).to.equal(6);
        (0, chai_1.expect)(train.location).to.equal(location);
    });
    it('should load a package if within capacity', () => {
        const location = new Station_1.Station('A');
        const train = new Train_1.Train('T', 6, location);
        const packageObj = new Package_1.Package('Q', 5, location, location);
        const canLoad = train.canLoad(packageObj);
        (0, chai_1.expect)(canLoad).to.be.true;
    });
    it('should not load a package if exceeding capacity', () => {
        const location = new Station_1.Station('A');
        const train = new Train_1.Train('T', 6, location);
        const packageObj = new Package_1.Package('Q', 7, location, location);
        const canLoad = train.canLoad(packageObj);
        (0, chai_1.expect)(canLoad).to.be.false;
    });
});
