const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Sib = require('sib-api-v3-sdk');


// exports.getUser = (req, res, next) => {
//     res.json(req.user);
// }

exports.postAddUser = async (req, res, next) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    try {
        const user = await User.findOne({ where: { email: email } });
        if (user) {
            return res.status(400).json({
                error: 'User already exists',
                user: user
            });
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = await User.create({
            name: name,
            email: email,
            password: hashedPassword,
        });
        res.status(201).json({
            user: newUser
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err
        });
    }
}

exports.postLoginUser = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
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
            'ZindagiNaMilegiDubara'
        );
        res.status(200).json({
            message: "Login successful",
            token: token,
            username: user.name,
            isPremium: user.isPremium
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err
        });
    }
}

exports.postForgotPassword = async (req, res, next) => {
    const email = req.body.email;
    try {
        const user = User.findOne({ where: { email: email } });
        if (!user) {
            return res.status(404).json({
                error: 'User does not exist'
            });
        }

        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = "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";

        const transEmailApi = new Sib.TransactionalEmailsApi();

        const sender = {
            email: 'ankitsharma751997@gmail.com'
        }

        const receivers = [
            {
                email: 'ankitsharma76543@gmail.com'
            }
        ]
        const emailResponse = await transEmailApi.sendTransacEmail({
            sender: sender,
            to: receivers,
            subject: 'Reset Password',
            textContent: 'Please click the link below to reset your password'
        });
        // res.status(200).json({
        //     message: "Password reset successful",
        //     token: token
        // });
        console.log(emailResponse);
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
}