import { parse } from "yaml";
import fs from "fs";
import path from "path";

export default class Config {
    static configInstance?: Config;
    static readonly CONFIG_FILE_YAML: string = "../config.yaml";

    readonly resultFile: any;

    private constructor() {
        console.log(`Loading Configuration: "${Config.CONFIG_FILE_YAML}"`);
        let fileContents: string;
        try {
            fileContents = fs.readFileSync(path.resolve(__dirname, Config.CONFIG_FILE_YAML), "utf8");
        } catch (err) {
            console.log(`FATAL: Error was thrown while reading configuration file: ${err}`)
            console.log("Shutting down!");
            process.exit(1);
        }
        this.resultFile = parse(fileContents);
        console.log("Configuration Loaded")
    }

    private static getInstance(): Config {
        if(Config.configInstance === undefined) {
            Config.configInstance = new Config();
        }
        return Config.configInstance;
    }

    public static forceLoad() {
        this.getInstance();
    }

    public static getPort(): number {
        return Config.getInstance().resultFile.server.port;
    }

    public static getGenerateEndpointName(): string {
        return Config.getInstance().resultFile.endpoints.generate;
    }

    public static getGuessEndpointName(): string {
        return Config.getInstance().resultFile.endpoints.guess;
    }

    public static getHistoryEndpointName(): string {
        return Config.getInstance().resultFile.endpoints.history;
    }

    public static getWordList(): string[] {
        return Config.getInstance().resultFile.words;
    }
}
