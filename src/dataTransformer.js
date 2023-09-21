import { getOrSetCache } from "./dataCache.js";
import { fileToJson } from "./util/convertToJson.js";
import { convertMsToTime } from "./util/convertMSToTime.js";

const getEventStages = async (resultTypes) => {
    const cacheKey = 'codeBookEventStages';
    const eventStages = await getOrSetCache(cacheKey, async () => {
        const jsonData = await fileToJson('./data/codeBookEventStages.json');
        return jsonData.data.codebookEventStages;
    });

    //NOTE: improvements can be done here to cache the map and get it when function is called.
    const eventStageMap = {};

    for (const entry of eventStages) {
        eventStageMap[entry.id] = { info: resultTypes[entry.typeId], status: entry.name };
    }

    return eventStageMap;
};

const getResultTypes = async () => {
    const cacheKey = 'codeBookResultTypes';
    const resultTypes = await getOrSetCache(cacheKey, async () => {
        const jsonData = await fileToJson('./data/codebookResultTypes.json');
        return jsonData.data.codebookResultTypes;
    });

    //NOTE: improvements can be done here to cache the map and get it when function is called.
    const resultTypeMap = {};

    for (const entry of resultTypes) {
        resultTypeMap[entry.id] = entry.name;
    }

    return resultTypeMap;
};

//NOTE: im not sure that the property names are right couldn't catch the logic for the data to name it...
const beautifyStandings = (allScores, resultTypes) => {
    return allScores.map((score) => ({
        result: resultTypes[score.resultTypeId],
        goals: score.value
    }));
};

export const transformListEvents = async (events) => {
    const resultTypes = await getResultTypes();
    const eventStages = await getEventStages(resultTypes);

    const formattedEvents = events.map((event) => (
        {
            id: event.id,
            homeTeam: {
                teamName: event.home.participant[0].name,
                standings: event.home.scoreAll ? beautifyStandings(event.home.scoreAll, resultTypes) : undefined
            },
            awayTeam: {
                teamName: event.away.participant[0].name,
            },
            stage: {
                stageStatus: eventStages[event.stage.id],
                at: event.stage.startTime ? convertMsToTime(event.stage.startTime) : undefined
            },
            eventStartTime: convertMsToTime(event.timeStart)
        }));

    return formattedEvents;
};
