const express = require('express');
const mongoose = require('mongoose');
const router=express.Router();

const baseUri = 'mongodb://localhost:27017/payease';


const chatSchema = new mongoose.Schema({
  number: String,   // chat with this number
  messages: [{message:String,send:String}] // store messages or objects
});

const userSchema = new mongoose.Schema({
  name: String,
  number: String,
  chats: [chatSchema] // array of chats
});

const User = mongoose.models.users || mongoose.model('users', userSchema);


// ✅ Add a chat route
router.get('/', async (req, res) => {
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


module.exports=router;
