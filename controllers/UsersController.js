const User = require('../models/user');
const { json } = require('body-parser');
const bcrypt = require('bcryptjs');
const { secret } = require('../config/config');
const jwt = require('jsonwebtoken');
const { token } = require('morgan');
const mongoose = require('mongoose');
const response = require('../helpers/response');

class UsersController {
    static async getListOfAllUsers(req, res) {
        const userList = await User.find().select('-passwordHash');

        if (!userList) {
            res.status(500).send(response('No user find', {}, false));
        }

        res.send(response('Fetched users successfully', userList));
    }

    static async getUserById(req, res) {
        const user = await User.findById(req.user.userId).select(
            '-passwordHash'
        );

        if (!user) {
            return res.status(500).send(response('user not found', {}, false));
        }

        res.status(200).send(response('Fetched users successfully', user));
    }

    static async createAdminUser(req, res) {
        try {
            let user = new User({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                email: req.body.email,
                passwordHash: bcrypt.hashSync(req.body.password, 10),
                phone: req.body.phone,
                role: req.body.role,
                street: req.body.street,
                lga: req.body.lga,
                direction: req.body.direction,
                city: req.body.city,
                state: req.body.state,
            });
            user = await user.save();

            if (!user)
                return res
                    .status(500)
                    .send(response('The user can not be created', {}, false));

            res.send(response('User was created successfully', user));
        } catch (error) {
            res.send(response(error.message, {}, false));
        }
    }

    static async updateUserById(req, res) {
        if (!mongoose.isValidObjectId(req.user.userId)) {
            res.status(400).send(response('invalid User id', {}, false));
        }

        const update = {
            ...req.body,
        };
        const filter = { _id: req.user.userId };

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

        // return res.status(200).send(response("",user));
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
                street: req.body.street,
                lga: req.body.lga,
                direction: req.body.direction,
                city: req.body.city,
                state: req.body.state,
            });
            user = await user.save();

            if (!user)
                return res
                    .status(404)
                    .send(response('The user can not be created', {}, false));

            res.send(response('User created successfully', user));
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

    static deleteUserById(req, res) {
        User.findByIdAndDelete(req.params.id)
            .then((user) => {
                if (user) {
                    return res
                        .status(200)
                        .send(response('User was successful deleted ', {}));
                } else {
                    return res
                        .status(404)
                        .send(response('User not found', {}, false));
                }
            })
            .catch((error) => {
                return res.status(400).send(response(error.message, {}, false));
            });
    }
}

module.exports = UsersController;
