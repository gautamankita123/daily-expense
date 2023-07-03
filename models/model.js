const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true,
        unique: true
    },
    userName: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    userEmail: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    userContact: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    userPassword: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    isPrime: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
    },
    totalExpense: Sequelize.INTEGER,
});

module.exports = User;