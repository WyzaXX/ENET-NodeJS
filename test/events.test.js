import { expect } from 'chai';
import request from 'supertest';
import express from 'express';
import eventsRouter from '../src/routes/events.js';

const app = express();
app.use('/events', eventsRouter);

describe('Events API', () => {
    it('should return all events', (done) => {
        request(app)
            .get('/events')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf.at.least(1); // Assuming there is at least one event in your data
                done();
            });
    });

    it('should handle non-existent event ID', (done) => {
        const nonExistentId = 9999; // Assuming there's no event with this ID
        request(app)
            .get(`/events/${nonExistentId}`)
            .expect('Content-Type', /json/)
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body).to.be.an('object');
                expect(res.body.error).to.equal('Event not found.');
                done();
            });
    });
});
