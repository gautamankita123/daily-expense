const Express = require('express');
const forgotpassword_controller = require('../controller/forgot_password');

const router = Express.Router();

router.use("/forgotpassword", forgotpassword_controller.forgotpassword);
router.get("/resetpassword/:id", forgotpassword_controller.reset);
router.get("/updatepassword/:updateid", forgotpassword_controller.updatepassword);
module.exports = router;