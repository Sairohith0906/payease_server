const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
app.use(cors());

const baseUri = 'mongodb://localhost:27017/payease';

// ✅ Connect to MongoDB once at startup
mongoose.connect(baseUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Error:', err));

const userSchema = new mongoose.Schema({
  name: String,
  number: String
});

const User = mongoose.model('users', userSchema);

// ✅ SignUp Route
app.get('/signUp', async (req, res) => {
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

app.listen(9000, () => {
  console.log('🚀 Server started on port 9000');
});
