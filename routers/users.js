const express = require('express');
const router = express.Router();
const {
    getListOfActiveUsers,
    getListOfNonActiveUsers,
    getUserById,
    createAdminUser,
    loginUser,
    registerNewUser,
    getTotalAmountOfAllUsers,
    deleteUserById,
    updateUserById,
    deleteAllAccount,
} = require('../controllers/UsersController');
// const { authUser, isAdmin } = require('../helpers/jwt');

//TODO
//Integrate sendgrid email service

//Get list of active users
router.get('/active-users', getListOfActiveUsers);

//Get list of non active users
router.get('/non-active-users', getListOfNonActiveUsers);

//Get user by id
router.get('/:id', getUserById);

//Update user information by id
router.put('/:id', updateUserById);

//Create user by admin
router.post('/', createAdminUser);

//Login user
router.post('/login', loginUser);

//Register user
router.post('/register', registerNewUser);

//Get amount of all users
router.get('/get/count', getTotalAmountOfAllUsers);

//Delete user by id
router.delete('/:id', deleteUserById);

//Delete all accounts
router.delete('/', deleteAllAccount);

module.exports = router;
