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

// ✅ Login Route
app.get('/login', async (req, res) => {
  try {
    const { phone} = req.query; // read from URL query
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

app.listen(9000, () => {
  console.log('🚀 Server started on port 9000');
});
