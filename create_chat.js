const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());
app.use(express.json());

const baseUri = 'mongodb://localhost:27017/payease';

// ✅ Connect to MongoDB ONCE
mongoose.connect(baseUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// ✅ Schema: users -> chats -> number
const chatSchema = new mongoose.Schema({
  number: String,   // chat with this number
  messages: [{message:String,send:String}] // store messages or objects
});

const userSchema = new mongoose.Schema({
  name: String,
  number: String,
  chats: [chatSchema] // array of chats
});

const User = mongoose.model('users', userSchema);

// ✅ Add a chat route
app.get('/chats_creation', async (req, res) => {
  try {
    // ✅ Read from query parameters, not body
    const { fromNumber, toNumber } = req.query;

    if (!fromNumber || !toNumber) {
      return res.status(400).send('Missing phone numbers');
    }

    let user = await User.findOne({ number: fromNumber });

    if (!user) {
      // create the user if not found
     return res.status(500).send('user not find');
    }

    // check if chat already exists
    const chatExists = user.chats.some(c => c.number === toNumber);
    if (chatExists) {
      return res.status(400).send('Chat already exists');
    }

    // add new chat
    user.chats.push({ number: toNumber, messages: [] });
    await user.save();

    res.send('Chat created successfully');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});


app.listen(9000, () => {
  console.log('🚀 Server started on port 9000');
});
