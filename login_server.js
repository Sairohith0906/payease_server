const express = require('express');
const mongoose = require('mongoose');

const router = express.Router();

// Schema & Model
const userSchema = new mongoose.Schema({
  name: String,
  number: String
});
const User = mongoose.models.users || mongoose.model('users', userSchema);

// Login Route
router.get('/', async (req, res) => {
  try {
    const { phone } = req.query;
    if (!phone) {
      return res.status(400).send('Missing phone');
    }

    const user = await User.findOne({ number: phone });

    if (!user) {
      return res.status(404).send('Phone number does not exist');
    }

    res.send('Login Success');
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
