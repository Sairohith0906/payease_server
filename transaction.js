const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();





// ✅ Schema
const userTransactionSchema = new mongoose.Schema({
  transaction_id: String,
  sender_upi_id: String,
  receiver_upi_id: String,
  amount: String,
  transaction_time: String
},{versionKey:false});

// ✅ Model
const transaction_model = mongoose.models.transaction || mongoose.model('transaction', userTransactionSchema);

// ✅ API route
router.get('/', async (req, res) => {
  const {transaction_id,
      sender_upi_id,
      receiver_upi_id,
      amount} = req.query;

  const now = new Date();
  const timestamp = `Current Time: ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;

  try {
    const newTransaction = new transaction_model({
      transaction_id,
      sender_upi_id,
      receiver_upi_id,
      amount,
      timestamp
    });
    await newTransaction.save();
    res.send("Transaction created successfully");
  } catch (err) {
    console.log(err);
    res.status(500).send("Transaction creation failed");
  }
});


module.exports=router;

