const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller');

router.post('/user/signup', authController.postAddUser);

router.post('/user/login', authController.postLoginUser);

module.exports = router;


