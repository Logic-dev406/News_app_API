const express = require('express');
const router = express.Router();
const {
    getListOfAllUsers,
    getUserById,
    createAdminUser,
    loginUser,
    registerNewUser,
    getTotalAmountOfAllUsers,
    deleteUserById,
    updateUserById,
} = require('../controllers/UsersController');
const { authUser, isAdmin } = require('../helpers/jwt');

//TODO
//Integrate sendgrid email service

//Get list of all users
router.get('/', [authUser, isAdmin], getListOfAllUsers);

//Get user by id
router.get('/me', [authUser], getUserById);

//Update user information by id
router.put('/update', [authUser], updateUserById);

//Create user by admin
router.post('/', [authUser, isAdmin], createAdminUser);

//Login user
router.post('/login', loginUser);

//Register user
router.post('/register', registerNewUser);

//Get amount of all users
router.get('/get/count', [authUser, isAdmin], getTotalAmountOfAllUsers);

//Delete user by id
router.delete('/:id', [authUser, isAdmin], deleteUserById);

module.exports = router;
