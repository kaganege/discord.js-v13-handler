const { SlashCommandBuilder } = require("@discordjs/builders");
const Timestamp = require("../../utils/DiscordTimestamp.js");

module.exports = {
	data: new SlashCommandBuilder()
		.setName("kullanıcı-bilgi")
		.setDescription("Belirtilen kullanıcının bilgilerini gösterir")
		.addUserOption((option) =>
			option
				.setName("kullanıcı")
				.setDescription("Bilgileri gösterilecek kullanıcı")
				.setRequired(false)
		),

	async execute({ interaction, client, Embed }) {
		const target = interaction.options.getMember("kullanıcı");
		const targetRoles = target.roles.cache;

		await interaction.reply({
			embeds: [
				new Embed({
					thumbnail: target.user.avatarURL({ dynamic: true, format: "png" }),
					title: `Kullanıcı bilgileri`,
					description: `
					**Etiket:** ${target.user.toString()}
					**Tag:** \`${target.user.tag}\`
					**ID:** \`${target.user.id}\`
					**Takma Ad:** \`${target.nickname || "Yok"}\`
					**Sunucuya Katılma Tarihi:** ${Timestamp(
						new Date(target.joinedTimestamp),
						"f"
					)} (${Timestamp(new Date(target.joinedTimestamp), "R")})
					**Hesap Oluşturma Tarihi:** ${Timestamp(
						new Date(target.user.createdTimestamp),
						"f"
					)} (${Timestamp(new Date(target.user.createdTimestamp), "R")})
					**Rolleri (${targetRoles.size - 1}):**
					> ${
						targetRoles.size > 7
							? targetRoles
									.filter((r) => r.name != "@everyone")
									.map((r) => r.toString())
									.slice(0, 6)
									.join(", ") + "..."
							: targetRoles
									.filter((r) => r.name != "@everyone")
									.map((r) => r.toString())
									.join(", ")
					}
					`,
				}).build(),
			],
		});
	},
};
