const sequelize = require("../database/mysql");
const Expense = require("../models/expense");
const User = require("../models/user");
const { expense } = require("./expense");

exports.leaderboard = async (req, res, next) => {
    try {
        const users_leaderboard = await User.findAll({
            attributes: ["id", "name", "totalExpense"],
            order: ["totalExpense"],
            // order:['totalExpense','DESC']
        });
        res.status(201).json(users_leaderboard);
    } catch (err) {
        console.log(err);
    }
};