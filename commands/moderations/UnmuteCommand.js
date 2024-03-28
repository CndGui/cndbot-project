const { errorEmbed, correctEmbed } = require("../../implementions/EmbedConstructor");
const MemberUtils = require("../../utils/MemberUtils");
const { MessageEmbed } = require("discord.js");
const GuildUtils = require("../../utils/GuildUtils");

module.exports = {
    config: {
        name: "unmute",
        aliases: [""],
        description: "Comando para desmutar membros.",
        usage: "<p><l> <member>",
        category: "moderations"
    },

    async run(bot, message, args) {
        if(!message.member.hasPermission("MUTE_MEMBERS")) {
            message.channel.send(
                errorEmbed(`${message.member}, você não tem permissão para executar este comando.`,
                `Permissão: Silenciar membros.`
            )
            ).then(m => m.delete({timeout: 5000}));
            
            return message.delete().catch(e => {return});
        };

        if(!args[0]) {
            message.channel.send(
                errorEmbed(`${message.member}, você não inseriu o usuário à ser desmutado.`)
            ).then(m => m.delete({timeout: 5000}));
            
            return message.delete().catch(e => {return});
        }

        const member = await MemberUtils.getMember(message.guild, args[0])
        if(!member) {
            message.channel.send(
                errorEmbed(`${message.member}, não achei esse membro.`)
            ).then(m => m.delete({timeout: 5000}));

            return message.delete().catch(e => {return});
        }

        const Member = await MemberUtils.getOrCreate(message.guild, member);
        if(!Member.muted[0]) {
            message.channel.send(
                errorEmbed(`${message.member}, esse membro não está silenciado.`)
            ).then(m => m.delete({timeout: 5000}));
                
            return message.delete().catch(() => {return});
        }

        try {
            Member.muted = [];
            Member.save().catch(e => {return});

            const mutedRole = message.guild.roles.cache.find(role => role.name.toLowerCase() == "muted");
            if(mutedRole) {
                if(member.roles.cache.has(mutedRole.id)) {
                    member.roles.remove(mutedRole.id);
                }
            }

            message.channel.send(
                correctEmbed(
                    `Membro desmutado com sucesso!\n\n**Membro**: \`${member.user.tag}\` (\`${member.user.id}\`)`,
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
                    .setDescription(`**Membro**: \`${member.user.tag}\` (\`${member.user.id}\`)`)
                    .setFooter(`Punição: Unmute.`)
                    .setTimestamp()
                )
            }
        }catch(e) {
            console.log(e)
            message.channel.send(
                errorEmbed(`${message.member}, ocorreu algum erro ao desmutar esse usuário.`, e)
                ).then(m => m.delete({timeout: 5000}));

            return message.delete().catch(e => {return});
        }
    }
}