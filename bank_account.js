const mongoose = require('mongoose');
const express = require('express');
const crypto = require('crypto-js');
const router = express.Router();
require('dotenv').config();

const key = process.env.KEY_FOR_ENCRYPTION_DECRYPTION;

// Schema
const userAccountSchema = new mongoose.Schema({
  user_id: String,
  bank_name: String,
  account_number: String,
  ifsc_code: String,
  last_four_digits: String
}, { versionKey: false });

const AccountModel = mongoose.model('bankAccount', userAccountSchema);

// Create transaction
router.get('/', async (req, res) => {
  try {
    const { user_id, bank_name, account_number, ifsc_code } = req.query;

    if (!user_id || !bank_name || !account_number || !ifsc_code) {
      return res.status(400).send("❌ Missing required fields");
    }

    const last_four_digits = account_number.slice(-4);

    const encrypted_account_number = crypto.AES.encrypt(account_number, key).toString();
    const encrypted_ifsc_code = crypto.AES.encrypt(ifsc_code, key).toString();

    const newAccount = new AccountModel({
      user_id,
      bank_name,
      account_number: encrypted_account_number,
      ifsc_code: encrypted_ifsc_code,
      last_four_digits
    });

    await newAccount.save();
    res.send("✅ Transaction created successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Transaction creation failed");
  }
});

// Decrypt route for testing
router.get('/decrypt', async (req, res) => {
  try {
    const { id } = req.query;
    const account = await AccountModel.findById(id);
    if (!account) return res.status(404).send("❌ Account not found");

    const decrypted_account_number = crypto.AES.decrypt(account.account_number, key).toString(crypto.enc.Utf8);
    const decrypted_ifsc_code = crypto.AES.decrypt(account.ifsc_code, key).toString(crypto.enc.Utf8);

    res.json({
      user_id: account.user_id,
      bank_name: account.bank_name,
      account_number: decrypted_account_number,
      ifsc_code: decrypted_ifsc_code,
      last_four_digits: account.last_four_digits
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("❌ Decryption failed");
  }
});

module.exports = router;
