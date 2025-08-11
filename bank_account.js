const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const crypto = require('crypto-js');

require('dotenv').config();

const app = express();
app.use(cors());

const key=process.env.KEY_FOR_ENCRYPTION_DECRYPTION;

// ✅ MongoDB Connection
mongoose.connect('mongodb://localhost:27017/payease', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch(err => console.error(err));

// ✅ Schema
const userAccountSchema = new mongoose.Schema({
  user_id: String,
  bank_name: String,
  account_number: String, // This will store hashed account number
  ifsc_code: String,      // This will store hashed IFSC code
  last_four_digits: String
}, { versionKey: false });

const AccountModel = mongoose.model('bankAccount', userAccountSchema);

// ✅ Route
app.get('/transaction', async (req, res) => {
  try {
    const { user_id, bank_name, account_number, ifsc_code } = req.query;

    if (!user_id || !bank_name || !account_number || !ifsc_code) {
      return res.status(400).send("❌ Missing required fields");
    }

    // ✅ Extract last four digits safely
    const last_four_digits = account_number.slice(-4);

    const hashed_account_number = await crypto.AES.encrypt(account_number,key).toString();
    const hashed_ifsc_code =await crypto.AES.encrypt(ifsc_code,key).toString();

    // ✅ Save to DB
    const newAccount = new AccountModel({
      user_id,
      bank_name,
      account_number: hashed_account_number,
      ifsc_code: hashed_ifsc_code,
      last_four_digits
    });

    await newAccount.save();
    res.send("✅ Transaction created successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Transaction creation failed");
  }
});

app.listen(9000, () => {
  console.log("🚀 Listening on port 9000");
});
