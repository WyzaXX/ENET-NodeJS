import { expect } from 'chai';
import { transformListEvents } from '../src/dataTransformer.js';
import { convertMsToTime } from '../src/util/convertMSToTime.js';

describe('dataTransformer', () => {
    describe('transformListEvents', () => {
        it('should transform events data into a simplified format', async () => {
            const events = [
                {
                    id: 1,
                    home: {
                        scoreAll: [
                            {
                                resultTypeId: 1,
                                value: 2
                            },
                            {
                                resultTypeId: 2,
                                value: 2
                            },
                            {
                                resultTypeId: 3,
                                value: 0
                            },
                            {
                                resultTypeId: 6,
                                value: 2
                            }
                        ], participant: [{ name: 'Team A' }]
                    },
                    away: { participant: [{ name: 'Team B' }] },
                    stage: { id: 3, name: 'Finished', startTime: 1692180752 },
                    timeStart: 1692173700,
                },
            ];

            const simplifiedEvents = await transformListEvents(events);

            expect(simplifiedEvents).to.have.lengthOf(1);
            expect(simplifiedEvents[0]).to.deep.equal({
                id: 1,
                homeTeam: {
                    teamName: 'Team A', standings: [
                        {
                            result: "Current Result",
                            goals: 2
                        },
                        {
                            result: "Full Time Result",
                            goals: 2
                        },
                        {
                            result: "1st Half Time Result",
                            goals: 0
                        },
                        {
                            result: "2nd Half Time Result",
                            goals: 2
                        }
                    ]
                },
                awayTeam: { teamName: 'Team B' },
                stage: {
                    stageStatus: {
                        info: "1st Half Time Result",
                        status: "Finished"
                    },
                    at: convertMsToTime(1692180752)
                },
                eventStartTime: convertMsToTime(1692173700),
            });
        });

        it('should handle an empty events array', async () => {
            const events = [];
            const simplifiedEvents = await transformListEvents(events);

            expect(simplifiedEvents).to.be.an('array');
            expect(simplifiedEvents).to.have.lengthOf(0);
        });
    });
});