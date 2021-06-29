const express = require('express');
const { getNews, getNewsById } = require('../controllers/newsController');
const router = express.Router();
const News = require('../models/news');

//Get news
router.get('/', getNews);

router.get('/', getNewsById);

module.exports = router;
