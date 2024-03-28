const { errorEmbed, correctEmbed } = require("../../implementions/EmbedConstructor");
const { getCommand, reloadCommand } = require("../../handlers/CommandHandler");

module.exports = {
    config: {
        name: "reload",
        aliases: ["reloadcommand", "rcommand", "reloadc", "rc"],
        description: "Comando para reiniciar um comando.",
        usage: "<p><l> <command>",
        category: "developers"
    },

    async run(bot, message, args) {
        if(!bot.config.developers.includes(message.author.id)) {
            message.channel.send(
                errorEmbed(`${message.member}, você não tem permissão de usar este comando.`,
                `Apenas meus desenvolvedores tem acesso à este comando.`
            )
            ).then(m => m.delete({timeout: 5000}));
                
            return message.delete().catch(() => {return});
        }

        if(!args[0]) {
            message.channel.send(
                errorEmbed(`${message.member}, você não inseriu o comando à ser reiniciado.`)
            ).then(m => m.delete({timeout: 5000}));
                
            return message.delete().catch(() => {return});
        }

        if(!getCommand(args[0])) {
            message.channel.send(
                errorEmbed(`${message.member}, este comando não existe.`)
            ).then(m => m.delete({timeout: 5000}));
                
            return message.delete().catch(() => {return});
        }

        try {
            const reload = reloadCommand(args[0]);

            message.channel.send(
                correctEmbed(
                    `Comando recarregado com sucesso!\n\n**Comando:** \`${reload}\``, 
                    `Autor: ${message.author.tag}`,
                    message.author.displayAvatarURL({format: "png", dynamic: true})
                )
            );
        }catch(e) {
            message.channel.send(
                errorEmbed(`${message.member}, ocorreu algum erro ao recarregar este comando.`, e)
            ).then(m => m.delete({timeout: 5000}));
                
            return message.delete().catch(() => {return});
        }
    }
}