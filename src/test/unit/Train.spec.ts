import { expect } from "chai";
import { Station } from "../../models/Station";
import { Train } from "../../models/Train";
import { Package } from "../../models/Package";

describe('Train', () => {
    it('should create a train with the given name, capacity, and location', () => {
        const location = new Station('A');
        const train = new Train('T', 6, location);
        expect(train.name).to.equal('T');
        expect(train.capacityInKg).to.equal(6);
        expect(train.location).to.equal(location);
    });

    it('should load a package if within capacity', () => {
        const location = new Station('A');
        const train = new Train('T', 6, location);
        const packageObj = new Package('Q', 5, location, location);
        const canLoad = train.canLoad(packageObj);
        expect(canLoad).to.be.true;
    });

    it('should not load a package if exceeding capacity', () => {
        const location = new Station('A');
        const train = new Train('T', 6, location);
        const packageObj = new Package('Q', 7, location, location);
        const canLoad = train.canLoad(packageObj);
        expect(canLoad).to.be.false;
    });
})