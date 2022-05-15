/*
This class is meant to be flexible to switch between different types of storage/databases.
Currently it is set to store data in memory but if one would want to change what database
or storage medium they want to store the history, they would only need to change this class.
The methods provided are for other types of storage mediums which may have faster/more efficient
responsiveness if individual pieces of data are requested. In the case of what is currently 
implemented, there is little benefit to splitting them up but it is left there for the option.
*/

export abstract class WordleHistory {
    //adds a new sessionId to history
    public abstract createSession(id: string, word: string): void;

    //Returns an ordered history of the entries into Wordle
    //as an object
    public abstract getHistory(id: string): WordleHistoryEntry;

    //Gets the word the user needs to guess
    public abstract getGuessWord(id: string): string;

    //returns true if session exists in database
    public abstract sessionExists(id: string): boolean;

    //Adds a new entry into the history
    public abstract putEntry(id: string, guess: string): void;
}

class WordleHistoryEntry {
    public readonly id: string;
    public readonly word: string;
    public readonly guesses: string[];
    constructor(id: string, word: string) {
        this.id = id;
        this.word = word;
        this.guesses = [];
    }
}

export class WordleHistoryMemory extends WordleHistory {

    public uuidToHistory: Map<string, WordleHistoryEntry>;

    constructor() {
        super();
        this.uuidToHistory = new Map();
    }

    public createSession(id: string, word: string): void {
        const entry: WordleHistoryEntry = new WordleHistoryEntry(id, word);
        this.uuidToHistory.set(id, entry);
    }

    public getHistory(id: string): WordleHistoryEntry {
        if(this.uuidToHistory.has(id)) {
            let result: WordleHistoryEntry | undefined = this.uuidToHistory.get(id);
            if(result !== undefined) {
                return result;
            } else {
                throw new Error("Unexpected Error! Something went wrong with database");
            }
        } else {
            throw new Error("Session id does not exist in database");
        }
    }

    public getGuessWord(id: string): string {
        return this.getHistory(id).word;
    }

    public sessionExists(id: string): boolean {
        return this.uuidToHistory.has(id);
    }

    public putEntry(id: string, guess: string): void {
        if(this.uuidToHistory.has(id)) {
            this.uuidToHistory.get(id)?.guesses.push(guess);
        }
    }   
}
