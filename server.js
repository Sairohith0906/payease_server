require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const mongoose=require('mongoose');


mongoose.connect('mongodb://localhost:27017/', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('✅ MongoDB connection successful');
})
.catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
});


const user=mongoose.Schema({
  Name:{
    type:String,
    required:true,
  }
});

const app = express();
app.use(cors());
app.use(bodyParser.json());

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const PORT = process.env.PORT || 3000;

function generateOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

app.get('/', (req, res) => {
  res.send('✅ Server running');
});

app.post('/send-otp', async (req, res) => {
  const { phone, name } = req.body;

  if (!phone || !phone.startsWith('+')) {
    return res
      .status(400)
      .json({ error: 'Phone number must be in international format' });
  }

  const otp = generateOtp();

  try {
    await client.messages.create({
      body: `Hello ${name || ''}, your OTP for Pay-Ease login is ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone,
    });

    console.log(`✅ OTP sent to ${phone}: ${otp}`);
    res.status(200).json({ otp }); // 🔴 For testing only
  } catch (err) {
    console.error('❌ Twilio error:', err.message);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});



