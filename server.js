const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb://localhost:27017/chatapp', { useNewUrlParser: true, useUnifiedTopology: true });

const messageSchema = new mongoose.Schema({
  sender: String,
  message: String,
  timestamp: { type: Date, default: Date.now }
});

const Message = mongoose.model('Message', messageSchema);

// Helper to simulate bot response
function getBotResponse(message) {
  const responses = {
    "hello": "Hello! How can I assist you with your booking?",
    "book a room": "Sure! What dates are you looking for?",
    "cancel my booking": "Please provide your booking reference number."
  };
  return responses[message.toLowerCase()] || null;
}

// POST message endpoint
app.post('/api/chat', async (req, res) => {
  const { message, sender } = req.body;

  if (!message || !sender) {
    return res.status(400).json({ error: "Invalid input." });
  }

  const botReply = getBotResponse(message);
  const newMessages = [];

  if (botReply) {
    await Message.create({ sender: 'bot', message: botReply });
    newMessages.push({ sender: 'bot', message: botReply });
  } else {
    await Message.create({ sender, message });
    newMessages.push({ sender, message });
  }

  const messages = await Message.find().sort({ timestamp: -1 }).limit(20);
  res.json({ messages: messages.reverse() });
});

// GET messages
app.get('/api/chat', async (req, res) => {
  const messages = await Message.find().sort({ timestamp: -1 }).limit(20);
  res.json({ messages: messages.reverse() });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
