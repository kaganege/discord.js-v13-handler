const { readdirSync } = require("fs");
const Table = require("ascii-table");
const commands = [];

let i = 0;

module.exports = async (client) => {
	const messageCommandFiles = readdirSync("commands/MessageCommands").filter(
		(file) => file.endsWith(".js")
	);
	const MessageTable = new Table(
		`Message Commands (${messageCommandFiles.length})`
	);

	const slashCommandFiles = readdirSync("commands/SlashCommands").filter(
		(file) => file.endsWith(".js")
	);
	const SlashTable = new Table(`Slash Commands (${slashCommandFiles.length})`);

	const contextMenuFiles = readdirSync("commands/ContextMenu").filter((file) =>
		file.endsWith(".js")
	);
	const ContextTable = new Table(`Context Menus (${contextMenuFiles.length})`);

	MessageTable.setHeading("", "Komut Adı", "Durum");
	for (const commandFile of messageCommandFiles) {
		const command = require(`../commands/MessageCommands/${commandFile}`);
		i++;

		if (command.name && typeof command.execute == "function") {
			try {
				MessageTable.addRow(i, command.name, "✔");
				client.commands.set(command.name, command);
			} catch (error) {
				MessageTable.addRow(
					i,
					commandFile.slice(0, commandFile.length - 3),
					"✘"
				);
			}
		} else {
			MessageTable.addRow(i, commandFile.slice(0, commandFile.length - 3), "✘");
		}
	}
	console.log(MessageTable.render());

	i = 0;

	SlashTable.setHeading("", "Komut Adı", "Durum");
	for (const commandFile of slashCommandFiles) {
		const command = require(`../commands/SlashCommands/${commandFile}`);
		i++;

		if (
			command.data &&
			command.data.name &&
			typeof command.execute == "function"
		) {
			try {
				command.data = command.data.toJSON();
				commands.push(command.data);

				SlashTable.addRow(i, command.data.name, "✔");

				client.slashCommands.set(command.data.name, command);
			} catch (error) {
				SlashTable.addRow(i, commandFile.slice(0, commandFile.length - 3), "✘");
			}
		} else {
			SlashTable.addRow(i, commandFile.slice(0, commandFile.length - 3), "✘");
		}
	}
	console.log(SlashTable.render());

	i = 0;

	ContextTable.setHeading("", "Komut Adı", "Durum");
	for (const commandFile of contextMenuFiles) {
		const command = require(`../commands/ContextMenu/${commandFile}`);
		i++;

		if (
			command.data &&
			command.data.name &&
			typeof command.execute == "function"
		) {
			try {
				command.data = command.data.toJSON();

				if (["MESSAGE", "USER"].includes(command.type)) {
					ContextTable.addRow(i, command.data.name, "✔");

					delete command.data.description;
					command.data.type = command.type == "USER" ? 2 : 3;
					commands.push(command.data);

					client.contextMenus.set(command.data.name, command);
				}
			} catch (error) {
				ContextTable.addRow(
					i,
					commandFile.slice(0, commandFile.length - 3),
					"✘"
				);
			}
		} else {
			ContextTable.addRow(i, commandFile.slice(0, commandFile.length - 3), "✘");
		}
	}

	console.log(ContextTable.render());
};
