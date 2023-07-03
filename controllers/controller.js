const bcrypt = require('bcrypt');
const User = require('../models/model');
const JWT = require('jsonwebtoken');
const dotenv = require("dotenv")
dotenv.config()


exports.addNewUser = async (req, res, next) => {

    let checkem = req.body.email;
    try {
        let foundEmail = await User.findOne({ where: { userEmail: checkem } });
        if (foundEmail) {
            return res.send('user alredy exixt email found');
        }
        else {
            salt = 5
            bcrypt.hash(req.body.password, salt, async (err, hash) => {
                console.log(req.body.contact)
                // console.log(req.body.name, req.body.email, req.body.contect, req.body.password)
                let user = await User.create({
                    userName: req.body.name,
                    userEmail: req.body.email,
                    userContact: req.body.contact,
                    userPassword: hash,
                    isPrime: false,
                    totalExpense: 0
                })

                res.status(200).send(user);
            })
        }
    }
    catch (err) {
        console.log(err)
    }
}


function generateToken(id) {
    // console.log(process.env.JWT_SECRET)
    return JWT.sign({ userId: id }, process.env.JWT_SECRET)
}


let attempt = 3;
exports.accessUser = async (req, res, next) => {
    try {
        // console.log(req.body)
        let checkem = req.body.email;
        let foundEmail = await User.findOne({ where: { userEmail: checkem } });

        if (!foundEmail) {
            return res.status(404).send('user not exist');
        }
        if (foundEmail) {
            // console.log(foundEmail)
            bcrypt.compare(req.body.password, foundEmail.userPassword, async (err, pass) => {
                if (pass) {
                    // console.log(generateToken(foundEmail.id))
                    res.status(200).json({ success: true, msg: "created sucsessfully", token: generateToken(foundEmail.id) })
                }
                else {
                    attempt -= 1;
                    if (attempt <= 0) {
                        res.status(400).send('invalid credential, try after sometime');
                    } else {
                        res.status(400).send(`invalid password only ${attempt} attempt left`);
                    }
                }
            })
        }
    } catch (err) {
        console.log(err)
    }
}