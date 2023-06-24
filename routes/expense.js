const express = require('express');

const expenseController = require('../controllers/expense')
const userAuthentication = require('../middleware/auth')

const router = express.Router();

router.post('/addexpense', userAuthentication.authenticate, expenseController.addexpense)

router.get('/getexpenses', userAuthentication.authenticate, expenseController.getexpenses)

router.delete('/deleteexpense/:expenseid', userAuthentication.authenticate, expenseController.deleteexpense)

module.exports = router;