# Node.js Express.js Data Processing Project

## Installation

1. Install project dependencies:

    `npm install`

2. Start a Redis server:
On Windows, open a WSL terminal and type:

    `redis-server`

3. Open another BASH OR ZSH terminal and type

     `npm run start`

## Debugging
To run the application in debug mode, use:

`npm run debug`

## Running Tests
To run the unit tests for the project, use:

`npm run test`

## Data caching:
I've used redis because i never used it and wanted a challenge and I got it, ...spent 6 hrs configuring redis on windows..., jokes aside its one of the best ways to speed up the data retrieval and optimize the whole data operation. so after some research on alternatives, this was a no brainer.
Initially the raw data is loaded from the JSON files using the getOrSetCache function when its called from an endpoint, but after that its cached and the retrieval is ~3 times faster. 

## Data Transformation Approach:
First I analyzed the 3 json files and saw some dependencies around them.
My solution is first to separate the data transformation into its own module which will make it easier to read and update in the future. Its flexible in the case that you can delete or add properties to the final result easily.

## Code Organization:
```I've followed a modular and structured project layout.
project-root/
  │── data/
  │     ├── codeBookEventStages.json (JSON data files)
  │     ├── codebookResultTypes.json
  │     ├── listEvents.json
  ├── src/
  │    ├── app.js               (Express.js application entry point)
  │    ├── routes/
  │    │    ├── events.js       (Express.js route handling)
  │    │── util/
  │    │    ├── convertMsToTime.js (Helpful util functions)
  │    │    ├── convertToJson.js
  │    │── test/
  │    │    ├── dataTransformer.test.js (some tests)
  │    │    ├── events.test.js
  │    │
  │    ├── dataCache.js         (Loading and Caching data in Redis)
  │    ├── dataTransformer.js   (Transforming data)
  └── package.json              (Project dependencies)
``````