const config = require("../config.json");
const { prefix, owners } = config;

const Embed = require("../utils/EmbedBuilder.js");

module.exports = {
	name: "interactionCreate",
	async execute(interaction, client, discord) {
		if (interaction.isContextMenu()) {
			const command = client.contextMenus.get(interaction.commandName);

			if (!command)
				return interaction.reply({
					embeds: [
						new Embed({
							description: `Bu komutu çalıştırırken bir hata ile karşılaştım! Lütfen daha sonra tekrar deneyiniz.`,
						}).build("error"),
					],
					ephemeral: true,
				});

			try {
				command.execute({ interaction, client, discord, Embed });
			} catch (error) {
				interaction.reply({
					embeds: [
						new Embed({
							description: `Bu komutu çalıştırırken bir hata ile karşılaştım! Lütfen daha sonra tekrar deneyiniz.`,
						}).build("error"),
					],
					ephemeral: true,
				});
				console.error(error.stack);
			}
		}

		if (interaction.isCommand()) {
			const command = client.slashCommands.get(interaction.commandName);

			if (!command)
				return interaction.reply({
					content:
						"Bu komutu çalıştırırken bir hata oldu! Lütfen daha sonra tekrar deneyiniz.",
					ephemeral: true,
				});

			try {
				command.execute({ interaction, client, discord, Embed });
			} catch (error) {
				interaction.reply({
					content:
						"Bu komutu çalıştırırken bir hata oldu! Lütfen daha sonra tekrar deneyiniz.",
					ephemeral: true,
				});
				console.error(error.stack);
			}
		}
	},
};
