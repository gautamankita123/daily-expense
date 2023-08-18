const Sequelize = require("sequelize");

// Replace these with your actual database credentials
const sequelize = new Sequelize("node-complete", "root", "mysql@1234", {
    host: "localhost",
    dialect: "mysql",
});

module.exports = sequelize;
