const { bot } = require("..");
const Member = require("../models/Member");

module.exports = {
    getMember(guild, tag) {
        const member = guild.members.cache.get(tag.replace("<@", "").replace("!", "").replace(">", ""));
        
        return member;
    },

    async getOrCreate(guild, member) {
        let memberDB = await Member.findOne({id: member.user.id})
        if(!memberDB) {
            const newMember = new Member({
                id: member.user.id,
                serverId: guild.id
            });
            newMember.save()

            memberDB = newMember;
        }

        return memberDB;
    }
}