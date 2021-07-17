const express = require('express');
const router = express.Router();
const {
    getUserWallet,
    sendToken,
} = require('../controllers/WalletControllers');

//Get user wallet by id
router.get('/:id', getUserWallet);

//Receive token
router.post('/:email', sendToken);

module.exports = router;
