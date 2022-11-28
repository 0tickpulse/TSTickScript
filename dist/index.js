import readline from "readline";
import fs from "fs";
import * as classes from "./core/classes.js";
import * as c from "./utils/consoleColors.js";
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
let linepos = 1;
const queue = new classes.ScriptQueue([]);
const promptLine = async () => {
    rl.question(">> ", async (line) => {
        await runLine(line, linepos++);
        await promptLine();
    });
};
const runLine = async (line, linepos) => {
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
    input;
    linepos;
    start = 0;
    current = 0;
    length;
    elements = [];
    hadError = false;
    constructor(input, linepos) {
        this.input = input;
        this.linepos = linepos;
        this.length = input.length;
    }
    isAtEnd() {
        return this.current >= this.length;
    }
    advance() {
        this.current++;
        return this.input.charAt(this.current - 1);
    }
    peek() {
        return this.input[this.current];
    }
    peekNext() {
        return this.input[this.current + 1];
    }
    isNext(char) {
        return this.peekNext() === char;
    }
    parse() {
        while (!this.isAtEnd()) {
            this.start = this.current;
            this.scan();
        }
        if (this.hadError) {
            return null;
        }
        return this.elements;
    }
    scan() {
        let c = this.advance();
        if (["\n", "\r"].includes(c)) {
            return;
        }
        if (c === '"') {
            this.string();
        }
        else {
            this.keyword();
        }
    }
    string() {
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
    keyword() {
        while (this.peek() !== " " && !this.isAtEnd()) {
            this.advance();
        }
        const value = this.input.slice(this.start, this.current);
        this.elements.push(value);
        this.advance();
    }
    error(message) {
        console.log(`${c.basic.red.fore}Error while parsing at character '${c.basic.blue.fore}${this.current}${c.basic.red.fore}' in line '${c.basic.blue.fore}${this.linepos}${c.basic.red.fore}':\n    ${c.basic.white.fore}${message}${c.colorCodes.reset}`);
        this.hadError = true;
    }
}
if (process.argv.length === 2) {
    console.log(`TSTickScript by 0TickPulse. AGPLv3.0`);
    console.log(`Type "help" for help.`);
    promptLine();
}
else {
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
