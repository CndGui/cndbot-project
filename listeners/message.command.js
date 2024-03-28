const { executeCommand } = require("../handlers/CommandHandler")

module.exports = {
    async listener(bot, message) {
        executeCommand(bot, message)
    }
}