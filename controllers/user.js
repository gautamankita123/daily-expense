const User = require('../models/users');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

function isStringInvalid(string) {
    if (string === undefined || string.length === 0) {
        return true;
    } else {
        return false;
    }
}

const generateAccessToken = (id, name, isPremiumUser) => {
    return jwt.sign({ userId: id, name: name, isPremiumUser }, 'secretkey');
};

const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (
            isStringInvalid(name) ||
            isStringInvalid(email) ||
            isStringInvalid(password)
        ) {
            return res
                .status(400)
                .json({ err: 'Bad parameters. Something is missing' });
        }

        const saltRounds = 10;
        const hash = await bcrypt.hash(password, saltRounds);

        await User.create({ name: name, email: email, password: hash });
        res.status(201).json({ message: 'Successfully created new user' });
    } catch (err) {
        res.status(500).json(err);
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (isStringInvalid(email) || isStringInvalid(password)) {
            return res
                .status(400)
                .json({ message: 'Email or password is missing', success: false });
        }

        const user = await User.findAll({ where: { email } });

        if (user.length > 0) {
            bcrypt.compare(password, user[0].password, (err, result) => {
                if (err) {
                    throw new Error('Something went wrong');
                }
                if (result === true) {
                    const token = generateAccessToken(
                        user[0].id,
                        user[0].name,
                        user[0].isPremiumUser
                    );
                    return res.status(200).json({
                        success: true,
                        message: 'User logged in successfully',
                        token: token,
                    });
                } else {
                    return res
                        .status(400)
                        .json({ success: false, message: 'Password is incorrect' });
                }
            });
        } else {
            return res
                .status(404)
                .json({ success: false, message: 'User does not exist' });
        }
    } catch (err) {
        res.status(500).json({ message: err, success: false });
    }
};

module.exports = {
    signup,
    login,
    generateAccessToken,
};
