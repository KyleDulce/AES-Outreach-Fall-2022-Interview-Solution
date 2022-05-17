# AES-Outreach-Fall-2022-Interview-Solution 

## Table of Contents
1. [About my Submission](#About-my-Submission)
2. [Tools used in my project](#Tools-used-in-my-project)
3. [Technical Information](#Technical-Information)
	- [Usage](#Usage)
		- [Starting the Project](#Starting-the-Project)
		- [Run Unit tests](#Run-Unit-tests)
		- [Adjusting the Configuration](#Adjusting-the-Configuration)
		- [Using the API](#Using-the-API)
		- [Adding your own game history database](#Adding-your-own-game-history-database)

## About my Submission
I completed the back-end challenge for the wordle game. The api runs on port 3000 and any option can be edited in config.yaml.

## Tools used in my project
- Language: Typescript
- Runtime: [NodeJS](http://nodejs.org/en/) v16.13.2
- Dependencies: 
	- [Express](https://www.npmjs.com/package/express) v4.18.1
	- [uuid](https://www.npmjs.com/package/uuid) v8.3.2
	- [yaml](https://www.npmjs.com/package/yaml) v2.1.0
	- [Typescript](https://www.npmjs.com/package/typescript) v4.6.4
- Dev Dependencies:
	- required @types and @typescript dependencies
	- [eslint](https://www.npmjs.com/package/eslint)
	- [nodemon](https://www.npmjs.com/package/nodemon)
	- [jest](https://www.npmjs.com/package/jest)
	- [supertest](https://www.npmjs.com/package/supertest)
	- [ts-node](https://www.npmjs.com/package/ts-node)
	- [ts-jest](https://www.npmjs.com/package/ts-jest)

### Usage

#### Starting the Project
To run the project, download the repository and download and install [NodeJs](https://nodejs.org/en/). Next you will want to run `npm install` once to install the project then `npm run start` to start the server. The server runs on port 3000 but this can be changed in the configuration.

#### Run Unit tests
In order to run the unit tests you must have already run `npm install` at least once. Run `npm run test` to conduct tests.

#### Adjusting the Configuration
There are many config options you can change. Inside `config.yaml` on the root of the project there are settings you can change to adjust the behavior of the server.

Config name | type | description | current value 
--- | --- | --- | ---
server.port | number | the port for the server to listen to for api requests | 3000
endpoints.generate | string | the endpoint for creating a session | '/key'
endpoints.guess | string | the endpoint for submitting a guess | '/guess'
endpoints.history | string | the endpoint for viewing the guess history | '/history'
words | list of strings | the list of words used for the game | **see file**

#### Using the API
There are 3 endpoints to the api: `/key`, `/guess`, `/history`. The `/key` endpoint generates a session for the wordle game. `/guess` allows you to make a guess to the game. `/history` lets you see the history of your guesses for the provided session

GET `key` - Starts a new Game Session 

**Input**
None
**Returns**

Label | Type | Description
--- | --- | ---
session_key | String | The UUID for the current session

POST `/guess` - Allows you to guess with a specified session key

**Input**

Label | Type | Description
--- | --- | ---
session_key | String | The UUID for the current session
guess | String | The 5 letter word representing the guess

**Returns**

Label | Type | Description
--- | --- | ---
result | String[] | Array of 5 y, n or m characters where y suggests a correct letter in correct location, n means a wrong letter, and m means a correct letter in the wrong location

POST `/history` - Allows you to get the guess history for a specific session key

**Input**

Label | Type | Description
--- | --- | ---
session_key | String | The UUID for the current session

**Returns**

Label | Type | Description
--- | --- | ---
session_key | String | The UUID for the current session
entries | Entry[] | Array of entries in order of guesses. See below for Mapping of the Entry Object

***Entry Object***

Label | Type | Description
--- | --- | ---
guess | String | The guess that was provided
result | String[] | The response the server provided

#### Adding your own game history database
The server is setup to easily allow you to use your own database for storing game history. Currently it stores the history in memory. To add your own database you must inherit the abstract class `WordleHistory` in `WordleHistory.ts` and implement the abstract methods. To have the server use that new database, go into the `Wordle` Class in `Wordle.ts` and change the default value of the `WordleHistory` object in the constructor from:
```
constructor(historyOverride: WordleHistory = new WordleHistoryMemory()) {
```
to your new database.
