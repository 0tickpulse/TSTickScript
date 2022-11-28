import * as classes from "../classes.js";
import * as fs from "fs";

classes.registerScriptCommand({
    name: "writefile",
    description: "Writes to a file.",
    args: [
        {
            name: "file",
            type: "linear"
        },
        {
            name: "data",
            type: "linear"
        }
    ],
    run: async (queue: classes.ScriptQueue, line, args) =>
        new Promise<void>((resolve, reject) => {
            fs.writeFile(args["file"], args["data"], (err) => {
                if (err) {
                    line.error(err.message);
                    resolve();
                }
            });
        })
});
