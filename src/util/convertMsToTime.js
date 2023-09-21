export const convertMsToTime = (ms) => {
    //NOTE: converts from 54000000 ms to 15:00:00 hh:mm:ss
    return new Date(ms).toISOString().slice(11, 19);
};