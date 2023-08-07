const Sequelize = require("sequelize");
const sequelize = require("../database/mysql");

const Forgotpassword = sequelize.define("forgotpassword", {
    id: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
    },
    userId: Sequelize.STRING,
    active: Sequelize.BOOLEAN,
});

module.exports = Forgotpassword;