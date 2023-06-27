const express = require('express');
const router = express.Router();
const expenseController = require('../controllers/expenseController');

router.get('/expenses', expenseController.getAllExpenses);

router.get('/expenses/:id', expenseController.getOneExpense);

router.post('/expenses', expenseController.postAddExpense);

router.put('/expenses/:id', expenseController.putUpdateExpense);

router.delete('/expenses/:id', expenseController.deleteExpense);

module.exports = router;
