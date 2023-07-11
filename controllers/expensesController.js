const Expenses = require('../models/expense');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const sequelize = require('../util/database');
const { catchBlock, sendResBlock } = require('../util/helpers');

exports.getAllExpenses = async (req, res, next) => {
    try {
        const response = await Expenses.findAll({ where: { userId: req.user.id } });
        sendResBlock(res, response)
    } catch (err) {
        catchBlock(res, err, 'Expense could not be retrieved');
    }
}

exports.getOneExpense = async (req, res, next) => {
    try {
        const response = await Expenses.findOne({ where: { id: req.params.id, userId: req.user.id } });
        sendResBlock(res, response);
    } catch (err) {
        catchBlock(res, err, 'Expense could not be retrieved');
    }
}

exports.postAddExpense = async (req, res, next) => {
    let t;
    try {
        t = await sequelize.transaction();
        const expenseCreateResponse = await Expenses.create({
            amount: parseInt(req.body.amount),
            description: req.body.description,
            category: req.body.category,
            userId: req.user.id
        }, { transaction: t });
        const updatedAmount = req.user.totalAmount + parseInt(req.body.amount);
        const userUpdatedResponse = await User.update({ totalAmount: updatedAmount }, { where: { id: req.user.id }, transaction: t });
        await t.commit();
        sendResBlock(res, expenseCreateResponse, 'Expense added successfully!');
    } catch (err) {
        await t.rollback();
        catchBlock(res, err, 'Expense could not be added');
    }
}

exports.putUpdateExpense = async (req, res, next) => {
    const amount = parseInt(req.body.amount);
    let t;
    try {
        t = await sequelize.transaction();
        const expenseResponse = await Expenses.findOne({ where: { id: req.params.id, userId: req.user.id } }, { transaction: t });
        if (expenseResponse.amount != amount) {
            let updatedAmount;
            if (expenseResponse.amount < amount) {
                updatedAmount = req.user.totalAmount + (amount - expenseResponse.amount);
            } else {
                updatedAmount = req.user.totalAmount - (expenseResponse.amount - amount);
            }
            const updatedUserResponse = await User.update({ totalAmount: updatedAmount }, { where: { id: req.user.id }, transaction: t });
        }
        const updatedExpenseResponse = await expenseResponse.update({
            amount: amount,
            description: req.body.description,
            category: req.body.category
        }, { transaction: t });

        await t.commit()
        sendResBlock(res, updatedExpenseResponse, 'Expense updated successfully!')
    } catch (err) {
        await t.rollback();
        catchBlock(res, err, 'Expense could not be updated');
    }
}

exports.deleteExpense = async (req, res, next) => {
    let t;
    try {
        t = await sequelize.transaction();
        const expenseResponse = await Expenses.findOne({ where: { id: req.params.id, userId: req.user.id } }, { transaction: t });
        const updatedAmount = req.user.totalAmount - expenseResponse.amount;
        expenseResponse.destroy();
        const updatedUserResponse = await User.update({ totalAmount: updatedAmount }, { where: { id: req.user.id }, transaction: t });
        await t.commit()
        sendResBlock(res, expenseResponse, 'Expense deleted successfully!');
    }
    catch (err) {
        await t.rollback();
        catchBlock(res, err, 'Expense could not be deleted');
    }
}