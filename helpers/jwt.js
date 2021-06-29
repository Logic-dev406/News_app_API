const jwt = require('jsonwebtoken');
const { secret } = require('../config/config');

const authUser = (req, res, next) => {
    //Find jwt in header
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send('Please login');
    } else {
        //Validate jwt token
        const tokenBody = token.slice(7);
        jwt.verify(tokenBody, secret, (error, user) => {
            if (error) {
                console.log('Jwt Error:', error);
                return res.status(401).send('Error: Unauthorized');
            }

            req.user = user;
            next();
        });
    }
};

const isAdmin = (req, res, next) => {
    if (req.user.role === 'admin') {
        res.status(200);
        next();
    } else {
        return res.status(401).send('Error: Access Denied');
    }
};

const isBasicUser = (req, res, next) => {
    if (req.user.role === 'basic') {
        res.status(200);
        next();
    } else {
        return res.status(401).send('Error: Access Denied');
    }
};

module.exports = {
    authUser,
    isAdmin,
    isBasicUser,
};
