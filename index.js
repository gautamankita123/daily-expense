const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const purchaseRoutes = require('./routes/purchase');
const sequelize = require('./util/database');
const User = require('./models/user');
const Expenses = require('./models/expenses');
const Order = require('./models/order');

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({
    origin: 'http://127.0.0.1:5500'
}));

app.use(bodyParser.json());

app.use(authRoutes);
app.use(expenseRoutes);
app.use(purchaseRoutes);

User.hasMany(Expenses);
Expenses.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Order);
Order.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });

sequelize
    .sync()
    .then(() => {
        app.listen(3000, () => {
            console.log(3000);
        });
    })
    .catch((error) => {
        console.error(error);
    });
