import * as classes from "../classes.js";
classes.registerScriptCommand({
    name: "print",
    description: "Prints a message to the console.",
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
