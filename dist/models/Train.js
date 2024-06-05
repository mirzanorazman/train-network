"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Train = void 0;
class Train {
    constructor(trainName, capacityInKg, startingStation) {
        this.trainLoad = [];
        this.name = trainName;
        this.capacityInKg = capacityInKg;
        this.location = startingStation;
    }
    canLoad(packageObj) {
        let currentLoad = this.trainLoad.reduce((totalLoad, p) => totalLoad + p.weight, 0);
        return (currentLoad + packageObj.weight) <= this.capacityInKg;
    }
}
exports.Train = Train;
