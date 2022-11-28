import * as classes from "../classes.js";

classes.registerScriptCommand({
    name: "exit",
    description: "Exits the program if run in a commandline.",
    args: [
        {
            name: "code",
            type: "prefixed",
            acceptIf: (arg: any) => !isNaN(parseInt(arg)),
            default: "0"
        }
    ],
    run: async (queue: classes.ScriptQueue, line, args) => {
        if (queue)
        process.exit(parseInt(args["code"]));
    }
})
