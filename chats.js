const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// ✅ MongoDB Connection
mongoose.connect('mongodb://localhost:27017/payease', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB error:", err));

// ✅ User Schema
const userSchema = new mongoose.Schema({
  name: String,
  number: String,
  chats: [
    {
      number: String,
      messages: [
        {
          message: String,
          send: String
        }
      ]
    }
  ]
});

const User = mongoose.model('users', userSchema);

// ✅ Chats API
app.get('/chats', async (req, res) => {
  try {
    const { from_phone, to_phone, message } = req.query;

    if (!from_phone || !to_phone || !message) {
      return res.status(400).send('❌ Credentials insufficient');
    }

    // ✅ Find sender
    let sender = await User.findOne({ number: from_phone });
    if (!sender) {
      return res.status(404).send('❌ Sender not registered');
    }

    // ✅ Sender's chat
    let chat_find_send = sender.chats.find(c => c.number === to_phone);
    if (!chat_find_send) {
      chat_find_send = { number: to_phone, messages: [] };
      sender.chats.push(chat_find_send);
    }
    chat_find_send.messages.push({ message, send: 'true' });
    await sender.save();

    // ✅ Find receiver
    let receiver = await User.findOne({ number: to_phone });
    if (!receiver) {
      return res.status(404).send('❌ Receiver not registered');
    }

    // ✅ Receiver's chat
    let chat_find_receiver = receiver.chats.find(c => c.number === from_phone);
    if (!chat_find_receiver) {
      chat_find_receiver = { number: from_phone, messages: [] };
      receiver.chats.push(chat_find_receiver);
    }
    chat_find_receiver.messages.push({ message, send: 'false' });
    await receiver.save();

    res.status(200).send('✅ Message saved successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('❌ Server error');
  }
});

app.listen(9000, () => {
  console.log('🚀 Server started on port 9000');
});
