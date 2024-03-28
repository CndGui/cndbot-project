const { Schema, model } = require("mongoose");

const Guild = Schema({
    id: String,
    prefix: { type: String, default: null },
    systems: {
        economy: { type: Boolean, default: false },
        level: { type: Boolean, default: false },
        autorole: { type: Array, default: [] }
    },
    settings: {
        welcome: {
            channel: { type: String, default: null },
            message: {
                content: { type: String, default: null },
                style: { type: String, default: null }
            }
        },
        exit: {
            channel: { type: String, default: null },
            message: {
                content: { type: String, default: null },
                style: { type: String, default: null }
            }
        },
        log: {
            channel: { type: String, default: null }
        }
    }
});

module.exports = model("Guild", Guild);