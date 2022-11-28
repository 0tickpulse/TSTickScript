import * as c from "../utils/consoleColors.js";

export class EmptyQueueLine {}
export class ScriptQueueLine {
    public constructor(
        public readonly noRun: boolean,
        public readonly command: string,
        public readonly args: string[],
        public readonly linepos: number,
        public readonly plaintext: string,
        public readonly queue: ScriptQueue
    ) {}
    public error(message: string) {
        console.error(
            `${c.basic.red.fore}Error in queue '${c.basic.blue.fore}${this.queue.index}${c.basic.red.fore}' in line '${c.basic.blue.fore}${
                this.linepos
            }${c.basic.red.fore}'${this.queue.file !== undefined ? ` in file '${c.basic.blue.fore}${this.queue.file}${c.basic.red.fore}'` : ""}:\n    ${c.basic.white.fore}${message}${
                c.colorCodes.reset
            }`
        );
    }
    public async runLine(queue: ScriptQueue) {
        if (this.noRun) {
            return;
        }
        const commandNames = scriptCommands.map((command) => command.name);
        if (!commandNames.includes(this.command)) {
            this.error(`Command ${this.command} does not exist!`);
            return;
        }
        const command = scriptCommands[commandNames.indexOf(this.command)];
        // manages args
        const outputArgs: { [key: string]: any } = {};
        const inputLinearArgs = this.args.filter((arg) => !arg.startsWith("-"));
        const inputPrefixedArgs = this.args.filter((arg) => arg.startsWith("-"));
        const inputPrefixedArgMap = inputPrefixedArgs
            .map((arg) => {
                const split = arg.split("=");
                return {
                    [split[0].slice(1)]: split[1] ?? true
                };
            })
            .reduce((a, b) => ({ ...a, ...b }), {});

        const desiredLinearArgs = command.args.filter((arg) => arg.type === "linear");
        const desiredPrefixedArgs = command.args.filter((arg) => arg.type === "prefixed");

        inputLinearArgs.forEach((inputLinearArg, index) => {
            const desiredLinearArg = desiredLinearArgs[index];
            if (desiredLinearArg === undefined) {
                this.error(`The arg '${c.basic.blue.fore}${inputLinearArg}${c.basic.white.fore}' could not be interpreted!`);
                return;
            }
            if (desiredLinearArg.acceptIf !== undefined && !desiredLinearArg.acceptIf(inputLinearArg)) {
                this.error(
                    `The arg '${c.basic.blue.fore}${inputLinearArg}${c.basic.white.fore}' is not a valid arg for arg '${c.basic.blue.fore}${desiredLinearArg.name}${c.basic.white.fore}'!`
                );
                return;
            }
            outputArgs[desiredLinearArg.name] = inputLinearArg;
        });

        for (const desiredPrefixedArg of desiredPrefixedArgs) {
            const inputPrefixedArg = inputPrefixedArgMap[desiredPrefixedArg.name];
            if (inputPrefixedArg === undefined) {
                continue;
            }
            if (desiredPrefixedArg.acceptIf !== undefined && !desiredPrefixedArg.acceptIf(inputPrefixedArg)) {
                this.error(
                    `The arg '${c.basic.blue.fore}${inputPrefixedArg}${c.basic.white.fore}' is not a valid arg for arg '${c.basic.blue.fore}${desiredPrefixedArg.name}${c.basic.white.fore}'!`
                );
                break;
            }
        }

        // make sure all required args are entered
        for (const desiredArg of [...desiredLinearArgs, ...desiredPrefixedArgs]) {
            if (desiredArg.default === undefined && !outputArgs.hasOwnProperty(desiredArg.name)) {
                this.error(`The arg '${c.basic.blue.fore}${desiredArg.name}${c.basic.white.fore}' is required!`);
                return;
            }
        }

        // run the command
        await command.run(queue, this, outputArgs);
    }
}

let queueIndex = 0;
export class ScriptQueue {
    public variables: { [key: string]: any } = {};
    public index: number;
    public constructor(public lines: (ScriptQueueLine | EmptyQueueLine)[], public file: string | undefined = undefined) {
        this.index = ++queueIndex;
    }
    public async runLine(line: ScriptQueueLine | EmptyQueueLine) {
        this.lines.push(line);
        if (line instanceof ScriptQueueLine) {
            await line.runLine(this);
        }
    }
    public get nextLineIndex() {
        return this.lines.length + 1;
    }
}
export interface ScriptCommandArg {
    name: string;
    /**
     * Defaults to false (linear).
     */
    type: "linear" | "prefixed";
    default?: any;
    acceptIf?: (arg: any) => boolean;
}
export interface ScriptCommand {
    name: string;
    description: string;
    args: ScriptCommandArg[];
    run: (queue: ScriptQueue, line: ScriptQueueLine, args: { [key: string]: any }) => Promise<void>;
}
export let scriptCommands: ScriptCommand[] = [];
export const registerScriptCommand = (command: ScriptCommand) => {
    scriptCommands.push(command);
};
