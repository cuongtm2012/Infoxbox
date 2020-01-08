var express = require('express');
var router = express.Router();
// var verifyToken = require('../shared/auth/verifyToken');


var auth_controller = require('../controllers/auth.controller');

router.post('/login',  auth_controller.login);
router.post('/checkemail',  auth_controller.checkemail);
router.post('/sendEmail',  auth_controller.sendEmail);
router.post('/getCodeEmail',  auth_controller.getCodeEmail);
module.exports = router;
