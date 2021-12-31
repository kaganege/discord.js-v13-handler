const fs = require("fs");
const discord = require("discord.js");

module.exports = (client) => {
	const events = fs
		.readdirSync("events")
		.filter((file) => file.endsWith(".js"));

	for (const file of events) {
		const event = require(`../events/${file}`);

		if (event.once) {
			client.once(event.name, async (...args) => {
				event.execute(...args, client, discord);
			});
		} else {
			client.on(event.name, async (...args) => {
				event.execute(...args, client, discord);
			});
		}
	}
};
