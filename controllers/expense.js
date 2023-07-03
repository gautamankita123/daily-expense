const { toInteger } = require('lodash');
const Expense = require('../models/expense');
let User = require('../models/model');
const sequelize = require('../util/database');

exports.newExpense = async (req, res, next) => {
    let t = await sequelize.transaction();
    try {
        let description = req.body.description;
        let price = req.body.price;
        let category = req.body.category;

        let newExpense = await Expense.create({
            Description: description,
            Price: price,
            Category: category,
            userId: req.user.id,
        }, { transaction: t })
        try {
            let user = await User.findOne({
                where: { id: req.user.id },
                transaction: t,
            })
            user.totalExpense = toInteger(price) + user.totalExpense
            user.save()

            await t.commit();
        } catch (err) {
            console.log(err)
            t.rollback()
        }
        res.status(200).send(newExpense);

    } catch (err) {
        console.log(err)
        t.rollback()
    }
}

exports.allExpense = (req, res, next) => {
    let Id = req.user.id;
    // console.log(req)
    Expense.findAll({ where: { userId: Id } })
        .then(result => {
            // console.log(result)
            res.json({ data: result, prime: req.user.isPrime })
        })
        .catch(err => console.log(err))
}

exports.deleteExpense = async (req, res, next) => {
    let t = await sequelize.transaction();
    try {
        let Id = req.body.id;
        let userId = req.user.id;
        // console.log(Id);
        // console.log(userId);

        let exp = await Expense.findOne({
            where: { id: Id, userId: userId },
            transaction: t
        });
        try {
            let user = await User.findOne({
                where: { id: req.user.id },
                transaction: t
            })
            user.totalExpense = user.totalExpense - exp.Price;
            user.save();
            exp.destroy();

            await t.commit();
            res.send('item deleted');
        }
        catch (err) {
            console.log(err);
            t.rollback();
        }
    }
    catch (err) {
        console.log(err);
        t.rollback()
    }
}


exports.updateExpense = async (req, res, next) => {
    let t = await sequelize.transaction();
    try {
        let Id = req.body.id;
        let userId = req.user.id;
        // console.log(Id)
        let exp = await Expense.findOne({
            where: { id: Id, userId: userId },
            transaction: t
        });
        let user = await User.findOne({
            where: { id: req.user.id },
            transaction: t
        })
        try {
            await Expense.update(
                {
                    Description: req.body.description,
                    Price: req.body.price,
                    Category: req.body.category,
                },
                { where: { id: Id, userId: userId }, transaction: t });

            user.totalExpense = (user.totalExpense - exp.Price) + toInteger(req.body.price);
            user.save();
            await t.commit();
            res.send('item updeted');

        } catch (err) {
            console.log(err);
            t.rollback()
        }
    }
    catch (err) {
        console.log(err);
        t.rollback()
    }
}