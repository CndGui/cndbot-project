const { connect } = require("mongoose");

module.exports = {
    connectMongoose() {
        connect("mongodb+srv://CndBot:CndBot123@database.1mfnt.mongodb.net/Database?retryWrites=true&w=majority", {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
        .then(() => {
            console.log("INFO MONGODB: Connect.");
        })
        .catch(e => {
            console.log("INFO MONGODB: Error: " + e);
        });
    }
}