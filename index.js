const express = require('express')
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const authRoutes = require('./routes/authRoutes');
const expenseRoutes = require('./routes/expensesRoutes');
const purchaseRoutes = require('./routes/purchase');
const premiumRoutes = require('./routes/premiumRoute');
const sequelize = require('./util/database');
const User = require('./models/user');
const Expenses = require('./models/expense');
const Order = require('./models/order');
const ForgotPasswordRequest = require('./models/reset-password');

const app = express()

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());

app.use(bodyParser.json({ extended: false }));

app.use(authRoutes);
app.use(expenseRoutes);
app.use(purchaseRoutes);
app.use(premiumRoutes);

User.hasMany(Expenses);
Expenses.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(Order);
Order.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
User.hasMany(ForgotPasswordRequest);
ForgotPasswordRequest.belongsTo(User);

sequelize
    .sync()
    .then(() => {
        app.listen(3000)
    })
    .catch(err => console.error(err));