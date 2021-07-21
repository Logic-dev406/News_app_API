const express = require('express');
const router = express.Router();
const multer = require('multer');
const {
    getCategories,
    getCategoryBySlug,
    createCategory,
    updateCategoryById,
    deleteCategoryById,
} = require('../controllers/CategoriesController');

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

// const { authUser, isAdmin } = require('../helpers/jwt');

const uploadOptions = multer({ storage: storage });
//Get all categories
router.get('/', getCategories);

//Get category by slug
router.get('/:slug', getCategoryBySlug);

//Create category
router.post('/', uploadOptions.single('image'), createCategory);

//Update category by id
router.put('/:id', uploadOptions.single('image'), updateCategoryById);

//Delete category by id
router.delete('/:id', deleteCategoryById);

module.exports = router;
