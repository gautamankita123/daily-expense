const Express = require("express");
const cors = require("cors");
const body_parser = require("body-parser");

const sequelize = require("./database/mysql");

const user_routes = require("./routes/user");
const login_routes = require("./routes/login");
const expense_routes = require("./routes/expense");
const order_routes = require("./routes/order");
const leaderboard_routes = require("./routes/leaderboard");
const forgotpassword_routes = require("./routes/forgot_password");

const User = require("./models/user");
const Order = require("./models/order");
const Expense = require("./models/expense");
const forgotpassword = require("./controller/forgot_password");

const app = Express();

app.use(cors());

app.use(body_parser.json({ extended: false }));
app.use(user_routes);
app.use(login_routes);
app.use(expense_routes);
app.use(order_routes);
app.use(leaderboard_routes);
app.use(forgotpassword_routes);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

sequelize
    .sync()
    .then((result) => {
        app.listen(3000);
    })
    .catch((err) => console.log(err));