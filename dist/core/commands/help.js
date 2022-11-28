import * as classes from "../classes.js";
classes.registerScriptCommand({
    name: "help",
    description: "Displays a list of commands.",
    args: [],
    run: async (queue, line, args) => {
        console.log(classes.scriptCommands.map((command) => command.name));
    }
});
