const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const messageSchema = new Schema ({
    id: Number,
    date: Date,
    senderId: Number,
    recipientId: Number,
    messageText: String
})
module.exports = mongoose.model("Message", messageSchema);