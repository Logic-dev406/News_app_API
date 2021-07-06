const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
    getNews,
    getNewsById,
    createNews,
    getUsersNews,
    deleteNewsById,
    deleteUserNews,
    updateNewsById,
} = require('../controllers/newsController');
const news = require('../models/news');

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
};

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    },
});

const uploadOptions = multer({ storage: storage });

//Get news
router.get('/', getNews);

//Get news by slug
router.get('/:slug', getNewsById);

//Get news created by a user
router.get('/mynews/:id', getUsersNews);

//Update my news
router.put('/:id', updateNewsById);

//Delete news by id
router.delete('/:id', deleteNewsById);

//Create news
router.post('/', uploadOptions.single('image'), createNews);

module.exports = router;
