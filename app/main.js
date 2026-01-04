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
	for (let dir of dirs) {
		const fullPath = path.join(dir, cmd);
		try {
			fs.accessSync(fullPath, fs.constants.X_OK);
			return fullPath;
		} catch (e) {
			continue;
		}
	}
	return null;
}


rl.on("line", async (line) => {

	if (line === "exit") {
		process.exit(0);
	} else if (line.substring(0, 4) === "echo") {
		console.log(line.substring(5));
		rl.prompt();
		return;
	} else if (line.substring(0, 4) === "type") {
		const command = line.substring(5);
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
			rl.prompt();
			return;
		}
		else {
			console.log(`${command}: not found`);
			rl.prompt();
			return;
		}
	}

	console.log(`${line}: command not found`);
	rl.prompt();
});
