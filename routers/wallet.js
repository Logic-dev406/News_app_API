const express = require('express');
const router = express.Router();
const { getUserWallet } = require('../controllers/WalletControllers');

//Get user wallet by id
router.get('/', getUserWallet);
