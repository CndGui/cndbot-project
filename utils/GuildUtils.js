const Guild = require("../models/Guild");

module.exports = {
    async getOrCreate(guild) {
        let guildDB = await Guild.findOne({id: guild.id})
        if(!guildDB) {
            const newGuild = new Guild({
                id: guild.id
            });
            await newGuild.save()

            guildDB = newGuild;
        }

        return guildDB;
    }
}