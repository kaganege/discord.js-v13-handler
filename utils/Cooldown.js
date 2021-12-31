const { Collection } = require("discord.js");

const cooldowns = new Collection();
module.exports.db = cooldowns;

/**
 *
 * @param {Object} command
 * @param {message.author.id} user ID
 */
module.exports = (command, user) => {
	if (!cooldowns.has(command.name)) {
		cooldowns.set(command.name, new Collection());
	}

	const now = Date.now();
	const timestamp = cooldowns.get(command.name);
	const amount = (command.cooldown || 5) * 1000;

	if (timestamp.has(user)) {
		const expirationTime = timestamp.get(user) + amount;

		if (now < expirationTime) {
			const left = expirationTime - now
			return left;
		} else {
			return false;
		}
	} else {
		timestamp.set(user, now);
		setTimeout(() => {
			timestamp.delete(user);
		}, amount);

		return false;
	}
};
