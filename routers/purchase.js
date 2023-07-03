const express = require('express');
const router = express.Router();
const controller = require('../controllers/purches')
const middle = require('../middleware/auth');


router.use('/purches', middle.authorizerUser, controller.primeMembership);
router.use('/updatetransaction', middle.authorizerUser, controller.transactionUpdate);



module.exports = router;