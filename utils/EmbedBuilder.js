const Discord = require("discord.js");
const { MessageEmbed } = Discord;
const hiddenColor = "#2F3136";

module.exports = class EmbedBuilder {
	/**
	 * @name EmbedBuilder
	 * @author Tavuk Döner#7528
	 * @description Embed oluşturur.
	 * @example new Embed({ description: "Hello World" }).build()
	 * @returns {MessageEmbed} MessageEmbed
	 */
	constructor({
		title,
		description,
		color,
		footer,
		timestamp,
		thumbnail,
		author,
	}) {
		this.embed = new MessageEmbed();
		this.title = title;
		this.description = description;
		this.color = color;
		this.timestamp = timestamp;
		this.thumbnail = thumbnail;

		switch (typeof author) {
			case "string":
				this.author.name = { name: author, image: null, url: null };
				break;
			case "object":
				this.author = footer;
				break;
			default:
				this.author = null;
				break;
		}

		switch (typeof footer) {
			case "string":
				this.footer = { text: footer, image: null };
				break;
			case "object":
				this.footer = footer;
				break;
			default:
				this.footer = null;
				break;
		}
	}

	/**
	 * @example new Embed().build("error")
	 */
	build(template) {
		const embed = this.embed;

		switch (template) {
			case "error": {
				embed.setTitle(this.title || "Hata").setColor(this.color || "RED");

				this.author
					? embed.setAuthor(
							this.author.name,
							this.author.image || null,
							this.author.url
					  )
					: null;
				this.description ? embed.setDescription(this.description) : null;
				this.timestamp ? embed.setTimestamp(this.timestamp) : null;
				this.thumbnail ? embed.setThumbnail(this.thumbnail) : null;
				this.footer
					? embed.setFooter(this.footer.text, this.footer.image || null)
					: null;

				return embed;
			}
			default: {
				this.author
					? embed.setAuthor(
							this.author.name,
							this.author.image || null,
							this.author.url
					  )
					: null;
				this.title ? embed.setTitle(this.title) : null;
				this.description ? embed.setDescription(this.description) : null;
				this.color ? embed.setColor(this.color) : embed.setColor(hiddenColor);
				this.timestamp ? embed.setTimestamp(this.timestamp) : null;
				this.thumbnail ? embed.setThumbnail(this.thumbnail) : null;
				this.footer
					? embed.setFooter({text: this.footer.text, iconURL: this.footer.image || null})
					: null;

				return embed;
			}
		}
	}
};
