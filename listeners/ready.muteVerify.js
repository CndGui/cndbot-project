const Member = require("../models/Member");
const GuildUtils = require("../utils/GuildUtils");
const { MessageEmbed } = require("discord.js");

module.exports = {
    async listener(bot, ready) {
        setInterval(async () => {
            const Members = await Member.find({});
            for(let i = 0; i < Members.length; i++) {
                const Member = Members[i];
                const guild = bot.guilds.cache.get(Member.serverId);
                const Guild = await GuildUtils.getOrCreate(guild);
                const logChannel = guild.channels.cache.get(Guild.settings.log.channel);
                const member = guild.members.cache.get(Member.id);
                const mutedTime = Member.muted[2];
                const mutedRole = guild.roles.cache.find(role => role.name.toLowerCase() == "muted");
                
                if(Date.now() > mutedTime) {
                    if(guild || member) {
                        try {
                            if(mutedRole) {
                                if(member.roles.cache.has(mutedRole.id)) {
                                    member.roles.remove(mutedRole.id);
                                }
                            }

                            Member.muted = [];
                            Member.save();

                            if(logChannel) {
                                logChannel.send(
                                    new MessageEmbed()
                                    .setColor(guild.me.displayHexColor)
                                    .setAuthor(`Autor: ${bot.user.tag} (${bot.user.id})`, bot.user.displayAvatarURL({format: "png", dynamic: true}))
                                    .setDescription(`**Membro**: \`${member.user.tag}\` (\`${member.user.id}\`)`)
                                    .setFooter(`Punição: Unmute.`)
                                    .setTimestamp()
                                )
                            }
                        }catch(e) {
                            console.log(e)
                        }
                    }else {
                        Member.muted = [];
                        Member.save();
                    }
                }
            }
        }, 1000)
    }
}