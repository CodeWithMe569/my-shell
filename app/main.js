const readline = require('readline');

const rl = readline.createInterface(
	input: process.stdin,
	output: process.stdout
);

rl.setPrompt("$ ");
rl.prompt();


rl.on('line', async (line) => {

	if (line === "exit") {
		process.exit(0);
	} else if (line.substring(0,4) === "echo") {
		process.stdout.write(line + "\n");
		rl.prompt();
		return;
	}

	process.stdout.write(line + ": command not found");
	rl.prompt();
});
