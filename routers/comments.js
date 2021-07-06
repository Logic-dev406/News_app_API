const express = require('express');
const router = express.Router();
const { createComment } = require('../controllers/CommentsController');

//Create comment
router.post('/:id/comment', createComment);

module.exports = router;
