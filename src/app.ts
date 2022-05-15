//Server Start
console.log("Loading Server");

import express from "express";
import http from "http";
import config from "./config";
import Wordle from "./Wordle";

config.forceLoad();

console.log("Starting Server");

const app = express();
const server = http.createServer(app);
const wordle = new Wordle();

app.use(express.json());
export default app;

//cors header
app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Credentials', "true");
    next();
});

//endpoints
// /key
app.get(config.getGenerateEndpointName(), (req, res) => {
    res.status(200).send({ session_key: wordle.generateSession() });
});

// /guess
app.post(config.getGuessEndpointName(), (req, res) => {
    const session_key = req.body.session_key;
    const guess = req.body.guess;

    if(session_key == undefined || guess == undefined) {
        res.status(400).send("Bad request. Body must contain: {session_key, guess}");
        return;
    } else if(guess.length !== 5) {
        res.status(400).send("Bad request. Guess must be 5 in size");
        return;
    }

    const response = wordle.submitGuess(session_key, guess);
    if(response == null) {
        res.status(400).send("Bad request. Session key is not an active session");
        return;
    }
    res.status(200).send({result: response});
});

// /history
app.post(config.getHistoryEndpointName(), (req, res) => {
    const session_key = req.body.session_key;
    if(session_key == undefined) {
        console.log(req.body);
        res.status(400).send("Bad request. Body must contain: {session_key}");
        return;
    }

    const response = wordle.getHistory(session_key);
    if(response == null) {
        res.status(400).send("Bad request. Session key is not an active session");
        return;
    }
    res.status(200).send(response);
});

server.listen(config.getPort(), () => {
    console.log(`Listening on port ${config.getPort()}`);
})