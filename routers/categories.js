const express = require('express');
const router = express.Router();
const {
    getCategories,
    getCategoryById,
    createCategory,
    updateCategoryById,
    deleteCategoryById,
} = require('../controllers/CategoriesController');
// const { authUser, isAdmin } = require('../helpers/jwt');

//Get all categories
router.get('/', getCategories);

//Get category by id
router.get('/:id', getCategoryById);

//Create category
router.post('/', createCategory);

//Update category by id
router.put('/:id', updateCategoryById);

//Delete category by id
router.delete('/:id', deleteCategoryById);

module.exports = router;
