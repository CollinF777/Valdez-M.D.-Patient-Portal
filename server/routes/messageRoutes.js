const express = require("express");
const { createMessage, getMessages, deleteMessage } = require("../controllers/messageController");
const tokenValidator = require("../middleware/tokenValidator");

const router = express.Router();

// Create message
router.post("/", tokenValidator, createMessage);
// Get messages
router.get("/:user", tokenValidator, getMessages);
// Delete message
router.delete("/:id", tokenValidator, deleteMessage);

module.exports = router;