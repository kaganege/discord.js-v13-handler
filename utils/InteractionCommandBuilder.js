const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const { clientId, token } = require("../config.json");
const { readdirSync } = require("fs");

const rest = new REST({ version: "9" }).setToken(token);
const commands = [];

const slashCommandFiles = readdirSync("commands/SlashCommands").filter((file) =>
	file.endsWith(".js")
);
const contextMenuFiles = readdirSync("commands/ContextMenu").filter((file) =>
	file.endsWith(".js")
);

for (const commandFile of slashCommandFiles) {
	const command = require(`../commands/SlashCommands/${commandFile}`);

	if (
		command.data &&
		command.data.name &&
		typeof command.execute == "function"
	) {
		command.data = command.data.toJSON();
		commands.push(command.data);
	}
}

for (const commandFile of contextMenuFiles) {
	const command = require(`../commands/ContextMenu/${commandFile}`);

	if (
		command.data &&
		command.data.name &&
		typeof command.execute == "function"
	) {
		command.data = command.data.toJSON();

		if (["MESSAGE", "USER"].includes(command.type)) {
			delete command.data.description;
			command.data.type = command.type == "USER" ? 2 : 3;
			commands.push(command.data);
		}
	}
}

rest
	.put(Routes.applicationCommands(clientId), { body: commands })
	.then(() => {
		console.log("Etkileşim komutları kuruldu!");
		process.exit(0);
	})
	.catch(console.error);
