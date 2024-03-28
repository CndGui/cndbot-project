const fs = require("fs");
const GuildUtils = require("../utils/GuildUtils");
const file = {
    commands: [],
    directory: new Map()
};

module.exports = {
    loadCommand() {
        fs.readdirSync("./commands").forEach($ => {
            fs.readdirSync(`./commands/${$}`).forEach($$ => {
                const command = require(`../commands/${$}/${$$}`);

                file.commands.push(command);
                file.directory.set(command.config.name, `commands/${$}/${$$}`);

                console.log(`LOAD COMMAND: ${$}/${$$}`);
            });
        });
    },

    reloadCommand(commandName) {
        for(let i = 0; i < file.commands.length; i++) {
            const command = file.commands[i];
            
            if(command.config.name == commandName || command.config.aliases.includes(commandName)) {
                const directory = file.directory.get(command.config.name);

                delete require.cache[require.resolve(`../${directory}`)];
                const newCommand = require(`../${directory}`);
                file.commands[file.commands.indexOf(command)] = newCommand;
    
                console.log(`RELOAD COMMAND: ${directory.replace("commands/", "")}`);

                return command.config.name
            };
        };
    },

    getCommands() {
        return file.commands;
    },

    getCommand(commandName) {
        for(let i = 0; i < file.commands.length; i++) {
            const command = file.commands[i];
            
            if(command.config.name == commandName || command.config.aliases.includes(commandName)) {
                return command;
            };
        };
    },

    getCommandDirectory(commandName) {
        for(let i = 0; i < file.commands.length; i++) {
            const command = file.commands[i];
            
            if(command.config.name == commandName || command.config.aliases.includes(commandName)) {
                return file.directory.get(commandName);
            };
        };
    },

    async executeCommand(bot, message) {
        if(message.author.bot) return;
        if(message.channel.type !== "text") return;

        const Guild = await GuildUtils.getOrCreate(message.guild);
        bot.prefix = Guild.prefix ? Guild.prefix : bot.config.prefix;

        let commandName = message.content.split(" ")[0].toLowerCase().replace(bot.prefix, "");
        let args = message.content.split(" ").slice(1);

        if([`<@${bot.user.id}>`, `<@!${bot.user.id}>`, "cndbot"].includes(message.content.split(" ")[0].toLowerCase())) {
            commandName = message.content.split(" ")[1].toLowerCase();
            args = message.content.split(" ").slice(2);

            bot.prefix = message.content.split(" ")[0].toLowerCase() + " ";
        }

        if(!message.content.toLowerCase().startsWith(bot.prefix)) return;

        for(let i = 0; i < file.commands.length; i++) {
            const command = file.commands[i];
            
            if(command.config.name == commandName || command.config.aliases.includes(commandName)) {
                bot.command = commandName;

                command.run(bot, message, args);
            };
        };
    }
};