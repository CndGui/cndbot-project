const { errorEmbed, correctEmbed } = require("../../implementions/EmbedConstructor");
const UserUtils = require("../../utils/UserUtils");
const { MessageEmbed } = require("discord.js");
const GuildUtils = require("../../utils/GuildUtils");

module.exports = {
    config: {
        name: "unban",
        aliases: ["desbanir"],
        description: "Comando para desbanir usuários.",
        usage: "<p><l> <user>",
        category: "moderations"
    },

    async run(bot, message, args) {
        if(!message.member.hasPermission("BAN_MEMBERS")) {
            message.channel.send(
                errorEmbed(`${message.member}, você não tem permissão para executar este comando.`,
                `Permissão: Banir membros.`
            )
            ).then(m => m.delete({timeout: 5000}));
            
            return message.delete().catch(e => {return});
        };

        if(!args[0]) {
            message.channel.send(
                errorEmbed(`${message.member}, você não inseriu o usuário à ser desbanido.`)
            ).then(m => m.delete({timeout: 5000}));
            
            return message.delete().catch(e => {return});
        }

        const user = await UserUtils.fetchUser(args[0])
        if(!user) {
            message.channel.send(
                errorEmbed(`${message.member}, não achei esse usuário.`)
            ).then(m => m.delete({timeout: 5000}));

            return message.delete().catch(e => {return});
        }

        const banVerify = await message.guild.fetchBan(user.id).catch(e => {return null});
        if(!banVerify) {
           message.channel.send(
                errorEmbed(`${message.member}, esse usuário não está banido.`)
            ).then(m => m.delete({timeout: 5000}));

            return message.delete().catch(e => {return});
        }

        try {
            await message.guild.members.unban(user);

            message.channel.send(
                correctEmbed(
                    `Usuário desbanido com sucesso!\n\n**Usuário**: \`${user.tag}\` (\`${user.id}\`)`,
                    `Autor: ${message.author.tag}`,
                    message.author.displayAvatarURL({format: "png", dynamic: true})
                  )
            );
                
            message.delete().catch(() => {return});

            const Guild = await GuildUtils.getOrCreate(message.guild);
            const logChannel = message.guild.channels.cache.get(Guild.settings.log.channel);
            if(logChannel) {
                logChannel.send(
                    new MessageEmbed()
                    .setColor(message.guild.me.displayHexColor)
                    .setAuthor(`Autor: ${message.author.tag} (${message.author.id})`, message.author.displayAvatarURL({format: "png", dynamic: true}))
                    .setDescription(`**Usuário**: \`${user.tag}\` (\`${user.id}\`)\n**Motivo**: \`${reason}\``)
                    .setFooter(`Punição: Unban.`)
                    .setTimestamp()
                )
            }
        }catch(e) {
            message.channel.send(
                errorEmbed(`${message.member}, ocorreu algum erro ao desbanir esse usuário.`, e)
                ).then(m => m.delete({timeout: 5000}));

            return message.delete().catch(e => {return});
        }
    }
}