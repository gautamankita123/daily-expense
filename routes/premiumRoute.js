const express = require('express');
const router = express.Router();
const premiumController = require('../controllers/premium-controller');

router.get('/premium/showleaderboard', premiumController.getLeaderboard);

module.exports = router;