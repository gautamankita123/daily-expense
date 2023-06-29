const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.authenticateUser = (req, res, next) => {
    const token = req.headers.authorization;
    const id = jwt.verify(token, 'ZindagiNaMilegiDubara').id;
    User.findOne({ where: { id: id } })
        .then((user) => {
            if (!user) {
                return res.status(401).json({ message: 'User not found' });
            }
            req.user = user;
            next();
        }).catch(err => {
            return res.status(401).json({ message: 'User not found' });
        })
}