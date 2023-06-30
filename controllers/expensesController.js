const Expenses = require('../models/expense');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

exports.getAllExpenses = (req, res, next) => {
    Expenses.findAll({
        where: {
            userId: req.user.id
        }
    })
        .then(response => res.json(response))
        .catch(err => console.log(err));
}

exports.getOneExpense = (req, res, next) => {
    Expenses.findOne({
        where: {
            id: req.params.id,
            userId: req.user.id
        }
    })
        .then(response => res.json(response))
        .catch(err => console.log(err));
}

exports.postAddExpense = (req, res, next) => {
    const amount = parseInt(req.body.amount);
    const description = req.body.description;
    const category = req.body.category;
    Expenses.create({
        amount: amount,
        description: description,
        category: category,
        userId: req.user.id
    })
        .then(response => {
            const updatedAmount = req.user.totalAmount + amount;
            User.update({
                totalAmount: updatedAmount
            }, {
                where: {
                    id: req.user.id
                }
            })
            res.json(response)
        })
        .catch(err => console.log(err));
}

exports.putUpdateExpense = (req, res, next) => {
    const expenseId = req.params.id;
    Expenses.update({
        amount: parseInt(req.body.amount),
        description: req.body.description,
        category: req.body.category
    }, {
        where: {
            id: expenseId,
            userId: req.user.id
        }
    }
    )
        .then(response => res.json(response))
        .catch(err => console.log(err));
}

exports.deleteExpense = (req, res, next) => {
    Expenses.destroy({
        where: {
            id: req.params.id,
            userId: req.user.id
        }
    })
        .then(response => res.json(response))
        .catch(err => console.log(err));
}