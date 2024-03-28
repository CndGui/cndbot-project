const { Schema, model } = require("mongoose");

const Member = Schema({
    id: String,
    serverId: String,
    systems: {
        money: { type: String, default: null },
        level: { type: String, default: null },
        xp: { type: String, default: null }
    },
    muted: { type: Array, default: null }
});

module.exports = model("Member", Member);