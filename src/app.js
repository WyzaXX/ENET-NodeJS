import express from 'express';
import Redis from 'redis';

import eventsRouter from './routes/events.js';

const client = Redis.createClient({
    legacyMode: true,
    disableOfflineQueue: true
});

await client.connect();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//NOTE: QoL logging the incoming requests.
app.use((req, res, next) => {
    console.log(`Received ${req.method} request for ${req.url}`);
    next();
});

app.use('/events', eventsRouter);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500).json({ error: error.message });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}.`));

export default client;