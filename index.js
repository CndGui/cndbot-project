const Discord = require("discord.js");
const bot = new Discord.Client({
    disableMentions: "everyone"
});

bot.config = require("./config.json");

module.exports = {
    bot() {
        return bot;
    }
};

const { loadListener } = require("./handlers/ListenerHandler");
const { loadCommand } = require("./handlers/CommandHandler");
const { connectMongoose } = require("./handlers/MongooseConnect");

loadListener(bot)
loadCommand()
connectMongoose()

bot.login(bot.config.token).catch(e => {
    console.log(`LOGIN Error: ${e}`);
});