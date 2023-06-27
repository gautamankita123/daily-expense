const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.postAddUser = async (req, res, next) => {
    const { name, email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email: email } });
        if (user) {
            return res.status(400).json({
                error: 'User already exists'
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
            name: name,
            email: email,
            password: hashedPassword
        });
        res.status(201).json({
            message: 'User created successfully',
            user: newUser
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Server error'
        });
    }
};

exports.postLoginUser = async (req, res, next) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ where: { email: email } });
        if (!user) {
            return res.status(404).json({
                error: 'User does not exist'
            });
        }
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({
                error: 'Invalid password'
            });
        }
        const token = jwt.sign(
            {
                id: user.id,
                name: user.name
            },
            'ZindagiNaMilegiDubara',
            { expiresIn: '1h' }
        );
        res.status(200).json({
            message: 'Login successful',
            token: token
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            error: 'Server error'
        });
    }
};
