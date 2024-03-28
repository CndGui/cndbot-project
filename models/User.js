const { Schema, model } = require("mongoose");

const User = Schema({
    id: String,
    blacklist: { type: Boolean, default: false }
});

module.exports = model("User", User);