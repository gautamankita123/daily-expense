const express = require('express');
const bodyperser = require('body-parser');
const cors = require('cors');

const sequelize = require('./util/database');
let router = require('./routers/router.js');
let expence = require('./routers/expense.js');
let prime = require('./routers/purchase.js');
let primeUser = require('./routers/primeUser.js')
const forgetPassword = require('./routers/forgetPassword.js')

let Expense = require('./models/expense.js');
let User = require('./models/model.js');
let order = require('./models/order.js');
const Order = require('./models/order.js');

const app = express();
app.use(cors());
app.use(bodyperser.json({ extended: false }))


app.use('/user', router);
app.use('/expense', expence);
app.use('/primemember', prime);
app.use('/prime', primeUser);
app.use('/password', forgetPassword);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
order.belongsTo(User);




sequelize
    //.sync({ force: true })
    .sync()
    .catch(err => console.log(err))

app.listen(4000) 