const Expenses = require('../models/expense');
const User = require('../models/user');

exports.getLeaderboard = async (req, res, next) => {
    try {
        const users = await User.findAll();
        const expenses = await Expenses.findAll();
        const userAggregatedExpenses = {};
        expenses.forEach(expense => {
            //expense.user = users.filter(user => user.id === expense.userId)[0];
            userAggregatedExpenses[expense.userId] = userAggregatedExpenses[expense.userId] + expense.amount || expense.amount;
        })
        const userLeaderBoardDetails = [];
        users.forEach(user => {
            userLeaderBoardDetails.push({ name: user.name, total_cost: userAggregatedExpenses[user.id] })
            userAggregatedExpenses[user.id] = userAggregatedExpenses[user.id] || 0;
        })
        userLeaderBoardDetails.sort((a, b) => a.total_cost - b.total_cost);
        res.status(200).json(userLeaderBoardDetails);
    } catch (e) {
        res.status(500).json({ err: e });
    }
}