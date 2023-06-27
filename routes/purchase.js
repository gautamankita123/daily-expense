const express = require('express');
const router = express.Router();
const purchaseController = require('../controllers/purchase-controller');

router.get('/purchase/premiummembership', purchaseController.getPremiumMembership);

router.post('/updatetransactionstatus', purchaseController.postUpdateTransactionStatus);

module.exports = router;

