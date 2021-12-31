/**
 * @name DiscordTimestamp
 * @param {Date} date Zamanı girin.
 * @param {String} type Zaman damgası türünü girin. (`t`, `T`, `f`, `F`, `R`)
 * @param {Number} second Belirtilen tarihten kaç saniye sonrası gösterilicek. (Zorunlu Değil)
 */
module.exports = (date = new Date(), type = "R", second = 0) => {
	const { time } = require("@discordjs/builders");

	return time(new Date(new Date(date).getTime() + 1000 * second), type);
};
