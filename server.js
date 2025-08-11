require('dotenv').config();
const express = require('express');
const twilio = require('twilio');
const router=express.Router();



const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

function generateOtp() {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

router.post('/send-otp', async (req, res) => {
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




module.exports=router;