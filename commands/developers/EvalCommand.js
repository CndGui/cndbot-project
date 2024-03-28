const { errorEmbed } = require("../../implementions/EmbedConstructor");
const { MessageEmbed } = require("discord.js");

module.exports = {
    config: {
        name: "eval",
        aliases: ["e"],
        description: "Comando para executar códigos.",
        usage: "<p><l> <code>",
        category: "developers"
    },
    
    async run(bot, message, args) {
        if(!bot.config.developers.includes(message.author.id)) {
            message.channel.send(
                errorEmbed(`${message.member}, você não tem permissão para executar este comando.`,
                `Apenas meus desenvolvedores tem acesso à este comando.`
            )
            ).then(m => m.delete({timeout: 5000}));

            return message.delete().catch(() => {return});
        }

        if(!args[0]) {
            message.channel.send(
                errorEmbed(`${message.member}, você não inseriu o código.`)
            ).then(m => m.delete({timeout: 5000}));
                
            return message.delete().catch(() => {return});
        }

        try {
            let code = await eval(args.join(" "));
            if(typeof code !== "string") {
                code = require("util").inspect(code, {depth: 0});
            }

            message.channel.send(
                new MessageEmbed()
                .setColor(message.guild.me.displayHexColor)
                .setDescription(
                    `\`\`\`Código:\n\n${args.join(" ")}\`\`\`\n` +
                    `\`\`\`Resultado:\n\n${code}\`\`\``
                )
            );
        }catch(e) {
            message.channel.send(
                errorEmbed(
                    `\`\`\`Código:\n\n${args.join(" ")}\`\`\`\n` +
                    `\`\`\`Resultado:\n\n${e}\`\`\``
            )
            ).then(m => m.delete({timeout: 5000}));
        }
    }
}