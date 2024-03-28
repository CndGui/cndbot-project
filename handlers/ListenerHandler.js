const fs = require("fs");

module.exports = {
    loadListener(bot) {
        fs.readdirSync("./listeners").forEach($ => {
            const { listener } = require(`../listeners/${$}`);
            const listenerName = $.split(".")[0];

            bot.on(listenerName, listener.bind(null, bot));

            console.log(`LOAD LISTENER: ${$}`);
        });
    }
}