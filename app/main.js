const readline = require("readline");
const fs = require("fs");
const path = require('path');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

rl.setPrompt("$ ");
rl.prompt("");

function checkCommandPath(cmd, dirs) {
    // 1. Get the list of executable extensions (e.g., .EXE, .CMD)
    // Default to empty array if PATHEXT is not set (Linux/Mac)
    const pathExtEnv = process.env.PATHEXT || '';
    const extensions = pathExtEnv.split(path.delimiter).filter(ext => ext) || [""]; // Remove empty strings
    
    // 2. Add an empty string to check for the exact match first (essential for Linux or if user types .exe)
    if (!extensions.includes("")) {
        extensions.unshift(""); 
    }

    for (let dir of dirs) {
        // 3. Loop through extensions for every directory
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

rl.on("line", async (line) => {
    // Trim line to handle accidental whitespace
    line = line.trim(); 

    if (line.split(" ")[0] === "exit") {
        process.exit(0);
    } 
    // Fix: Ensure 'echo' is matched correctly (avoid matching 'echoo')
    else if (line.startsWith("echo ")) {
        console.log(line.substring(5));
        rl.prompt();
        return;
    } 
    else if (line.startsWith("type ")) {
        const command = line.substring(5).trim();
        const pathEnv = process.env.PATH || "";
        const dirs = pathEnv.split(path.delimiter);
        
        if (["type", "echo", "exit"].includes(command)) {
            console.log(`${command} is a shell builtin`);
            rl.prompt();
            return;
        }
        
        let fullPath = checkCommandPath(command, dirs);
        if (fullPath) {
            console.log(`${command} is ${fullPath}`);
        } else {
            console.log(`${command}: not found`);
        }
        rl.prompt();
        return;
    }
	
	console.log(`${line}: command not found`);
    rl.prompt();
});