const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const sign_up_server = require('./sign_up_server');
const login = require('./login_server');
const create_chat = require('./create_chat');
const chats = require('./chats');
const bank_account = require('./bank_account');
const transaction = require('./transaction');
const server = require('./server');

const app = express();
app.use(cors());
app.use(express.json());

const baseUri = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(baseUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Error:', err));

// Mount routes
app.use('/login', login);
app.use('/signup', sign_up_server);
app.use('/bank', bank_account);
app.use('/transaction', transaction);
app.use('/chats', chats);
app.use('/create-chat', create_chat);
app.use('/send-otp', server);

app.listen(9000, () => {
  console.log('🚀 Server started on port 9000');
});
