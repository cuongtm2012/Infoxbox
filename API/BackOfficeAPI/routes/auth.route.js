var express = require('express');
var router = express.Router();



var auth_controller = require('../controllers/auth.controller');

router.post('/login',  auth_controller.login);
module.exports = router;

