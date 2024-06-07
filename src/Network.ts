import * as fs from 'fs';
import { Station } from './models/Station';
import { Track } from './models/Track';
import { Package } from './models/Package';
import { Train } from './models/Train';
import { Result } from './models/Result';

export class Network {
    stations: Station[] = [];
    tracks: Track[] = [];
    packages: Package[] = [];
    trains: Train[] = [];

    totalTime: number = 0;
    trainOperations: string[] = [];

    // Load data from JSON file and populate stations, tracks, packages, and trains
    loadFromFile(filePath: string) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

        data.stations.forEach((station: {name: string}) => {
            this.stations.push(new Station(station.name));
        });

        data.tracks.forEach((track: {
            name: string;
            start: string;
            end: string;
            journeyTimeInMinutes: number
        }) => {
            const name = track.name;
            const start = this.stations.find(s => s.name === track.start)!;
            const end = this.stations.find(s => s.name === track.end)!;
            const journeyTimeInMinutes = track.journeyTimeInMinutes;

            this.tracks.push(new Track(name, start, end, journeyTimeInMinutes));
            this.tracks.push(new Track(name, end, start, journeyTimeInMinutes)); // Add the reverse direction
        })

        data.packages.forEach((packageObj: {
            name: string;
            weight: number;
            location: string;
            destination: string
        }) => {
            const name = packageObj.name;
            const weight = packageObj.weight;
            const location = this.stations.find(s => s.name === packageObj.location)!;
            const destination = this.stations.find(s=> s.name === packageObj.destination)!;

            this.packages.push(new Package(name, weight, location, destination));
        })

        data.trains.forEach((train: {
            name: string;
            capacity: number;
            location: string
        }) => {
            const name = train.name;
            const capacityInKg = train.capacity;
            const startingStation = this.stations.find(s => s.name === train.location)!;

            this.trains.push(new Train(name, capacityInKg, startingStation));
        })

    }

    // Find and return the shortest path from a starting station to an end station
    findShortestPath(start: Station, end: Station) : {path: Station[], time: number} | null {
        const distances: Map<Station, number> = new Map();
        const prevNodes: Map<Station, Station | null> = new Map;
        const unvisited: Set<Station> = new Set(this.stations);

        distances.set(start, 0);
        this.stations.forEach(station => {
            if (station !== start) {
                distances.set(station, Infinity);
            }
            prevNodes.set(station, null);
        });

        while (unvisited.size > 0) {
            let current: Station = this.getClosestStation(unvisited, distances)
            
            if (!current) {
                return null; // Possible disconnected node
            }
            if (current === end) break;

            unvisited.delete(current);

            this.getNeighbors(current).forEach(neighbor => {
                if (!unvisited.has(neighbor.station)) return;

                let tentativeDistance = distances.get(current)! + neighbor.time;
                if (tentativeDistance < distances.get(neighbor.station)!) {
                    distances.set(neighbor.station, tentativeDistance);
                    prevNodes.set(neighbor.station, current);
                }
            });
        }

        if (distances.get(end) === Infinity) {
            return null; // No path found
        }

        // Build the path
        let path: Station[] = [];
        let current: Station | null = end;
        while (current) {
            path.unshift(current);
            current = prevNodes.get(current)!;
        }

        return { path, time: distances.get(end)!}

    }

    getNeighbors(station: Station): {station : Station, time: number}[] {
        return this.tracks
            .filter(track => track.start === station)
            .map(track => ({station: track.end, time: track.journeyTimeInMinutes}));
    }

    getClosestStation(unvisited: Set<Station>, distances: Map<Station, number>): Station {
        let minDistance = Infinity;
        let closestStation: Station | null = null;

        unvisited.forEach(station => {
            const distance = distances.get(station)!;
            if (distance < minDistance) {
                minDistance = distance;
                closestStation = station;
            }
        });

        return closestStation!;
    }

    run(): Result {
        

        // Implement the logic for moving the train, picking up, and dropping off packages
        if (!this.trains.length) {
            throw new Error(`There are no available trains for transport.`)
        }
        if (!this.packages.length) {
            throw new Error(`There are no available packages to pickup.`)
        }
        
        const train = this.trains[0];
        const packageToSend = this.packages[0];

        const pathToPickup = this.findShortestPath(train.location, packageToSend.location);
        if (!pathToPickup) {
            throw new Error(`Package ${packageToSend.name} is unreachable from ${train.location.name}.`);
        }
        
        // Move the train, accumulate time
        this.totalTime += pathToPickup.time;
        train.location = packageToSend.location;
        this.trainOperations.push(`${train.name} moved from ${pathToPickup.path[0].name} to ${pathToPickup.path[pathToPickup.path.length - 1].name} in ${pathToPickup.time} minutes.`);

        // Collect package
        if (train.canLoad(packageToSend)) {
            train.trainLoad.push(packageToSend);
            this.trainOperations.push(`${train.name} picked up ${packageToSend.name} from ${packageToSend.location.name}. ${train.name} located at station ${train.location.name}.`)
        }

        const pathToDropOff = this.findShortestPath(packageToSend.location, packageToSend.destination);
        if (!pathToDropOff) {
            throw new Error(`Destination for Package ${packageToSend.name} is unreachable from ${train.location.name}.`);
        }

        this.totalTime += pathToDropOff?.time!;
        train.location = packageToSend.destination;
        this.trainOperations.push(`${train.name} moved from ${pathToDropOff?.path[0].name} to ${pathToDropOff?.path[pathToDropOff?.path.length - 1].name} in ${pathToDropOff?.time} minutes.`);

        // Drop off package
        train.trainLoad.shift();
        this.trainOperations.push(`${train.name} dropped off ${packageToSend.name} at ${packageToSend.destination.name}. ${train.name} is located at station ${train.location.name}.`)

        return {trainOperations: this.trainOperations, totalTime: this.totalTime};
    }
}