import * as classes from "../classes.js";
classes.registerScriptCommand({
    name: "input",
    description: "Asks the user for input, and stores it in a variable.",
    args: [
        {
            name: "message",
            type: "linear",
        },
        {
            name: "variable",
            type: "linear",
        }
    ],
    run: (queue, line, args) => {
        console.log(args["message"]);
    }
});
