import { expect } from 'chai';
import { Station } from '../../models/Station';
import { Track } from '../../models/Track';

describe('Track', () => {
    it('should create a track with the given start, end, and time', () => {
        const start = new Station('A');
        const end = new Station('B');
        const track = new Track('T1', start, end, 30);
        expect(track.start).to.equal(start);
        expect(track.end).to.equal(end);
        expect(track.journeyTimeInMinutes).to.equal(30);
    });
});