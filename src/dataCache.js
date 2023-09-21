import client from './app.js';

const DEFAULT_EXPIRATION = 3600;

export const getOrSetCache = async (key, cb) => {
    return new Promise((resolve, reject) => {
        client.get(key, async (error, data) => {
            if (error) return reject(error);
            if (data != null) return resolve(JSON.parse(data))

            const freshData = await cb();
            client.setEx(key, DEFAULT_EXPIRATION, JSON.stringify(freshData));
            resolve(freshData);
        });
    });
};