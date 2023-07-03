const express = require('express');
const router = express.Router();
const controller = require('../controllers/forgetPassword')
const auth = require('../middleware/auth')

router.use('/forgotpassword', auth.authorizerUser, controller.forgetPassword);

module.exports = router;