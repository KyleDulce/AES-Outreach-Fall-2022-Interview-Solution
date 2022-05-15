import Wordle from "../src/Wordle";
import { WordleHistoryMemory } from "../src/WordleHistory";

describe("Test Wordle Class checkGuess", () => {
    const wordle = new Wordle()
    test("checkGuess success all correct", () => {
        expect(wordle.checkGuess("abcde", "abcde")).toStrictEqual(['y','y','y','y','y']);
    })
    test("checkGuess success all wrong", () => {
        expect(wordle.checkGuess("abcde", "12345")).toStrictEqual(['n','n','n','n','n']);
    })
    test("checkGuess success all wrong place", () => {
        expect(wordle.checkGuess("abcde", "bcdea")).toStrictEqual(['m','m','m','m','m']);
    })
});

describe("Test Wordle Class", () => {
    const wordleHistory = new WordleHistoryMemory();
    const wordle = new Wordle(wordleHistory);

    test("generateSession success", () => {
        const generateSessionSpy = jest.spyOn(wordleHistory, 'createSession');
        let actual = wordle.generateSession();

        expect(generateSessionSpy).toHaveBeenCalled();
        expect(actual).toBeDefined();
    })

    test("submitGuess success", () => {
        wordleHistory.createSession("generateSessionKey", "abcde");

        let actual = wordle.submitGuess("generateSessionKey", "abcde");

        expect(actual).toBeDefined();
        expect(actual).toStrictEqual(['y','y','y','y','y'])
    })

    test("submitGuess session does not exist, null return", () => {
        let actual = wordle.submitGuess("badSession", "abcde");

        expect(actual).toBeNull();
    })

    test("getHistory success", () => {
        wordleHistory.createSession("getHistoryKey", "abcde");
        wordleHistory.putEntry("getHistoryKey", "12345");
        wordleHistory.putEntry("getHistoryKey", "abcde");

        let actual = wordle.getHistory("getHistoryKey");

        expect(actual).toBeDefined();
        expect(actual?.session_key).toBe("getHistoryKey");
        expect(actual?.entries).toBeDefined();
        expect(actual?.entries?.length).toBe(2);

        let entries = actual?.entries!;
        expect(entries[0].guess).toBe("12345");
        expect(entries[0].result).toStrictEqual(['n','n','n','n','n']);
        expect(entries[1].guess).toBe("abcde");
        expect(entries[1].result).toStrictEqual(['y','y','y','y','y']);
    })
})

