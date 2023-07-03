const User = require('../models/model');
const JWT = require('jsonwebtoken');

exports.authorizerUser = (req, res, next) => {
    try {
        let token = req.header('Authorization');
        // console.log(token);

        let userId = JWT.verify(token, process.env.JWT_SECRET);
        // console.log('userId>>>>>',userId.userId)

        User.findByPk(userId.userId)
            .then(use => {
                // console.log(use)
                req.user = use
                next()
            })
    }
    catch (err) {
        console.log(err)
        return res.status(500).send(err)
    }
}