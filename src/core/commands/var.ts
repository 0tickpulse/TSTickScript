import * as classes from "../classes.js";

classes.registerScriptCommand({
    name: "var",
    description: "Defines a variable.",
    args: [
        {
            name: "name",
            type: "linear"
        },
        {
            name: "value",
            type: "linear"
        }
    ],
    run: async (queue: classes.ScriptQueue, line, args) => {
        queue.variables[args["name"]] = args["value"];
    }
});
