module.exports = {
    async listener(bot, ready) {
        console.log(`Online em ${bot.guilds.cache.size} servidores! ${bot.user.id}`);
    }
}