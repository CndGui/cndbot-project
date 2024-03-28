const { MessageEmbed } = require("discord.js");
const { bot } = require("../index");

module.exports = {
    correctEmbed(description, footer, footerImage) {
        const embed = new MessageEmbed()
        .setColor(bot().config.colors.green);

        if(description) {
            embed.setDescription(`${bot().config.emojis.correct} | ${description}`);
        };

        if(footer) {
            embed.setFooter(footer);
        };

        if(footerImage) {
            embed.setFooter(footer, footerImage);
        };

        return embed;
    },

    errorEmbed(description, footer, footerImage) {
        const embed = new MessageEmbed()
        .setColor(bot().config.colors.red);

        if(description) {
            embed.setDescription(`${bot().config.emojis.error} | ${description}`);
        };

        if(footer) {
            embed.setFooter(footer);
        };

        if(footerImage) {
            embed.setFooter(footer, footerImage);
        };

        return embed;
    }
}