const { bot } = require("..");
const User = require("../models/User");

module.exports = {
    getUser(tag) {
        const user = bot().users.cache.get(tag.replace("<@", "").replace("!", "").replace(">", ""));
        
        return user;
    },

    async fetchUser(tag) {
        const user = await bot().users.fetch(tag.replace("<@", "").replace("!", "").replace(">", "")).catch(e => {return});

        return user;
    },

    async getOrCreate(user) {
        let userDB = await User.findOne({id: user.id})
        if(!userDB) {
            const newUser = new User({
                id: user.id
            });
            newUser.save()

            userDB = newUser;
        }

        return userDB;
    }
}