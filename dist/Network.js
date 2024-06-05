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
    run() {
        let totalTime = 0;
        const trainOperations = [];
        const errors = [];
        // Implement the logic for moving the train, picking up, and dropping off packages
        const train = this.trains[0];
        const packageToSend = this.packages[0];
        const pathToPickup = this.findShortestPath(train.location, packageToSend.location);
        if (!pathToPickup) {
            errors.push(`Package ${packageToSend.name} is unreachable from ${train.location.name}.`);
            return { trainOperations, totalTime, errors };
        }
        // Move the train, accumulate time
        totalTime += pathToPickup.time;
        train.location = packageToSend.location;
        trainOperations.push(`${train.name} moved from ${pathToPickup.path[0].name} to ${pathToPickup.path[pathToPickup.path.length - 1].name} in ${pathToPickup.time} minutes.`);
        // Collect package
        if (train.canLoad(packageToSend)) {
            train.trainLoad.push(packageToSend);
            trainOperations.push(`${train.name} picked up ${packageToSend.name} from ${packageToSend.location.name}. ${train.name} located at station ${train.location.name}.`);
        }
        const pathToDropOff = this.findShortestPath(packageToSend.location, packageToSend.destination);
        if (!pathToDropOff) {
            errors.push(`Destination for Package ${packageToSend.name} is unreachable from ${train.location.name}.`);
        }
        totalTime += pathToDropOff === null || pathToDropOff === void 0 ? void 0 : pathToDropOff.time;
        train.location = packageToSend.destination;
        trainOperations.push(`${train.name} moved from ${pathToDropOff === null || pathToDropOff === void 0 ? void 0 : pathToDropOff.path[0].name} to ${pathToDropOff === null || pathToDropOff === void 0 ? void 0 : pathToDropOff.path[(pathToDropOff === null || pathToDropOff === void 0 ? void 0 : pathToDropOff.path.length) - 1].name} in ${pathToDropOff === null || pathToDropOff === void 0 ? void 0 : pathToDropOff.time} minutes.`);
        // Drop off package
        train.trainLoad.shift();
        trainOperations.push(`${train.name} dropped off ${packageToSend.name} at ${packageToSend.destination.name}. ${train.name} is located at station ${train.location.name}.`);
        return { trainOperations, totalTime, errors };
    }
}
exports.Network = Network;
