"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Network = void 0;
const fs = __importStar(require("fs"));
const Station_1 = require("./models/Station");
const Track_1 = require("./models/Track");
const Package_1 = require("./models/Package");
const Train_1 = require("./models/Train");
class Network {
    constructor() {
        this.stations = [];
        this.tracks = [];
        this.packages = [];
        this.trains = [];
        this.totalTime = 0;
        this.trainOperations = [];
    }
    // Load data from JSON file and populate stations, tracks, packages, and trains
    loadFromFile(filePath) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        data.stations.forEach((station) => {
            this.stations.push(new Station_1.Station(station.name));
        });
        data.tracks.forEach((track) => {
            const name = track.name;
            const start = this.stations.find(s => s.name === track.start);
            const end = this.stations.find(s => s.name === track.end);
            const journeyTimeInMinutes = track.journeyTimeInMinutes;
            this.tracks.push(new Track_1.Track(name, start, end, journeyTimeInMinutes));
            this.tracks.push(new Track_1.Track(name, end, start, journeyTimeInMinutes)); // Add the reverse direction
        });
        data.packages.forEach((packageObj) => {
            const name = packageObj.name;
            const weight = packageObj.weight;
            const location = this.stations.find(s => s.name === packageObj.location);
            const destination = this.stations.find(s => s.name === packageObj.destination);
            this.packages.push(new Package_1.Package(name, weight, location, destination));
        });
        data.trains.forEach((train) => {
            const name = train.name;
            const capacityInKg = train.capacity;
            const startingStation = this.stations.find(s => s.name === train.location);
            this.trains.push(new Train_1.Train(name, capacityInKg, startingStation));
        });
    }
    // Find and return the shortest path from a starting station to an end station
    findShortestPath(start, end) {
        const distances = new Map();
        const prevNodes = new Map;
        const unvisited = new Set(this.stations);
        distances.set(start, 0);
        this.stations.forEach(station => {
            if (station !== start) {
                distances.set(station, Infinity);
            }
            prevNodes.set(station, null);
        });
        while (unvisited.size > 0) {
            let current = this.getClosestStation(unvisited, distances);
            if (!current) {
                return null; // Possible disconnected node
            }
            if (current === end)
                break;
            unvisited.delete(current);
            this.getNeighbors(current).forEach(neighbor => {
                if (!unvisited.has(neighbor.station))
                    return;
                let tentativeDistance = distances.get(current) + neighbor.time;
                if (tentativeDistance < distances.get(neighbor.station)) {
                    distances.set(neighbor.station, tentativeDistance);
                    prevNodes.set(neighbor.station, current);
                }
            });
        }
        if (distances.get(end) === Infinity) {
            return null; // No path found
        }
        // Build the path
        let path = [];
        let current = end;
        while (current) {
            path.unshift(current);
            current = prevNodes.get(current);
        }
        return { path, time: distances.get(end) };
    }
    getReachableTrains(packageObj) {
        const pathToDropOff = this.findShortestPath(packageObj.location, packageObj.destination);
        if (!pathToDropOff) {
            throw new Error(`There is no valid path for Package ${packageObj.name} from ${packageObj.location.name} to ${packageObj.destination.name}.`);
        }
        const reachableTrains = new Map();
        for (const train of this.trains) {
            const path = this.findShortestPath(train.location, packageObj.location);
            if (!path)
                break;
            reachableTrains.set(train, path.time);
        }
        return new Map([...reachableTrains.entries()].sort((a, b) => a[1] - b[1]));
    }
    getNeighbors(station) {
        return this.tracks
            .filter(track => track.start === station)
            .map(track => ({ station: track.end, time: track.journeyTimeInMinutes }));
    }
    getClosestStation(unvisited, distances) {
        let minDistance = Infinity;
        let closestStation = null;
        unvisited.forEach(station => {
            const distance = distances.get(station);
            if (distance < minDistance) {
                minDistance = distance;
                closestStation = station;
            }
        });
        return closestStation;
    }
    dropOffPackage(train, packageToSend) {
        train.trainLoad.shift();
        this.trainOperations.push(`${train.name} dropped off ${packageToSend.name} at ${packageToSend.destination.name}. ${train.name} is located at station ${train.location.name}.`);
        // Remove the package from the array
        this.packages = this.packages.filter(p => p.name !== packageToSend.name);
    }
    moveTrainToDestination(train, packageToSend) {
        const pathToDropOff = this.findShortestPath(packageToSend.location, packageToSend.destination);
        if (!pathToDropOff) {
            throw new Error(`Destination for Package ${packageToSend.name} is unreachable from ${train.location.name}.`);
        }
        this.totalTime += pathToDropOff === null || pathToDropOff === void 0 ? void 0 : pathToDropOff.time;
        train.location = packageToSend.destination;
        this.trainOperations.push(`${train.name} moved from ${pathToDropOff === null || pathToDropOff === void 0 ? void 0 : pathToDropOff.path[0].name} to ${pathToDropOff === null || pathToDropOff === void 0 ? void 0 : pathToDropOff.path[(pathToDropOff === null || pathToDropOff === void 0 ? void 0 : pathToDropOff.path.length) - 1].name} in ${pathToDropOff === null || pathToDropOff === void 0 ? void 0 : pathToDropOff.time} minutes.`);
    }
    pickupPackage(train, packageToSend) {
        if (train.canLoad(packageToSend)) {
            train.trainLoad.push(packageToSend);
            this.trainOperations.push(`${train.name} picked up ${packageToSend.name} from ${packageToSend.location.name}. ${train.name} located at station ${train.location.name}.`);
        }
    }
    moveTrainToStation(train, packageToSend) {
        const pathToPickup = this.findShortestPath(train.location, packageToSend.location);
        if (!pathToPickup) {
            throw new Error(`Package ${packageToSend.name} is unreachable from ${train.location.name} for ${train.name}.`);
        }
        // Move the train, accumulate time
        this.totalTime += pathToPickup.time;
        train.location = packageToSend.location;
        this.trainOperations.push(`${train.name} moved from ${pathToPickup.path[0].name} to ${pathToPickup.path[pathToPickup.path.length - 1].name} in ${pathToPickup.time} minutes.`);
    }
    transportPackage(reachableTrains, packageObj) {
        for (const [train, time] of reachableTrains) {
            if (train.canLoad(packageObj)) {
                this.moveTrainToStation(train, packageObj);
                this.pickupPackage(train, packageObj);
                this.moveTrainToDestination(train, packageObj);
                this.dropOffPackage(train, packageObj);
                return;
            }
            console.log(`No train can carry package ${packageObj.name} within capacity.`);
        }
    }
    run() {
        if (!this.trains.length) {
            throw new Error(`There are no available trains for transport.`);
        }
        if (!this.packages.length) {
            throw new Error(`There are no available packages to pickup.`);
        }
        this.packages.forEach(packageObj => {
            const reachableTrains = this.getReachableTrains(packageObj);
            this.transportPackage(reachableTrains, packageObj);
        });
        return { trainOperations: this.trainOperations, totalTime: this.totalTime };
    }
}
exports.Network = Network;
