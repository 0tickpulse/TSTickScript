import * as classes from "../classes.js";

classes.registerScriptCommand({
    name: "printvar",
    description: "Prints the value of a variable (before I start making tags and stuff)",
    args: [
        {
            name: "name",
            type: "linear",
        }
    ],
    run: async (queue: classes.ScriptQueue, line, args) => {
        if (queue.variables[args["name"]] === undefined) {
            line.error(`The variable '${args["name"]}' is not defined!`);
            return;
        }
        console.log(`Value for variable ${args["name"]} is ${queue.variables[args["name"]]}`);
    }
})
