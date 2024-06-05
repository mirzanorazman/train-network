import * as fs from 'fs';
import { Station } from './models/Station';
import { Track } from './models/Track';
import { Package } from './models/Package';
import { Train } from './models/Train';

export class Network {
    stations: Station[] = [];
    tracks: Track[] = [];
    packages: Package[] = [];
    trains: Train[] = [];

    // TODO: Load data from JSON file and populate stations, tracks, packages, and trains
    loadFromFile(filePath: string) {

    }

    // TODO: Find and return the track connecting start and end stations, BFS
    findTrack(start: Station, end: Station) : Track | null {

        return null;
    }

    run() {
        let totalTime = 0;
        const trainMovements : string[] = [];
        const errors : string[] = [];

        // TODO: Implement the logic for moving the train, picking up, and dropping off packages

    }
}

const network = new Network();
network.loadFromFile('data/network.json'); // Make sure you create and use a JSON file with sample data
network.run();