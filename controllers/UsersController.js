const User = require('../models/user');
const { json } = require('body-parser');
const bcrypt = require('bcryptjs');
const { secret } = require('../config/config');
const jwt = require('jsonwebtoken');
const { token } = require('morgan');
const mongoose = require('mongoose');
const response = require('../helpers/response');
const Wallet = require('../models/wallet');

class UsersController {
    static async getAllUsers(req, res) {
        const userList = await User.find().select('-passwordHash ');

        if (!userList) {
            res.status(500).send(response('Users not find', {}, false));
        }

        res.send(response('Fetched users successfully', userList));
    }

    static async getListOfActiveUsers(req, res) {
        const userList = await User.find({ status: 'active' }).select(
            '-passwordHash '
        );

        if (!userList) {
            res.status(500).send(response('Users not find', {}, false));
        }

        res.send(response('Fetched active users successfully', userList));
    }

    static async getListOfNonActiveUsers(req, res) {
        const userList = await User.find({ status: 'not-active' }).select(
            '-passwordHash '
        );

        if (!userList) {
            res.status(500).send(response('User not find', {}, false));
        }

        res.send(response('Fetched non active users successfully', userList));
    }

    static async getUserById(req, res) {
        const user = await User.findById(req.params.id).select('-passwordHash');

        if (!user || user.status === 'not-active') {
            return res.status(500).send(response('user not found', {}, false));
        }

        res.status(200).send(response('Fetched users successfully', user));
    }

    static async createAdminUser(req, res) {
        try {
            const userExist = await User.findOne({ email: req.body.email });

            if (userExist) {
                return res
                    .status(400)
                    .send(response('email already exist', {}, false));
            }

            let user = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                passwordHash: bcrypt.hashSync(req.body.password, 10),
                phone: req.body.phone,
                role: req.body.role,
            });
            user = await user.save();

            if (!user)
                return res
                    .status(500)
                    .send(response('The user can not be created', {}, false));

            res.send(response('User was created successfully', user));

            // const userId = await user._id;
            // const walletExist = await Wallet.findOne({ user: userId });

            // if (walletExist) {
            //     return res
            //         .status(400)
            //         .send(response('Wallet already exist', {}, false));
            // }

            // let wallet = new Wallet({
            //     user: userId,
            // });
            // wallet = await wallet.save();
        } catch (error) {
            res.send(response(error.message, {}, false));
        }
    }

    static async updateUserById(req, res) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            res.status(400).send(response('invalid User id', {}, false));
        }

        const update = {
            ...req.body,
        };
        const filter = { _id: req.params.id };

        try {
            const user = await User.findOneAndUpdate(filter, update, {
                new: true,
            }).select('-passwordHash');

            if (!user)
                return res
                    .status(500)
                    .send(response('The user can not be updated', {}, false));

            return res
                .status(200)
                .send(response('User was successfullly updated', user));
        } catch (error) {
            res.status(409).send(response(error.message, {}, false));
            console.log(error.message);
        }
    }

    static async loginUser(req, res) {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.status(400).send(response('user not found', {}, false));
        }

        if (user && bcrypt.compareSync(req.body.password, user.passwordHash)) {
            const token = jwt.sign(
                {
                    userId: user.id,
                    role: user.role,
                },
                secret,
                { expiresIn: '1d' }
            );

            return res.status(200).send(
                response('Login successful', {
                    user: user.email,
                    token: token,
                })
            );
        } else {
            res.status(400).send(response('password is wrong!', {}, false));
        }
    }

    static async registerNewUser(req, res) {
        const userExist = await User.findOne({ email: req.body.email });

        if (userExist) {
            return res
                .status(400)
                .send(response('email already exist', {}, false));
        }

        try {
            let user = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                passwordHash: bcrypt.hashSync(req.body.password, 10),
                phone: req.body.phone,
            });
            user = await user.save();

            if (!user)
                return res
                    .status(404)
                    .send(response('The user can not be created', {}, false));

            res.send(response('User created successfully', user));

            // const userId = await user._id;
            // const walletExist = await Wallet.findOne({ user: userId });

            // if (walletExist) {
            //     return res
            //         .status(400)
            //         .send(response('Wallet already exist', {}, false));
            // }

            // let wallet = new Wallet({
            //     user: userId,
            // });
            // wallet = await wallet.save();
        } catch (error) {
            res.send(response(error.message, {}, false));
        }
    }

    static async getTotalAmountOfAllUsers(req, res) {
        const userCount = await User.countDocuments((count) => count);

        if (!userCount) {
            return res
                .status(500)
                .send(response('Users count unsuccessful', {}, false));
        }

        res.send(response('Users count successful', userCount));
    }

    static async deleteUserById(req, res) {
        if (!mongoose.isValidObjectId(req.params.id)) {
            res.status(400).send(response('invalid User id', {}, false));
        }

        const update = {
            status: 'not-active',
        };
        const filter = { _id: req.params.id };

        try {
            const user = await User.findOneAndUpdate(filter, update, {
                new: true,
            }).select('-passwordHash');

            if (!user)
                return res
                    .status(500)
                    .send(response('User not found', {}, false));

            return res
                .status(200)
                .send(response('User was successfullly deleted', {}));
        } catch (error) {
            res.status(409).send(response(error.message, {}, false));
            console.log(error.message);
        }
    }

    static deleteAllAccount(req, res) {
        User.deleteMany()
            .then((user) => {
                if (user) {
                    return res
                        .status(200)
                        .send(
                            response('All Account was successful deleted ', {})
                        );
                } else {
                    return res
                        .status(404)
                        .send(response('Accounts not found', {}, false));
                }
            })
            .catch((error) => {
                return res.status(400).send(response(error.message, {}, false));
            });
    }
}

module.exports = UsersController;
