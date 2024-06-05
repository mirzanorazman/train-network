import { Station } from "./Station";
import { Package } from "./Package";
export class Train {
    trainName : string;
    capacityInKg : number;
    startingStation : Station;
    trainLoad: Package[] = [];

    constructor(trainName: string, capacityInKg: number, startingStation: Station) {
        this.trainName = trainName;
        this.capacityInKg = capacityInKg;
        this.startingStation = startingStation;
    }

    canLoad(packageObj: Package) : boolean {
        let currentLoad = this.trainLoad.reduce((totalLoad, p) => totalLoad + p.weight, 0);
        return (currentLoad + packageObj.weight) <= this.capacityInKg;
    }
}