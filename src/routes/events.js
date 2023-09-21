import express from 'express';
import { transformListEvents } from '../dataTransformer.js';
import { fileToJson } from '../util/convertToJson.js';
import { getOrSetCache } from '../dataCache.js';

const router = express.Router();

router.get('/', async (req, res) => {
    const cacheKey = 'listEvents';
    const events = await getOrSetCache(cacheKey, async () => {
        const jsonData = await fileToJson('./data/listEvents.json');
        return jsonData.data.listEvents;
    });

    const simplifiedEvents = await transformListEvents(events);
    res.json(simplifiedEvents);
});

router.get('/:id', async (req, res) => {
    const eventId = parseInt(req.params.id);
    if (isNaN(eventId)) {
        return res.status(400).json({ error: 'Invalid event ID!' });
    }

    const cacheKey = `listEvents:${eventId}`;
    const events = await getOrSetCache(cacheKey, async () => {
        const jsonData = await fileToJson('./data/listEvents.json');
        return jsonData.data.listEvents;
    });

    const event = events.find((e) => e.id === eventId);

    if (!event) {
        return res.status(404).json({ error: 'Event not found.' });
    }

    const simplifiedEvent = await transformListEvents([event])[0];
    res.json(simplifiedEvent);
});

router.get('/stage/:stage', async (req, res) => {
    const stage = req.params.stage;

    if (!stage) {
        return res.status(400).json({ error: 'Stage parameter is required!' });
    }

    const cacheKey = `listEvents/stages:${stage}`;
    const events = await getOrSetCache(cacheKey, async () => {
        const jsonData = await fileToJson('./data/listEvents.json');
        return jsonData.data.listEvents;
    });


    if (!events) {
        return res.status(500).json({ error: 'Data not available.' });
    }

    const filteredEvents = events.filter((e) => e.stage.name.toLowerCase() === stage.toLowerCase());

    if (filteredEvents.length === 0) {
        return res.status(404).json({ error: 'No events found for the specified stage.' });
    }

    const simplifiedEvents = await transformListEvents(filteredEvents);
    res.json(simplifiedEvents);
});

export default router;