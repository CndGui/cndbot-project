const GuildUtils = require("./GuildUtils");
const { Collection } = require("discord.js");

module.exports = {
    systems: {
        autorole: {
            async fetch(guild) {
                const Guild = await GuildUtils.getOrCreate(guild);
                if(Guild.systems.autorole.length > 0) {
                    const roles = new Collection();
                    for(let i = 0; i < Guild.systems.autorole.length; i++) {
                        const role = guild.roles.cache.get(Guild.systems.autorole[i]);
                        if(role) {
                            roles.set(role.id, role);
                        }
                        if(!role) {
                            Guild.systems.autorole.splice(i, 1); 
                            i = -1;
                        }
                    }
                    Guild.save();

                    return roles;
                }else {
                    return 0;
                }
            }
        }
    },

    settings: {
        welcome: {
            channel: {
                async fetch(guild) {
                    const Guild = await GuildUtils.getOrCreate(guild);
                    if(Guild.settings.welcome.channel) {
                        const channel = guild.channels.cache.get(Guild.settings.welcome.channel);
                        if(channel) {
                            return channel;
                        }else {
                            Guild.settings.welcome.channel = null;
                            Guild.save();

                            return null;
                        }
                    }else {
                        return null;
                    }
                }
            },

            message: {
                async getReduced(guild, size) {
                    const Guild = await GuildUtils.getOrCreate(guild);
                    const message = Guild.settings.welcome.message.content;
                    if(message) {
                        if(message.length > size) {
                            const reducedMessage = message.split("").reverse().join("").slice(1).split("").reverse().join("");

                            return `${reducedMessage} + ${message.length - 100}`;
                        }else {
                            return message;
                        }
                    }else {
                        return null;
                    }
                }
            }
        },

        exit: {
            channel: {
                async fetch(guild) {
                    const Guild = await GuildUtils.getOrCreate(guild);
                    if(Guild.settings.exit.channel) {
                        const channel = guild.channels.cache.get(Guild.settings.exit.channel);
                        if(channel) {
                            return channel;
                        }else {
                            Guild.settings.exit.channel = null;
                            Guild.save();

                            return null;
                        }
                    }else {
                        return null;
                    }
                }
            },

            message: {
                async getReduced(guild, size) {
                    const Guild = await GuildUtils.getOrCreate(guild);
                    const message = Guild.settings.exit.message.content;
                    if(message) {
                        if(message.length > size) {
                            const reducedMessage = message.split("").reverse().join("").slice(1).split("").reverse().join("");

                            return `${reducedMessage} + ${message.length - 100}`;
                        }else {
                            return message;
                        }
                    }else {
                        return null;
                    }
                }
            }
        },

        log: {
            channel: {
                async fetch(guild) {
                    const Guild = await GuildUtils.getOrCreate(guild);
                    if(Guild.settings.log.channel) {
                        const channel = guild.channels.cache.get(Guild.settings.log.channel);
                        if(channel) {
                            return channel;
                        }else {
                            Guild.settings.log.channel = null;
                            Guild.save();

                            return null;
                        }
                    }else {
                        return null;
                    }
                }
            }
        }
    }
}