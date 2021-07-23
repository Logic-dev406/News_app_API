const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
    getNews,
    getNewsById,
    createNews,
    getUsersNews,
    deleteNewsById,
    updateNewsById,
    updateNewsImageById,
    getRecentNews,
    filterNewsByCategory,
    searchNews,
} = require('../controllers/NewsController');
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
router.get('/:count', getNews);

//Get recent news
router.get('/recentnews/:count', getRecentNews);

//Search news by category
router.get('/search', searchNews);

//Filter news by category
router.get('/filterednews/:id', filterNewsByCategory);

//Get news by slug
router.get('/:slug', getNewsById);

//Get news created by a user
router.get('/mynews/:id', getUsersNews);

//Update news by id
router.put('/:id', updateNewsById);

//Update news image by id
router.put('/image/:id', uploadOptions.single('image'), updateNewsImageById);

//Delete news by id
router.delete('/:id', deleteNewsById);

//Get news by category
// router.get('/filter/:category', filterNewsByCategory);

//Create news
router.post('/', uploadOptions.single('image'), createNews);

module.exports = router;
