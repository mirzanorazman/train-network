import { expect } from 'chai';
import { Network } from '../Network';
import { Station } from '../models/Station';
import { Track } from '../models/Track';
import { Package } from '../models/Package';
import { Train } from '../models/Train'; 

describe('Network', () => {
    it('should load data from JSON file', () => {
        const network = new Network();
        network.loadFromFile('data/network.json');

        expect(network.stations.length).to.equal(3);
        expect(network.tracks.length).to.equal(2);
        expect(network.packages.length).to.equal(1);
        expect(network.trains.length).to.equal(1);
    });

});