const Expenses = require('../models/expenses');
const jwt = require('jsonwebtoken');

exports.getAllExpenses = async (req, res, next) => {
    try {
        const userId = jwt.verify(req.query.token, 'KhulKeZeeLoZara').id;
        console.log(userId);
        const expenses = await Expenses.findAll({
            where: {
                userId: userId

            }


        });
        res.json(expenses);
    } catch (error) {
        res.status(401).json({
            message: 'Unauthorized User'
        });
    }
};

exports.getOneExpense = async (req, res, next) => {
    try {
        const userId = jwt.verify(req.query.token, 'KhulKeZeeLoZara').id;
        const expense = await Expenses.findOne({
            where: {
                id: req.params.id,
                userId: userId
            }
        });
        res.json(expense);
    } catch (error) {
        res.status(401).json({
            message: 'Unauthorized User'
        });
    }
};

exports.postAddExpense = async (req, res, next) => {
    try {
        const amount = parseInt(req.body.amount);
        const description = req.body.description;
        const category = req.body.category;
        const userId = jwt.verify(req.body.token, 'KhulKeZeeLoZara').id;
        const newExpense = await Expenses.create({
            amount: amount,
            description: description,
            category: category,
            userId: userId
        });
        res.json(newExpense);
    } catch (error) {
        res.status(401).json({
            message: 'Unauthorized User'
        });
    }
};

exports.putUpdateExpense = async (req, res, next) => {
    try {
        const expenseId = req.params.id;
        const userId = jwt.verify(req.body.token, 'KhulKeZeeLoZara').id;
        const [rowsUpdated] = await Expenses.update(
            {
                amount: parseInt(req.body.amount),
                description: req.body.description,
                category: req.body.category
            },
            {
                where: {
                    id: expenseId,
                    userId: userId
                }
            }
        );
        if (rowsUpdated === 0) {
            res.status(404).json({
                message: 'Expense not found'
            });
        } else {
            res.json({ rowsUpdated });
        }
    } catch (error) {
        res.status(401).json({
            message: 'Unauthorized User'
        });
    }
};

exports.deleteExpense = async (req, res, next) => {
    try {
        const userId = jwt.verify(req.query.token, 'KhulKeZeeLoZara').id;
        const rowsDeleted = await Expenses.destroy({
            where: {
                id: req.params.id,
                userId: userId
            }
        });
        if (rowsDeleted === 0) {
            res.status(404).json({
                message: 'Expense not found'
            });
        } else {
            res.json({ rowsDeleted });
        }
    } catch (error) {
        res.status(401).json({
            message: 'Unauthorized User'
        });
    }
};
