const { errorEmbed, correctEmbed } = require("../../implementions/EmbedConstructor");
const MemberUtils = require("../../utils/MemberUtils");
const { MessageEmbed } = require("discord.js");
const GuildUtils = require("../../utils/GuildUtils");
const ms = require("ms");

module.exports = {
    config: {
        name: "mute",
        aliases: [""],
        description: "Comando para mutar membros.",
        usage: "<p><l> <member> <time> [reason]",
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
                errorEmbed(`${message.member}, você não inseriu o usuário à ser mutado.`)
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
        if(Member.muted[0]) {
            message.channel.send(
                errorEmbed(`${message.member}, esse membro já está mutado.`)
            ).then(m => m.delete({timeout: 5000}));
                
            return message.delete().catch(() => {return});
        }

        if(!args[1]) {
            message.channel.send(
                errorEmbed(`${message.member}, insira o tempo que o membro ficará mutado.`)
            ).then(m => m.delete({timeout: 5000}));
                
            return message.delete().catch(() => {return});
        }

        if(!Number(ms(args[1]))) {
            message.channel.send(
                errorEmbed(`${message.member}, você não inseriu corretamente o horário.`, `Exemplos: 1s, 1m, 1d ou 1d.`)
            ).then(m => m.delete({timeout: 5000}));
                
            return message.delete().catch(() => {return});
        }

        let reason = args.slice(2).join(" ");
        if(!reason) {
            reason = "Sem razão.";
        }

        try {
            Member.muted = [message.author.id, member.user.id, (Date.now() +  ms(args[1])), reason];
            Member.save().catch(e => {return});

            const mutedRole = message.guild.roles.cache.find(role => role.name.toLowerCase() == "muted");
            if(!mutedRole) {
                mutedRole = await message.guild.roles.create({
                    data: {
                        name: "Muted",
                        permissions: [],
                        mentionable: false
                    }
                });
            }

            if(!member.roles.cache.has(mutedRole.id)) {
                member.roles.add(mutedRole.id);
            }

            message.channel.send(
                correctEmbed(
                    `Membro mutado com sucesso!\n\n**Membro**: \`${member.user.tag}\` (\`${member.user.id}\`)\n**Tempo**: \`${args[1]}\``,
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
                    .setDescription(`**Membro**: \`${member.user.tag}\` (\`${member.user.id}\`)\n**Motivo**: \`${reason}\`\n**Tempo**: \`${args[1]}\``)
                    .setFooter(`Punição: Mute.`)
                    .setTimestamp()
                )
            }
        }catch(e) {
            console.log(e)
            message.channel.send(
                errorEmbed(`${message.member}, ocorreu algum erro ao mutar esse usuário.`, e)
                ).then(m => m.delete({timeout: 5000}));

            return message.delete().catch(e => {return});
        }
    }
}