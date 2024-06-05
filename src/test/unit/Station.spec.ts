import { expect } from 'chai';
import { Station } from '../../models/Station';

describe('Station', () => {
    it('should create a station with the given name', () => {
        const station = new Station('A');
        expect(station.name).to.equal('A');
    });
});