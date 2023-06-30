const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');
const authMiddleware = require('../middleware/auth-middleware');

// router.get('/expenses', expensesController.getAllExpenses);
0
// router.get('/', expensesController.getAllExpenses);

// router.get('/expenses/:id', expensesController.getOneExpense);
//router.get('/user', authMiddleware.authenticateUser, authController.getUser);

router.post('/user/signup', authController.postAddUser);

router.post('/user/login', authController.postLoginUser);

router.post('/password/forgotpassword', authController.postForgotPassword);

// router.put('/expenses/:id', expensesController.putUpdateExpense);

// router.delete('/expenses/:id', expensesController.deleteExpense);

module.exports = router;