import * as classes from "../classes.js";
classes.registerScriptCommand({
    name: "if",
    description: "If a condition is true, run a command.",
    args: [
        {
            name: "message",
            type: "linear",
        }
    ],
    run: async (queue, line, args) => {
        console.log(args["message"]);
    }
});
