const Expenses = require('../models/expense');
const User = require('../models/user');
const sequelize = require('../util/database');

exports.getLeaderboard = async (req, res, next) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', [sequelize.fn('sum', sequelize.col('amount')), 'total_cost']],
            include: [
                {
                    model: Expenses,
                    attributes: []
                }
            ],
            group: ['user.id'],
            order: [['total_cost', 'DESC']]
        });
        res.status(200).json(users);
    } catch (e) {
        console.log(e);
        res.status(500).json({ err: e });
    }
}