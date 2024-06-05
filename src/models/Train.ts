import { Station } from "./Station";
import { Package } from "./Package";
export class Train {
    trainName : string;
    capacityInKg : number;
    startingStation : Station;

    constructor(trainName: string, capacityInKg: number, startingStation: Station) {
        this.trainName = trainName;
        this.capacityInKg = capacityInKg;
        this.startingStation = startingStation;
    }

    // canLoad(package: Package) : boolean {

    // }
}