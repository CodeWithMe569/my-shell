const readline = require("readline");
const fs = require("fs");
const path = require('path');
// 1. Import spawnSync to run external programs
const { spawnSync } = require("child_process");

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.setPrompt("$ ");
rl.prompt();

function checkCommandPath(cmd, dirs) {
    const pathExtEnv = process.env.PATHEXT || '';
    const extensions = pathExtEnv.split(path.delimiter);
    if (!extensions.includes("")) extensions.unshift(""); 

    for (let dir of dirs) {
        for (let ext of extensions) {
            const fullPath = path.join(dir, cmd + ext);
            try {
                fs.accessSync(fullPath, fs.constants.X_OK);
                return fullPath;
            } catch (e) {
                continue;
            }
        }
    }
    return null;
}

rl.on("line", (line) => {
    const input = line.trim();
    if (!input) {
        rl.prompt();
        return;
    }

    // Split input into command and arguments
    const parts = input.split(" ");
    const command = parts[0];
    const args = parts.slice(1);

    // 2. Handle Builtins
    if (command === "exit") {
        process.exit(0);
    } 
    else if (command === "echo") {
        console.log(args.join(" "));
    } 
    else if (command === "type") {
        const targetCmd = args[0];
        const pathEnv = process.env.PATH || "";
        const dirs = pathEnv.split(path.delimiter);
        
        if (["type", "echo", "exit"].includes(targetCmd)) {
            console.log(`${targetCmd} is a shell builtin`);
        } else {
            let fullPath = checkCommandPath(targetCmd, dirs);
            if (fullPath) {
                console.log(`${targetCmd} is ${fullPath}`);
            } else {
                console.log(`${targetCmd}: not found`);
            }
        }
    } 
    // 3. Handle External Commands
    else {
        const pathEnv = process.env.PATH || "";
        const dirs = pathEnv.split(path.delimiter);
        const fullPath = checkCommandPath(command, dirs);

        if (fullPath) {
            // Execute the program
            // stdio: "inherit" connects the child process to your terminal's input/output
            spawnSync(fullPath, args, { 
              stdio: "inherit",
              argv0: command
            });
        } else {
            console.log(`${command}: command not found`);
        }
    }

    rl.prompt();
});