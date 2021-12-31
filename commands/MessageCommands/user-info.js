const Timestamp = require("../../utils/DiscordTimestamp.js");

module.exports = {
	name: "kullanıcı-bilgi",
	aliases: ["user-info", "kb"],
	channel: "GUILD",
	cooldown: 4,
	async execute({ message, args, Embed }) {
		const target =
			message.mentions.members.first() ||
			message.guild.members.cache.get(args[0]) ||
			message.guild.members.cache.find((member) =>
				member.user.username.toLowerCase().includes(args[0])
			) ||
			message.member;
		const targetRoles = target.roles.cache;

		await message.channel.send({
			embeds: [
				new Embed({
					title: `Kullanıcı bilgileri`,
					thumbnail: target.displayAvatarURL({ dynamic: true, format: "png" }),
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
