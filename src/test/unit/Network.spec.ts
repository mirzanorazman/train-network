import { expect } from 'chai';
import { Network } from '../../Network';
import { Station } from '../../models/Station';
import { Track } from '../../models/Track';
import { Package } from '../../models/Package';
import { Train } from '../../models/Train'; 

describe('Network', () => {
    it('should load data from JSON file', () => {
        const network = new Network();
        network.loadFromFile('src/data/network-test.json');

        expect(network.stations.length).to.equal(3);
        expect(network.tracks.length).to.equal(4);
        expect(network.packages.length).to.equal(1);
        expect(network.trains.length).to.equal(1);
    });

    it('should find the shortest path between two stations', () => {
        const stationA = new Station('A');
        const stationB = new Station('B');
        const stationC = new Station('C');

        const track1 = new Track('T1', stationA, stationB, 30);
        const track2 = new Track('T2', stationB, stationC, 10);
        const track3 = new Track('T3', stationA, stationC, 50);

        const network = new Network();
        network.stations.push(stationA, stationB, stationC);
        network.tracks.push(track1, track2, track3);

        const path = network.findShortestPath(stationA, stationC);
        expect(path).to.not.be.null;
        expect(path!.path).to.deep.equal([stationA, stationB, stationC]);
        expect(path!.time).to.equal(40);
    });

    it('should find the shortest path between two stations, in reverse direction', () => {
        const stationA = new Station('A');
        const stationB = new Station('B');
        const stationC = new Station('C');

        const track1 = new Track('T1', stationA, stationB, 30);
        const track1r = new Track('T1', stationB, stationA, 30);
        const track2 = new Track('T2', stationB, stationC, 10);
        const track2r = new Track('T2', stationC, stationB, 10);
        const track3 = new Track('T3', stationA, stationC, 50);
        const track3r = new Track('T3', stationC, stationA, 50);

        const network = new Network();
        network.stations.push(stationA, stationB, stationC);
        network.tracks.push(track1, track2, track3, track1r, track2r, track3r);

        const path = network.findShortestPath(stationC, stationA);
        expect(path).to.not.be.null;
        expect(path!.path).to.deep.equal([stationC, stationB, stationA]);
        expect(path!.time).to.equal(40);
    })

});