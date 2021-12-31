const config = require("../config.json");
const { prefix, owners } = config;

const set = new Set();

const Embed = require("../utils/EmbedBuilder.js");

const escapeRegex = (string) => {
	return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

const uyarıMap = new Map();

module.exports = {
	name: "messageCreate",
	async execute(message, client, discord) {
		if (message.author.bot || message.webhookId) return;

		const prefixRegex = new RegExp(
			`^(<@!?${client.user.id}>|${escapeRegex(prefix)})\\s*`
		);

		if (!prefixRegex.test(message.content.trim().toLowerCase())) return;

		const [curentPrefix] = message.content
			.trim()
			.toLowerCase()
			.match(prefixRegex);

		const args = message.content.trim().slice(curentPrefix.length).split(/ +/);
		const commandName = args.shift().toLowerCase();

		const command =
			client.commands.get(commandName) ||
			client.commands.find(
				(command) => command.aliases && command.aliases.includes(commandName)
			);

		if (!command) return;

		if (
			!message.channel
				.permissionsFor(client.user.id)
				.has(["SEND_MESSAGES", "EMBED_LINKS", "MANAGE_CHANNELS"]) &&
			!uyarıMap.has(message.guild.id)
		) {
			message.guild.channels
				.create(`önemli-uyarı`, {
					reason:
						"Komutları çalıştırabilmem için `SEND_MESSAGES`, `EMBED_LINKS` ve `MANAGE_CHANNELS` yetkilerine ihtiyacım var!",
				})
				.then((channel) => {
					channel.overwritePermissions(
						message.guild.roles.filter((r) => r.name == "@everyone"),
						{
							VIEW_CHANNEL: false,
						}
					);

					uyarıMap.set(message.guild.id, "channelCreate");
					return channel
						.send({
							embeds: [
								new Embed({
									title: "Uyarı!",
									description: `${message.channel.toString()} kanalında ${message.author.toString()} tarafından kullanılan \`${
										command.name
									}\` komutunu çalıştırabilmem için \`SEND_MESSAGES\`, \`EMBED_LINKS\` ve \`MANAGE_CHANNELS\` yetkilerine ihtiyacım var!`,
								}).build("error"),
							],
						})
						.catch(() => channel.delete());
				})
				.catch(() => {
					client.users.cache
						.get(message.guild.ownerId)
						.send({
							embeds: [
								new Embed({
									title: "👋 Merhaba dostum!",
									description: `Senin sahibi olduğun **\`${
										message.guild.name
									}\`** sunucundaki ${message.channel.toString()} kanalında ${message.author.toString()} adlı kullanıcı benim \`${
										command.name
									}\` komutumu kullanmış ama görünüşe göre benim yetkim yok :frowning:\n\nBunu düzeltmek için bana \`SEND_MESSAGES\`, \`EMBED_LINKS\` ve \`MANAGE_CHANNELS\` yetkilerini verebilirsin!\n\n**Şimdiden Teşekkürler :slight_smile:**`,
									footer: "Not: Bu mesaj sadece sunucu sahibine atılır.",
								}),
							],
						})
						.then(() => {
							return uyarıMap.set(message.guild.id, "ownerSend");
						})
						.catch(() => {
							return uyarıMap.set(message.guild.id, "unsuccessful");
						});
				});
		}

		const cooldown = owners.includes(message.author.id)
			? null
			: require("../utils/Cooldown.js")(command, message.author.id);

		if (cooldown) {
			if (set.has(message.author.id)) return;

			set.add(message.author.id);
			return message.channel
				.send({
					embeds: [
						new Embed({
							description: `Bu komutu tekrar kullanmak için **${(
								cooldown / 1000
							)
								.toFixed(1)
								.replace(/\./g, ",")}** saniye beklemeniz gerekiyor!`,
							footer: {
								text: `${message.author.username} tarafından kullanıldı`,
								image: message.author.avatarURL({
									dynamic: true,
									format: "png",
								}),
							},
							timestamp: new Date(),
						}).build("error"),
					],
				})
				.then((m) => {
					if (cooldown > 4) {
						setTimeout(() => m.delete(), Number(cooldown));
					} else {
						setTimeout(() => m.delete(), 5000);
					}
				});
		}

		if (command.only) {
			switch (command.only) {
				case "owners": {
					if (!owners.includes(message.author.id)) {
						return message.channel.send({
							embeds: [
								new Embed({
									description: "Bu komutu sadece sahiplerim kullanabilir!",
									footer: {
										text: `${message.author.username} tarafından kullanıldı.`,
										image: message.author.avatarURL({
											dynamic: true,
											format: "png",
										}),
									},
									timestamp: new Date(),
								}).build("error"),
							],
						});
					}
					break;
				}

				default: {
					if (typeof command.only != "string") break;

					if (
						!owners.includes(message.author.id) &&
						message.author.id != command.only &&
						client.users.cache.has(command.only)
					) {
						return message.channel.send({
							embeds: [
								new Embed({
									description: `Bu komutu sadece \`${
										client.users.cache.get(command.only).tag
									}\` kullanabilir!`,
									footer: {
										text: `${message.author.username} tarafından kullanıldı.`,
										image: message.author.avatarURL({
											dynamic: true,
											format: "png",
										}),
									},
									timestamp: new Date(),
								}).build("error"),
							],
						});
					}
					break;
				}
			}
		}

		if (command.channel) {
			switch (command.channel) {
				case "DM" || 1: {
					if (message.channel.type != "DM") {
						return message.channel
							.send({
								embeds: [
									new Embed({
										description: `Bu komut sadece **Özel Mesajlar**da çalışır!`,
										footer: {
											text: `${message.author.username} tarafından kullanıldı.`,
											image: message.author.avatarURL({
												dynamic: true,
												format: "png",
											}),
										},
										timestamp: new Date(),
									}).build("error"),
								],
							})
							.del(10000);
					}
					break;
				}

				case "GUILD" || 0: {
					if (message.channel.type == "DM") {
						return message.channel
							.send({
								embeds: [
									new Embed({
										description: `Bu komut sadece **Sunucularda**da çalışır!`,
										footer: {
											text: `${message.author.username} tarafından kullanıldı.`,
											image: message.author.avatarURL({
												dynamic: true,
												format: "png",
											}),
										},
										timestamp: new Date(),
									}).build("error"),
								],
							})
							.del(10000);
					}
					break;
				}

				default: {
					if (typeof command.channel != "string") break;

					return message.channel
						.send({
							embeds: [
								new Embed({
									description: `Bu komut sadece ${client.channels.cache
										.get(command.channel)
										.toString()} (\`${
										command.channel
									}\`) kanalında kullanabilir!`,
									footer: {
										text: `${message.author.username} tarafından kullanıldı.`,
										image: message.author.avatarURL({
											dynamic: true,
											format: "png",
										}),
									},
									timestamp: new Date(),
								}).build("error"),
							],
						})
						.del(10000);
				}
			}
		}

		if (
			command.userPermissions &&
			!message.member.permissions.has(command.userPermissions) &&
			message.author.id != message.guild.ownerId
		) {
			return message.channel.send({
				embeds: [
					new Embed({
						description: `Bu komutu kullanabilmek için \`${command.userPermissions.join(
							"`, `"
						)}\` ${
							typeof command.userPermissions == "array"
								? command.userPermissions.length > 1
									? "yetkilerine"
									: "yetkisine"
								: "yetkisine"
						} sahip olmanız lazım!`,
					}).build("error"),
				],
			});
		}

		if (
			command.botPermissions &&
			!message.guild.me.permissions.has(command.botPermissions)
		) {
			return message.channel.send({
				embeds: [
					new Embed({
						description: `Bu komutu çalıştırmam için \`${command.botPermissions.join(
							"`, `"
						)}\` ${
							command.botPermissions.length > 1 ? "yetkilerine" : "yetkisine"
						} ihtiyacım var!`,
					}).build("error"),
				],
			});
		}

		try {
			command.execute({ message, client, args, discord, Embed });
		} catch (error) {
			message.channel.send({
				embeds: [
					new Embed({
						description: `
						Bu komutu çalıştırırken bir hata aldım!
						Hata:\`\`\`js\n${error.message}\`\`\``,
					}).build("error"),
				],
			});
		}
	},
};
