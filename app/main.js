const readline = require('readline');
const fs = require('fs');
const path = require('path');

const { PATH } = process.env || "";

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.setPrompt("$ ");
rl.prompt();

function checkCommandPath(cmd, dirs) {

	for (let dir of dirs) {
		const fullPath = path.join(dir, cmd);
		try {
			fs.access(fullPath, fs.constants.X_OK, (e) => {
				// do nothing
			})
			return fullPath;
		} catch (e) {
			// do nothing
		}
	}

	return null;
}

rl.on('line', async (line) => {

	if (line === "exit") {
		process.exit(0);
	} else if (line.substring(0, 4) === "echo") {
		console.log(line.substring(5));
		rl.prompt();
		return;
	} else if (line.substring(0, 4) === "type") {
		command = line.substring(5);
		const dirs = PATH.split(path.delimiter);
		if (["type", "echo", "exit"].includes(command)) {
			console.log(`${command}: is a shell builtin`);
			rl.prompt();
			return;
		}
		const fullPath = checkCommandPath(command, dirs);
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
