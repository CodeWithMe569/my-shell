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
	} else if (line.substring(0,4) === "type" {
		command = line.substring(5);
		if (command === "echo" || command === "exit" || command === "type") {
			process.stdout.write(command + ": is a shell builtin\n");
		} else {
			process.stdout.write(command + ": not found");
		}
		rl.prompt();
		return;
	}

	process.stdout.write(line + ": command not found");
	rl.prompt();
});
