import { expect } from 'chai';
import { Network } from '../../Network';
import { Station } from '../../models/Station';
import { Track } from '../../models/Track';
import { Package } from '../../models/Package';
import { Train } from '../../models/Train'; 

describe('Network-Simple', () => {
    it('should load data from JSON file', () => {
        const network = new Network();
        network.loadFromFile('src/data/network-simple.json');

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
        const track3r = new Track('T3', stationC, stationA, 10);

        const network = new Network();
        network.stations.push(stationA, stationB, stationC);
        network.tracks.push(track1, track2, track3, track1r, track2r, track3r);

        const path = network.findShortestPath(stationC, stationA);
        expect(path).to.not.be.null;
        expect(path!.path).to.deep.equal([stationC, stationA]);
        expect(path!.time).to.equal(10);
    })

    it('should run the simulation correctly and return results', () => {
        const network = new Network();
        network.loadFromFile('src/data/network-simple.json');

        const result = network.run();
        expect(result.trainOperations).to.have.lengthOf(4);
        expect(result.trainOperations[0]).to.equal('T1 moved from B to A in 30 minutes.');
        expect(result.trainOperations[1]).to.equal('T1 picked up Q from A. T1 located at station A.');
        expect(result.trainOperations[2]).to.equal('T1 moved from A to C in 40 minutes.');
        expect(result.trainOperations[3]).to.equal('T1 dropped off Q at C. T1 is located at station C.');
        expect(result.totalTime).to.equal(70);
    });

    it('should throw an error when there are unreachable package location' , () => {
        const stationA = new Station('A');
        const stationB = new Station('B');
        const stationC = new Station('C');

        const track1 = new Track('T1', stationA, stationB, 30);

        const trainA = new Train('T11', 5, stationA);
        const packageToSend = new Package('P1', 10, stationC, stationB);

        const network = new Network();
        network.stations.push(stationA, stationB, stationC);
        network.tracks.push(track1);
        network.trains.push(trainA);
        network.packages.push(packageToSend);

        expect(() => network.run()).to.throw(`Package ${packageToSend.name} is unreachable from ${trainA.location.name}.`);
    });

    it('should throw an error when there are unreachable package destination' , () => {
        const stationA = new Station('A');
        const stationB = new Station('B');
        const stationC = new Station('C');

        const track1 = new Track('T1', stationA, stationB, 30);

        const trainA = new Train('T11', 5, stationA);
        const packageToSend = new Package('P1', 10, stationB, stationC);

        const network = new Network();
        network.stations.push(stationA, stationB, stationC);
        network.tracks.push(track1);
        network.trains.push(trainA);
        network.packages.push(packageToSend);

        expect(() => network.run()).to.throw(`Destination for Package ${packageToSend.name} is unreachable from ${packageToSend.location.name}.`);
    });

    it('should throw an error when there are no trains available' , () => {
        const stationA = new Station('A');
        const stationB = new Station('B');
        const stationC = new Station('C');

        const track1 = new Track('T1', stationA, stationB, 30);
        const track2 = new Track('T2', stationB, stationC, 10);
        const track3 = new Track('T3', stationA, stationC, 50);

        const packageA = new Package('P1', 10, stationA, stationB);

        const network = new Network();
        network.stations.push(stationA, stationB, stationC);
        network.tracks.push(track1, track2, track3);
        network.packages.push(packageA);

        expect(() => network.run()).to.throw('There are no available trains for transport.');
    });
        
    it('should throw an error when there are no package available' , () => {
        const stationA = new Station('A');
        const stationB = new Station('B');
        const stationC = new Station('C');

        const track1 = new Track('T1', stationA, stationB, 30);
        const track2 = new Track('T2', stationB, stationC, 10);
        const track3 = new Track('T3', stationA, stationC, 50);

        const trainA = new Train('T11', 5, stationA);

        const network = new Network();
        network.stations.push(stationA, stationB, stationC);
        network.tracks.push(track1, track2, track3);
        network.trains.push(trainA);

        expect(() => network.run()).to.throw('There are no available packages to pickup.');
    });

});

describe('Network-Complex', () => {
    // it('should run the simulation correctly and return results', () => {
    //     const network = new Network();
    //     network.loadFromFile('src/data/network-complex.json');

    //     const result = network.run();
    //     expect(result.trainOperations).to.have.lengthOf(4);
    //     expect(result.trainOperations[0]).to.equal('T1 moved from B to A in 30 minutes.');
    //     expect(result.trainOperations[1]).to.equal('T1 picked up Q from A. T1 located at station A.');
    //     expect(result.trainOperations[2]).to.equal('T1 moved from A to C in 40 minutes.');
    //     expect(result.trainOperations[3]).to.equal('T1 dropped off Q at C. T1 is located at station C.');
    //     expect(result.totalTime).to.equal(70);
    // });
})