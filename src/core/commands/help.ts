import * as classes from "../classes.js";

classes.registerScriptCommand({
    name: "help",
    description: "Displays a list of commands.",
    args: [],
    run: async (queue: classes.ScriptQueue, line, args) => {
        console.log(classes.scriptCommands.map((command) => command.name));
    }
});
