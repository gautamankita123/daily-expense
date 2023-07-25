const {User,Expenses,} = require('../models/database');
const sequelize = require('../models/sequelize');

exports.getLeaderboard = async (req, res, next) => {
    try {
        const users = await User.findAll({
            attributes: ['name', 'totalAmount'],
            order: [['totalAmount', 'DESC']]
        });
        res.status(200).json(users);
    } catch (e) {
        console.log(e);
        res.status(500).json({ err: e });
    }
}