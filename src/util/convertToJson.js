import fs from 'fs/promises';

// NOTE: This is used mainly to get the json data as a variable and pass it to another function.
export const fileToJson = async (filePath) => {
    try {
        const data = await fs.readFile(filePath, 'utf8');

        return JSON.parse(data);
    } catch (error) {
        return { error: error.message };
    }
};