const { errorEmbed, correctEmbed } = require("../../implementions/EmbedConstructor");
const GuildUtils = require("../../utils/GuildUtils");
const { MessageEmbed } = require("discord.js");
const ConfigUtils = require("../../utils/ConfigUtils");

module.exports = {
    config: {
        name: "configuração",
        aliases: ["configuraçao", "configuracão", "configuracao", "config"],
        description: "Comando para me configurar no seu servidor.",
        usage: "<p><l>",
        category: "administrations"
    },
    
    async run(bot, message, args) {
        if(!message.member.hasPermission("ADMINISTRATOR")) {
            message.channel.send(
                errorEmbed(`${message.member}, você não tem permissão para executar este comando.`,
                `Permissão: Administrador.`
            )
            ).then(m => m.delete({timeout: 5000}));
                
            return message.delete().catch(() => {return});
        }

        const Guild = await GuildUtils.getOrCreate(message.guild);

        if(!args[0]) {
            const emojis = ["🔑", "🎮", "📡", "📝", "🔙"];

            const configMessage = await message.channel.send(
                new MessageEmbed()
                .setColor(message.guild.me.displayHexColor)
                .setAuthor(`Menu de configuração.`, bot.user.displayAvatarURL({format: "png", dynamic: true}))
                .setDescription(
                    `**Reaja com ${emojis[0]} para a aba de \`Prefixo\`**;\n╰ Altere o prefixo do bot em seu servidor.\n\n` +
                    `**Reaja com ${emojis[1]} para a aba de \`Sistemas\`**;\n╰ Ative e desative sistemas.\n\n` +
                    `**Reaja com ${emojis[2]} para a aba de \`Canais\`**;\n╰ Configure canais com suas funções.\n\n` +
                    `**Reaja com ${emojis[3]} para a aba de \`Mensagens\`**;\n╰ Edite estilo de mensagens.`
                )
            );

            for(let i = 0; i < 4; i++) {
                await configMessage.react(emojis[i]);
            }

            const collector = configMessage.createReactionCollector((r, u) => r.me && u.id == message.author.id);
            collector.on("collect", async reaction => {
                switch(reaction.emoji.name) {
                    case emojis[0]:
                        configMessage.edit(
                            new MessageEmbed()
                            .setColor(message.guild.me.displayHexColor)
                            .setAuthor(`Menu de configuração de prefixo.`, bot.user.displayAvatarURL({format: "png", dynamic: true}))
                            .setDescription(
                                `**Prefixo modificado**: ${Guild.prefix ? bot.config.emojis.correct : bot.config.emojis.error}\n` +
                                `**Prefixo**: \`${Guild.prefix ? Guild.prefix : bot.config.prefix}\`\n\n` +
                                `> **Como usar**:\n${bot.prefix}${bot.command} prefix <newPrefix>`
                            )
                        );

                        await configMessage.reactions.removeAll().catch(() => {return});
                        await configMessage.react(emojis[4])
                    break;

                    case emojis[1]:
                        const roles = await ConfigUtils.systems.autorole.fetch(message.guild);

                        configMessage.edit(
                            new MessageEmbed()
                            .setColor(message.guild.me.displayHexColor)
                            .setAuthor(`Menu de configuração de sistemas.`, bot.user.displayAvatarURL({format: "png", dynamic: true}))
                            .setDescription(
                                `\`\`\`diff\n- Economia\`\`\`\n**Sistema**: ${Guild.systems.economy ? bot.config.emojis.correct : bot.config.emojis.error}\n\n> **Como usar**:\n${bot.prefix}${bot.command} system economy\n\n` +
                                `\`\`\`diff\n- Level\`\`\`\n**Sistema**: ${Guild.systems.level ? bot.config.emojis.correct : bot.config.emojis.error}\n\n> **Como usar**:\n${bot.prefix}${bot.command} system level\n\n` +
                                `\`\`\`diff\n- Autorole\`\`\`\n**Sistema**: ${roles.size > 0 ? `${bot.config.emojis.correct}\n**Cargos**: ${roles.map(role => role).join(", ")}` : bot.config.emojis.error}\n\n> **Como usar**:\n${bot.prefix}${bot.command} system autorole set <role>;\n${bot.prefix}${bot.command} system autorole add <role>;\n${bot.prefix}${bot.command} system autorole remove <role>;\n${bot.prefix}${bot.command} system autorole removeAll`
                            )
                        );

                        await configMessage.reactions.removeAll().catch(() => {return});
                        await configMessage.react(emojis[4])
                    break;

                    case emojis[2]:
                        const welcomeChannel = await ConfigUtils.settings.welcome.channel.fetch(message.guild);
                        const exitChannel = await ConfigUtils.settings.exit.channel.fetch(message.guild);
                        const logChannel = await ConfigUtils.settings.log.channel.fetch(message.guild);

                        configMessage.edit(
                            new MessageEmbed()
                            .setColor(message.guild.me.displayHexColor)
                            .setAuthor(`Menu de configuração de canais.`, bot.user.displayAvatarURL({format: "png", dynamic: true}))
                            .setDescription(
                                `\`\`\`diff\n- Boas-vinda\`\`\`\n**Sistema**: ${welcomeChannel ? `${bot.config.emojis.correct}\n**Canal**: ${welcomeChannel}` : bot.config.emojis.error}\n\n> **Como usar**:\n${bot.prefix}${bot.command} channel welcome set <channel>\n\n` +
                                `\`\`\`diff\n- Saída\`\`\`\n**Sistema**: ${exitChannel ? `${bot.config.emojis.correct}\n**Canal**: ${exitChannel}` : bot.config.emojis.error}\n\n> **Como usar**:\n${bot.prefix}${bot.command} channel exit set <channel>\n\n` +
                                `\`\`\`diff\n- Logs\`\`\`\n**Sistema**: ${logChannel ? `${bot.config.emojis.correct}\n**Canal**: ${logChannel}` : bot.config.emojis.error}\n\n> **Como usar**:\n${bot.prefix}${bot.command} channel log set <channel>`
                            )
                        );

                        await configMessage.reactions.removeAll().catch(() => {return});
                        await configMessage.react(emojis[4])
                    break;

                    case emojis[3]:
                        const welcomeMessage = await ConfigUtils.settings.welcome.message.getReduced(message.guild, 100);
                        const exitMessage = await ConfigUtils.settings.exit.message.getReduced(message.guild, 100);

                        const welcomeStyle = await Guild.settings.welcome.message.style
                        const exitStyle = await Guild.settings.exit.message.style

                        configMessage.edit(
                            new MessageEmbed()
                            .setColor(message.guild.me.displayHexColor)
                            .setAuthor(`Menu de configuração de mensagem.`, bot.user.displayAvatarURL({format: "png", dynamic: true}))
                            .setDescription(
                                `\`\`\`diff\n- Boas-vinda\`\`\`\n**Sistema**: ${welcomeMessage ? `${bot.config.emojis.correct}\n**Mensagem**: ${welcomeMessage}\n**Estilo**: ${welcomeStyle}` : bot.config.emojis.error}\n\n> **Como usar**:\n${bot.prefix}${bot.command} message welcome\n\n` +
                                `\`\`\`diff\n- Saída\`\`\`\n**Sistema**: ${exitMessage ? `${bot.config.emojis.correct}\n**Mensagem**: ${exitMessage}\n**Estilo**: ${exitStyle}` : bot.config.emojis.error}\n\n> **Como usar**:\n${bot.prefix}${bot.command} message welcome`
                            )
                        );

                        await configMessage.reactions.removeAll().catch(() => {return});
                        await configMessage.react(emojis[4])
                    break;

                    case emojis[4]:
                        configMessage.edit(
                            new MessageEmbed()
                            .setColor(message.guild.me.displayHexColor)
                            .setAuthor(`Menu de configuração.`, bot.user.displayAvatarURL({format: "png", dynamic: true}))
                            .setDescription(
                                `**Reaja com ${emojis[0]} para a aba de \`Prefixo\`**;\n╰ Altere o prefixo do bot em seu servidor.\n\n` +
                                `**Reaja com ${emojis[1]} para a aba de \`Sistemas\`**;\n╰ Ative e desative sistemas.\n\n` +
                                `**Reaja com ${emojis[2]} para a aba de \`Canais\`**;\n╰ Configure canais com suas funções.\n\n` +
                                `**Reaja com ${emojis[3]} para a aba de \`Mensagens\`**;\n╰ Edite estilo de mensagens.`
                            )
                        );

                        await configMessage.reactions.removeAll().catch(() => {return});
                        for(let i = 0; i < 4; i++) {
                            await configMessage.react(emojis[i]);
                        }
                    break;
                }
            });
        }else {
            if(["prefix", "system", "channnel", "message"].includes(args[0].toLowerCase())) {
                if(args[0].toLowerCase() == "prefix") {
                    const prefix = Guild.prefix ? Guild.prefix : bot.config.prefix;

                    if(!args[1]){
                        message.channel.send(
                            errorEmbed(`${message.member}, você não inseriu o prefixo.`)
                        ).then(m => m.delete({timeout: 5000}));
            
                        return message.delete().catch(() => {return});
                    }

                    const newPrefix = args[1];
                    if(newPrefix.length > 3) {
                        message.channel.send(
                            errorEmbed(`${message.member}, o prefix inserido tem mais que 3 caractéres.`)
                        ).then(m => m.delete({timeout: 5000}));

                        return message.delete().catch(() => {return});
                    }

                    if(newPrefix == prefix) {
                        message.channel.send(
                            errorEmbed(`${message.member}, o prefix inserido é idêntico ao já setado.`)
                        ).then(m => m.delete({timeout: 5000}));

                        return message.delete().catch(() => {return});
                    }

                    (newPrefix == bot.config.prefix ? Guild.prefix = null : Guild.prefix = newPrefix);
                    await Guild.save();

                    message.channel.send(
                        correctEmbed(
                            `Prefixo setado com sucesso.\n\n**Novo prefixo**: \`${Guild.prefix}\``, 
                            `Autor: ${message.author.tag}`,
                            message.author.displayAvatarURL({format: "png", dynamic: true})
                        )
                    )

                    message.delete().catch(() => {return});

                }else if(args[0].toLowerCase() == "system") {
                    if(!args[1]) {
                        message.channel.send(
                            errorEmbed(
                                `${message.member}, você não inseriu nenhuma opção de sistema.`,
                                `Opções: economy, level e autorole.`
                            )
                        ).then(m => m.delete({timeout: 5000}));
            
                        return message.delete().catch(() => {return});
                    }

                    if(["economy", "level", "autorole"].includes(args[1].toLowerCase())) {
                        if(args[1].toLowerCase() == "economy") {
                            if(!Guild.systems.economy) {
                                Guild.systems.economy = true;
                                await Guild.save();

                                message.channel.send(
                                    correctEmbed(
                                        `Sistema ativo com sucesso.\n\n**Sistema**: \`Economia\``, 
                                        `Autor: ${message.author.tag}`,
                                        message.author.displayAvatarURL({format: "png", dynamic: true})
                                    )
                                )
            
                                message.delete().catch(() => {return});
                            }else {
                                Guild.systems.economy = false;
                                await Guild.save();

                                message.channel.send(
                                    errorEmbed(
                                        `Sistema desativo com sucesso.\n\n**Sistema**: \`Economia\``, 
                                        `Autor: ${message.author.tag}`,
                                        message.author.displayAvatarURL({format: "png", dynamic: true})
                                    )
                                )
            
                                message.delete().catch(() => {return});
                            }
                        }else if(args[1].toLowerCase() == "level") {
                            if(!Guild.systems.level) {
                                Guild.systems.level = true;
                                await Guild.save();

                                message.channel.send(
                                    correctEmbed(
                                        `Sistema ativo com sucesso.\n\n**Sistema**: \`Level\``, 
                                        `Autor: ${message.author.tag}`,
                                        message.author.displayAvatarURL({format: "png", dynamic: true})
                                    )
                                )
            
                                message.delete().catch(() => {return});
                            }else {
                                Guild.systems.level = false;
                                await Guild.save();

                                message.channel.send(
                                    errorEmbed(
                                        `Sistema desativo com sucesso.\n\n**Sistema**: \`Level\``, 
                                        `Autor: ${message.author.tag}`,
                                        message.author.displayAvatarURL({format: "png", dynamic: true})
                                    )
                                )
            
                                message.delete().catch(() => {return});
                            }
                        }else if(args[1].toLowerCase() == "autorole") {
                            if(!args[2]) {
                                message.channel.send(
                                    errorEmbed(
                                        `${message.member}, você não inseriu nenhuma opção de configuração do sistema.`,
                                        `Opções: set, add, remove e removeAll.`
                                    )
                                ).then(m => m.delete({timeout: 5000}));
                    
                                return message.delete().catch(() => {return});
                            }

                            if(["set", "add", "remove", "removeall"].includes(args[2].toLowerCase())) {
                                if(args[2].toLowerCase() == "set") {
                                    if(!args[3]) {
                                        message.channel.send(
                                            errorEmbed(`${message.member}, você não inseriu nenhum cargo.`)
                                        ).then(m => m.delete({timeout: 5000}));
                            
                                        return message.delete().catch(() => {return});
                                    }

                                    const role = message.guild.roles.cache.get(args[3].replace("<@&", "").replace(">", ""));
                                    if(!role) {
                                        message.channel.send(
                                            errorEmbed(`${message.member}, este cargo não existe.`)
                                        ).then(m => m.delete({timeout: 5000}));
                            
                                        return message.delete().catch(() => {return});
                                    }

                                    Guild.systems.autorole = [role.id];
                                    await Guild.save();

                                    message.channel.send(
                                        correctEmbed(
                                            `Cargo setado com sucesso.\n\n**Sistema**: \`Autorole\`\n**Cargo**: ${role} \`[${Guild.systems.autorole.length}]\``, 
                                            `Autor: ${message.author.tag}`,
                                            message.author.displayAvatarURL({format: "png", dynamic: true})
                                        )
                                    )
                
                                    message.delete().catch(() => {return});
                                }else if(args[2].toLowerCase() == "add") {
                                    if(!args[3]) {
                                        message.channel.send(
                                            errorEmbed(`${message.member}, você não inseriu nenhum cargo.`)
                                        ).then(m => m.delete({timeout: 5000}));
                            
                                        return message.delete().catch(() => {return});
                                    }

                                    const role = message.guild.roles.cache.get(args[3].replace("<@&", "").replace(">", ""));
                                    if(!role) {
                                        message.channel.send(
                                            errorEmbed(`${message.member}, este cargo não existe.`)
                                        ).then(m => m.delete({timeout: 5000}));
                            
                                        return message.delete().catch(() => {return});
                                    }

                                    if(Guild.systems.autorole) {
                                        if(Guild.systems.autorole.indexOf(role.id) !== -1) {
                                            message.channel.send(
                                                errorEmbed(`${message.member}, este cargo já está no sistema.`)
                                            ).then(m => m.delete({timeout: 5000}));
                                
                                            return message.delete().catch(() => {return});
                                        }
                                    }

                                    (Guild.systems.autorole ? Guild.systems.autorole.push(role.id) : Guild.systems.autorole = [role.id]);
                                    await Guild.save();

                                    const roles = await ConfigUtils.systems.autorole.fetch(message.guild);

                                    message.channel.send(
                                        correctEmbed(
                                            `Cargo adicionado com sucesso.\n\n**Sistema**: \`Autorole\`\n**Cargo**: ${roles.map(role => role).join(", ")} \`[${Guild.systems.autorole.length}]\``, 
                                            `Autor: ${message.author.tag}`,
                                            message.author.displayAvatarURL({format: "png", dynamic: true})
                                        )
                                    )
                
                                    message.delete().catch(() => {return});
                                }else if(args[2].toLowerCase() == "remove") {
                                    if(!args[3]) {
                                        message.channel.send(
                                            errorEmbed(`${message.member}, você não inseriu nenhum cargo.`)
                                        ).then(m => m.delete({timeout: 5000}));
                            
                                        return message.delete().catch(() => {return});
                                    }

                                    const role = message.guild.roles.cache.get(args[3].replace("<@&", "").replace(">", ""));
                                    if(!role) {
                                        message.channel.send(
                                            errorEmbed(`${message.member}, este cargo não existe.`)
                                        ).then(m => m.delete({timeout: 5000}));
                            
                                        return message.delete().catch(() => {return});
                                    }

                                    if(Guild.systems.autorole > 0) {
                                        if(Guild.systems.autorole.indexOf(role.id) == -1) {
                                            message.channel.send(
                                                errorEmbed(`${message.member}, este cargo não está no sistema.`)
                                            ).then(m => m.delete({timeout: 5000}));
                                
                                            return message.delete().catch(() => {return});
                                        }
                                    }else {
                                        message.channel.send(
                                            errorEmbed(`${message.member}, não há cargos no sistema.`)
                                        ).then(m => m.delete({timeout: 5000}));
                            
                                        return message.delete().catch(() => {return});
                                    }

                                    const rolePosition = Guild.systems.autorole.indexOf(role.id);
                                    Guild.systems.autorole.splice(rolePosition, 1);
                                    await Guild.save();
                                    const roles = await ConfigUtils.systems.autorole.fetch(message.guild);

                                    message.channel.send(
                                        correctEmbed(
                                            `Cargo removido com sucesso.\n\n**Sistema**: \`Autorole\`\n**Cargo**: ${roles.size > 0 ? roles.map(role => role).join(", ") : ""} \`[${Guild.systems.autorole.length}]\``, 
                                            `Autor: ${message.author.tag}`,
                                            message.author.displayAvatarURL({format: "png", dynamic: true})
                                        )
                                    )
                
                                    message.delete().catch(() => {return});
                                }else if(args[2].toLowerCase() == "removeall") {

                                    if(!Guild.systems.autorole <= 0) {
                                        message.channel.send(
                                            errorEmbed(`${message.member}, não há cargos no sistema.`)
                                        ).then(m => m.delete({timeout: 5000}));
                            
                                        return message.delete().catch(() => {return});
                                    }
                                    
                                    Guild.systems.autorole = [];
                                    await Guild.save();
                                    const roles = await ConfigUtils.systems.autorole.fetch(message.guild);

                                    message.channel.send(
                                        correctEmbed(
                                            `Cargo removido com sucesso.\n\n**Sistema**: \`Autorole\`\n**Cargo**: ${roles.size > 0 ? roles.map(role => role).join(", ") : ""} \`[${Guild.systems.autorole.length}]\``, 
                                            `Autor: ${message.author.tag}`,
                                            message.author.displayAvatarURL({format: "png", dynamic: true})
                                        )
                                    )
                
                                    message.delete().catch(() => {return});
                                }
                            }else {
                                message.channel.send(
                                    errorEmbed(
                                        `${message.member}, você inseriu uma opção de configuração do sistema válida.`,
                                        `Opções: set, add, remove e removeAll.`
                                    )
                                ).then(m => m.delete({timeout: 5000}));
                    
                                return message.delete().catch(() => {return});
                            }
                        }
                    }else {
                        message.channel.send(
                            errorEmbed(
                                `${message.member}, você inseriu um sistema inválido.`,
                                `Opções: economy, level e autorole.`
                            )
                        ).then(m => m.delete({timeout: 5000}));
            
                        return message.delete().catch(() => {return});
                    }
                }else if(args[0].toLowerCase() == "channel") {
                    if(!args[1]) {
                        message.channel.send(
                            errorEmbed(
                                `${message.member}, você não inseriu nenhum canal.`,
                                `Opções: welcome, exit e log.`
                            )
                        ).then(m => m.delete({timeout: 5000}));
            
                        return message.delete().catch(() => {return});
                    }

                    if(["welcome", "exit", "log"].includes(args[2].toLowerCase())) {
                        
                    }else {
                        message.channel.send(
                            errorEmbed(`${message.member}, você inseriu um canal inválido.`,
                            `Opções: welcome, exit e log.`
                        )
                        ).then(m => m.delete({timeout: 5000}));
            
                        return message.delete().catch(() => {return});
                    }
                }
            }else {
                message.channel.send(
                    errorEmbed(`${message.member}, você inseriu uma opção de configuração inválida.`,
                    `Opções: prefix, system, channel e message.`
                )
                ).then(m => m.delete({timeout: 5000}));
    
                return message.delete().catch(() => {return});
            }
        }
    }
}