import { Station } from "./Station";

export class Train {
    trainName : string;
    capacityInKg : number;
    startingStation : Station;

    constructor(trainName: string, capacityInKg: number, startingStation: Station) {
        this.trainName = trainName;
        this.capacityInKg = capacityInKg;
        this.startingStation = startingStation;
    }
}