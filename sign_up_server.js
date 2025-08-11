const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// Schema & Model
const userSchema = new mongoose.Schema({
  name: String,
  number: String
});
const User = mongoose.model('users', userSchema);

// Sign Up Route
router.post('/', async (req, res) => {
  try {
    const { phone, name } = req.query;

    if (!phone || !name) {
      return res.status(400).send('Missing phone or name');
    }

    const existingUser = await User.findOne({ number: phone });

    if (existingUser) {
      return res.status(409).send('Phone number already registered');
    }

    const newUser = new User({
      name: name,
      number: phone
    });

    await newUser.save();
    res.send('SignUp Success');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
