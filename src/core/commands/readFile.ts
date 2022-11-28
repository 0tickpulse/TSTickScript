import * as classes from "../classes.js";
import * as fs from "fs";

classes.registerScriptCommand({
    name: "readfile",
    description: "Reads a file and stores the data in a variable.",
    args: [
        {
            name: "file",
            type: "linear"
        },
        {
            name: "variable",
            type: "linear"
        }
    ],
    run: async (queue: classes.ScriptQueue, line, args) => {
        fs.readFile(args["file"], (err, data) => {
            if (err) {
                line.error(err.message);
                return;
            }
            queue.variables[args["variable"]] = data.toString();
        });
    }
});
