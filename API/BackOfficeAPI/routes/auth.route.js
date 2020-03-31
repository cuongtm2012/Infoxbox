var express = require('express');
var router = express.Router();



var auth_controller = require('../controllers/auth.controller');

router.post('/login',  auth_controller.login);
router.post('/sendEmail',  auth_controller.sendEmail);
router.post('/register',  auth_controller.register);
module.exports = router;

