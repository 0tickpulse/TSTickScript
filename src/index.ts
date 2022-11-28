import readline from "readline";
import path from "path";
import fs from "fs";
import * as classes from "./core/classes.js";
import * as c from "./utils/consoleColors.js";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

let linepos = 1;
const queue: classes.ScriptQueue = new classes.ScriptQueue([]);
const promptLine = async () => {
    rl.question(">> ", async (line: string) => {
        await runLine(line, linepos++);
        await promptLine();
    });
};

const runLine = async (line: string, linepos: number) => {
    if (line.trim() === "" || line.trim().startsWith("#")) {
        await queue.runLine(new classes.EmptyQueueLine());
        return;
    }
    const split = new StringSplitter(line, linepos).parse();
    if (split == null) {
        return;
    }
    const command = split[0];
    const args = split.slice(1);

    if (command === undefined) {
        return;
    }

    await queue.runLine(new classes.ScriptQueueLine(false, command, args, queue.nextLineIndex, line, queue));
};

class StringSplitter {
    private start: number = 0;
    private current: number = 0;
    private length: number;
    private elements: string[] = [];
    private hadError: boolean = false;
    public constructor(public input: string, private linepos: number) {
        this.length = input.length;
    }
    private isAtEnd() {
        return this.current >= this.length;
    }
    private advance() {
        this.current++;
        return this.input.charAt(this.current - 1);
    }
    private peek() {
        return this.input[this.current];
    }
    private peekNext() {
        return this.input[this.current + 1];
    }
    private isNext(char: string) {
        return this.peekNext() === char;
    }
    public parse() {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scan();
        }
        if (this.hadError) {
            return null;
        }
        return this.elements;
    }
    private scan() {
        let c = this.advance();
        if (["\n", "\r"].includes(c)) {
            return;
        }
        if (c === '"') {
            this.string();
        } else {
            this.keyword();
        }
    }
    private string() {
        while (this.peek() !== '"' && !this.isAtEnd()) {
            this.advance();
        }
        if (this.isAtEnd()) {
            this.error("Unterminated string.");
            return;
        }
        this.advance();
        const value = this.input.slice(this.start + 1, this.current - 1);
        this.elements.push(value);
    }
    private keyword() {
        while (this.peek() !== " " && !this.isAtEnd()) {
            this.advance();
        }
        const value = this.input.slice(this.start, this.current);
        this.elements.push(value);
        this.advance();
    }
    public error(message: string) {
        console.log(
            `${c.basic.red.fore}Error while parsing at character '${c.basic.blue.fore}${this.current}${c.basic.red.fore}' in line '${c.basic.blue.fore}${this.linepos}${c.basic.red.fore}':\n    ${c.basic.white.fore}${message}${c.colorCodes.reset}`
        );
        this.hadError = true;
    }
}

if (process.argv.length === 2) {
    console.log(`TSTickScript by 0TickPulse. AGPLv3.0`);
    console.log(`Type "help" for help.`);
    promptLine();
} else {
    const file = process.argv[2];
    console.log(`Attempting to run ${file}...`);

    if (!fs.existsSync(file)) {
        console.error(`File ${file} does not exist.`);
        process.exit(1);
    }

    queue.file = file;
    const data = fs.readFileSync(file, "utf8");
    const lines = data.split("\r");
    lines.forEach(async (line, index) => {
        await runLine(line, index + 1);
    });
    process.exit(0);
}

// Register commands
import "./core/commands/print.js";
import "./core/commands/exit.js";
import "./core/commands/var.js";
import "./core/commands/printvar.js";
import "./core/commands/readFile.js";
import "./core/commands/writeFile.js";
import "./core/commands/help.js";
