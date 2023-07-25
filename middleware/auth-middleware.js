const jwt = require('jsonwebtoken');
const { User } = require('../models/database');

exports.authenticateUser = (req, res, next) => {
    const token = req.headers.authorization;
    const id = jwt.verify(token, process.env.JWT_SECRET_KEY).id;
    User.findOne({ where: { id: id } })
        .then((user) => {
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }
            req.user = user.id;
            next();
        }).catch(err => {
            return res.status(401).json({ message: 'User not found' });
        })
}