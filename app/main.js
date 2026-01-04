const readline = require('readline');

const rl = readline.createInterface(
	input: process.stdin,
	output: process.stdout
);

rl.setPrompt("$ ");
rl.prompt();


rl.on('line', async (line) => {

	if (line == "exit") {
		process.exit(0);
	}

	process.stdout.write(line + ": command not found");
	rl.prompt();
});
