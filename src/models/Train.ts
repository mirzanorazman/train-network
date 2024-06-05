import { Station } from "./Station";
import { Package } from "./Package";
export class Train {
    name : string;
    capacityInKg : number;
    location : Station;
    trainLoad: Package[] = [];

    constructor(trainName: string, capacityInKg: number, startingStation: Station) {
        this.name = trainName;
        this.capacityInKg = capacityInKg;
        this.location = startingStation;
    }

    canLoad(packageObj: Package) : boolean {
        let currentLoad = this.trainLoad.reduce((totalLoad, p) => totalLoad + p.weight, 0);
        return (currentLoad + packageObj.weight) <= this.capacityInKg;
    }
}