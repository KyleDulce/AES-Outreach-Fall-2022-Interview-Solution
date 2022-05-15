import { WordleHistory, WordleHistoryMemory } from "./WordleHistory";
import {v4 as generateUUID} from 'uuid';
import Config from "./config";

export default class Wordle {

    history: WordleHistory;

    //default MemoryStorage
    constructor(historyOverride: WordleHistory = new WordleHistoryMemory()) {
        this.history = historyOverride;
    }

    //generate session
    public generateSession(): string {
        const uid: string = generateUUID();
        const wordList = Config.getWordList();
        const index = Math.floor(Math.random() * wordList.length);
        const word = wordList[index];

        this.history.createSession(uid, word);

        return uid;
    }

    public submitGuess(id: string, guess: string): string[] | null {
        if(!this.history.sessionExists(id)) {
            return null;
        }
        this.history.putEntry(id, guess);
        const actualWord = this.history.getGuessWord(id);
        return this.checkGuess(actualWord, guess);
    }

    public getHistory(id: string): WordleHistoryResponse | null {
        if(!this.history.sessionExists(id)) {
            return null;
        }

        const historyEntry = this.history.getHistory(id);
        const response = new WordleHistoryResponse();

        response.session_key = id;
        response.entries = [];
        
        for(let x = 0; x < historyEntry.guesses.length; x++) {
            let entry: WordleGuessEntry = new WordleGuessEntry();
            entry.guess = historyEntry.guesses[x];
            entry.result = this.checkGuess(historyEntry.word, entry.guess);

            response.entries.push(entry);
        }
        return response;
    }

    public checkGuess(actual: string, guess: string): string[] {
        const result = [];
        actual = actual.toLowerCase();
        guess = guess.toLowerCase();
        
        for(let x = 0; x < actual.length; x++) {
            if(guess.charAt(x) == actual.charAt(x)) {
                result.push('y')
            } else if(actual.includes(guess.charAt(x))) {
                result.push('m');
            } else {
                result.push('n');
            }
        }
        return result;
    }
}

class WordleHistoryResponse {
    session_key?: string;
    entries?: WordleGuessEntry[];
}

class WordleGuessEntry {
    guess?: string;
    result?: string[];
}