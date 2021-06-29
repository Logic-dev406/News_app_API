const express = require('express');
const router = express.Router();
const News = require('../models/news');

router.get('/', async (req, res) => {
    const newsList = await News.find();

    if (!newsList) {
        res.status(500).json({ success: false });
    }

    res.send(newsList);
});

module.exports = router;
