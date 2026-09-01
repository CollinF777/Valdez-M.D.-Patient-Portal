const Message = require("../models/messageModel");
const User = require("../models/userModel");

// Create message
module.exports.createMessage = async (req, res) => {
    try {
        const { date, senderId, recipientId, message } = req.body;

        // Make sure proper fields are provided
        if (!date || !senderId || !recipientId) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        else if (!message) {
            return res.status(400).json({ error: "Please enter a message" });
        }

        // Generate new Id
        const last = await Message.findOne().sort({ id: -1 });
        const newId = last ? last.id + 1 : 1;
        
        const newMessage = new Message({
            id: newId,
            date,
            senderId,
            recipientId,
            messageText: message
        });

        await newMessage.save();
        res.status(201).json({ message: "Message created successfully", messageText: newMessage });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to create message" });
    }
}

// Get messages
module.exports.getMessages = async (req, res) => {
    try {
        const userId = parseInt(req.params.user);
        const role = req.user.role;
        if (role !== "patient" && role !== "doctor" && role !== "admin") {
            return res.status(403).json({ error: "Unauthorized role, I must be bad at coding" });
        }
        let messages = await Message.find({ recipientId: userId});

        // Get more details for the users messages
        const betterMsg = await Promise.all(
            messages.map(async (msg) => {
                const sender = await User.findOne({ id: msg.senderId});

                return {
                    ...msg.toObject(),
                    senderName: sender ? `${sender.firstName} ${sender.lastName}` : "Unknown sender"
                };
            })
        );

        return res.status(200).json(betterMsg);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to retrieve messages" });
    }
};

// Delete message
// For simplicity, senders wont see sent messages as such when a recipient deletes them theyre gone
module.exports.deleteMessage = async (req, res) => {
    try {
        const deleted = await Message.findOneAndDelete({ id: req.params.id });

        if (!deleted) {
            return res.status(404).json({ error: "Message not found" });
        }
        res.status(200).json({ message: "Message deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to delete message" });
    }
};
