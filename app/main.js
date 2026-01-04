const readline = require("readline");
const fs = require("fs");
const path = require('path');

const { PATH } = process.env || "";

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

rl.setPrompt("$ ");
rl.prompt("");


rl.on("line", async (line) => {

	if (line === "exit") {
		process.exit(0);
	} else if (line.substring(0, 4) === "echo") {
		console.log(line.substring(5));
		rl.prompt();
		return;
	} else if (line.substring(0, 4) === "type") {
		const command = line.substring(5);
		const dirs = PATH.split(path.delimiter);
		if (["type", "echo", "exit"].includes(command)) {
			console.log(`${command} is a shell builtin`);
			rl.prompt();
			return;
		}
		let fullPath;
		for (let dir of dirs) {
			fullPath = path.join(dir, command);
			console.log(dir);
			console.log(command);
			try {
				fs.accessSync(fullPath, fs.constants.X_OK);
			} catch (e) {
				// do nothing
				continue;
			}
		}
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
