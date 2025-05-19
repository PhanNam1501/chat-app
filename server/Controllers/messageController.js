const crypto = require('crypto');
const messageModel = require("../Models/messageModel");
require('dotenv').config(); // Nạp biến môi trường từ file .env

// Lấy SECRET_KEY từ môi trường
const SECRET_KEY = process.env.SECRET_KEY;

// Hàm mã hóa tin nhắn
const encryptMessage = (text) => {
    console.log("text: ", text);
    const cipher = crypto.createCipher('aes-256-cbc', SECRET_KEY);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
};

// Hàm giải mã tin nhắn
const decryptMessage = (encryptedText) => {
    const decipher = crypto.createDecipher('aes-256-cbc', SECRET_KEY);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
};

// createMessage
const createMessage = async (req, res) => {
    const { chatId, senderId, text } = req.body;
    console.log(chatId, senderId, text);


    if (!chatId || !senderId || !text) {
        return res.status(400).json({ message: "Missing required fields." });
    }

    const encryptedText = encryptMessage(text);
    console.log(encryptedText);
    const message = new messageModel({
        chatId, senderId, text: encryptedText
    });

    await message.save();

    try {
        const response = {
            chatId: message.chatId,
            senderId: message.senderId,
            text: text
        }
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error saving message", error });
    }
};

// getMessage
const getMessage = async (req, res) => {
    const { chatId } = req.params;

    if (!chatId) {
        return res.status(400).json({ message: "chatId is required" });
    }
    console.log("chatId: ", chatId);

    try {
        const messages = await messageModel.find({ chatId });
        console.log("messages: ", messages);
        
        
        const decryptedMessages = messages.map(message => ({
            ...message.toObject(),
            text: decryptMessage(message.text) // Giải mã tin nhắn
        }));

        console.log("dec: ",decryptedMessages);

        res.status(200).json(decryptedMessages);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error fetching messages", error });
    }
};

module.exports = { 
    createMessage,
    getMessage
};
