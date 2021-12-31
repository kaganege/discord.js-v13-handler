const Table = require("ascii-table");
const { owners, presence } = require("../config.json");

module.exports = {
	name: "ready",
	once: true,
	async execute(client, Discord) {
		client.user.setPresence({
			activities: [{ name: `${presence.activity}`, type: `${presence.type}` }],
			status: `${presence.status}`,
		});

		const ReadyTable = new Table(client.user.tag);

		switch (presence.type) {
			case "PLAYING":
				ReadyTable.addRow("Aktivite", `${presence.activity} Oynuyor`);
				break;
			case "WATCHING":
				ReadyTable.addRow("Aktivite", `${presence.activity} izliyor`);
				break;
			case "STREAMING":
				ReadyTable.addRow("Aktivite", `${presence.activity} yayında`);
				break;
			case "LISTENING":
				ReadyTable.addRow("Aktivite", `${presence.activity} dinliyor`);
				break;
			case "COMPETING":
				ReadyTable.addRow(
					"Aktivite",
					`${presence.activity} yarışmasında yarışıyor`
				);
				break;
		}
		ReadyTable.addRow("Durum", presence.status);

		console.log(ReadyTable.render());
	},
};
