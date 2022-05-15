import { WordleHistory, WordleHistoryMemory } from "../src/WordleHistory"

let GeneralTestWordleHistoryObject = function(typeName: string, instance: WordleHistory) {
    test(typeName + " sessionExists true on exists, false on not exist", () => {
        instance.createSession("sessionExistsKey", "abcde");
        expect(instance.sessionExists("sessionExistsKey")).toBeTruthy();
        expect(instance.sessionExists("badSession")).toBeFalsy();
    });

    test(typeName + " getGuessWord success", () => {
        instance.createSession("getGuessWordKey", "abcde");
        expect(instance.getGuessWord("getGuessWordKey")).toBe("abcde");
        expect(() => instance.getGuessWord("badSession")).toThrowError();
    });

    test(typeName + " getHistory success", () => {
        instance.createSession("getHistoryKey", "abcde");
        instance.putEntry("getHistoryKey", "badE1");
        instance.putEntry("getHistoryKey", "badE2");

        let actual = instance.getHistory("getHistoryKey");
        expect(actual.word).toBe("abcde")
        expect(actual.id).toBe("getHistoryKey");
        expect(actual.guesses.length).toBe(2);
        expect(actual.guesses[0]).toBe("badE1");
        expect(actual.guesses[1]).toBe("badE2");
    })

    test(typeName + " getHistory fail", () => {
        expect(() => instance.getHistory("badSession")).toThrowError();
    })
}

//Generic call for common/shared tests
describe("General Tests of all Types", () => {
    GeneralTestWordleHistoryObject("Memory Storage", new WordleHistoryMemory());
});

describe("Specific Tests of Memory Storage", () => {
    const instance = new WordleHistoryMemory();
    test("createSession success", () => {
        instance.createSession("createSessionKey", "abcde");
        expect(instance.uuidToHistory.has("createSessionKey")).toBeTruthy();
        expect(instance.uuidToHistory.get("createSessionKey")).toBeDefined();
        expect(instance.uuidToHistory.get("createSessionKey")?.id).toBe("createSessionKey");
        expect(instance.uuidToHistory.get("createSessionKey")?.word).toBe("abcde");
    });

    test("putEntry success", () => {
        instance.createSession("putEntryKey", "abcde");
        instance.putEntry("putEntryKey", "guess");
        instance.putEntry("putEntryKey", "gues2");
        expect(instance.uuidToHistory.get("putEntryKey")?.guesses.length).toBe(2);
        expect(instance.uuidToHistory.get("putEntryKey")?.guesses[0]).toBe("guess");
        expect(instance.uuidToHistory.get("putEntryKey")?.guesses[1]).toBe("gues2");
    });
});
