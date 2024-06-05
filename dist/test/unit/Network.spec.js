"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Network_1 = require("../../Network");
const Station_1 = require("../../models/Station");
const Track_1 = require("../../models/Track");
describe('Network-Simple', () => {
    it('should load data from JSON file', () => {
        const network = new Network_1.Network();
        network.loadFromFile('src/data/network-simple.json');
        (0, chai_1.expect)(network.stations.length).to.equal(3);
        (0, chai_1.expect)(network.tracks.length).to.equal(4);
        (0, chai_1.expect)(network.packages.length).to.equal(1);
        (0, chai_1.expect)(network.trains.length).to.equal(1);
    });
    it('should find the shortest path between two stations', () => {
        const stationA = new Station_1.Station('A');
        const stationB = new Station_1.Station('B');
        const stationC = new Station_1.Station('C');
        const track1 = new Track_1.Track('T1', stationA, stationB, 30);
        const track2 = new Track_1.Track('T2', stationB, stationC, 10);
        const track3 = new Track_1.Track('T3', stationA, stationC, 50);
        const network = new Network_1.Network();
        network.stations.push(stationA, stationB, stationC);
        network.tracks.push(track1, track2, track3);
        const path = network.findShortestPath(stationA, stationC);
        (0, chai_1.expect)(path).to.not.be.null;
        (0, chai_1.expect)(path.path).to.deep.equal([stationA, stationB, stationC]);
        (0, chai_1.expect)(path.time).to.equal(40);
    });
    it('should find the shortest path between two stations, in reverse direction', () => {
        const stationA = new Station_1.Station('A');
        const stationB = new Station_1.Station('B');
        const stationC = new Station_1.Station('C');
        const track1 = new Track_1.Track('T1', stationA, stationB, 30);
        const track1r = new Track_1.Track('T1', stationB, stationA, 30);
        const track2 = new Track_1.Track('T2', stationB, stationC, 10);
        const track2r = new Track_1.Track('T2', stationC, stationB, 10);
        const track3 = new Track_1.Track('T3', stationA, stationC, 50);
        const track3r = new Track_1.Track('T3', stationC, stationA, 10);
        const network = new Network_1.Network();
        network.stations.push(stationA, stationB, stationC);
        network.tracks.push(track1, track2, track3, track1r, track2r, track3r);
        const path = network.findShortestPath(stationC, stationA);
        (0, chai_1.expect)(path).to.not.be.null;
        (0, chai_1.expect)(path.path).to.deep.equal([stationC, stationA]);
        (0, chai_1.expect)(path.time).to.equal(10);
    });
    it('should run the simulation correctly and return results', () => {
        const network = new Network_1.Network();
        network.loadFromFile('src/data/network-simple.json');
        const result = network.run();
        (0, chai_1.expect)(result.trainOperations).to.have.lengthOf(4);
        (0, chai_1.expect)(result.trainOperations[0]).to.equal('T1 moved from B to A in 30 minutes.');
        (0, chai_1.expect)(result.trainOperations[1]).to.equal('T1 picked up Q from A. T1 located at station A.');
        (0, chai_1.expect)(result.trainOperations[2]).to.equal('T1 moved from A to C in 40 minutes.');
        (0, chai_1.expect)(result.trainOperations[3]).to.equal('T1 dropped off Q at C. T1 is located at station C.');
        (0, chai_1.expect)(result.totalTime).to.equal(70);
    });
    // TODO: Negative test cases
    // 1. Invalid package deliver location/destination
    // 2. Invalid train location
    // 3. Unreachable train-package destination
});
describe('Network-Complex', () => {
});
