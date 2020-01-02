var express = require('express');
var router = express.Router();
// var verifyToken = require('../shared/auth/verifyToken');


var cics11a_controller = require('../controllers/cics11a.controller');

router.post('/cics11aRSLT',  cics11a_controller.cics11aRSLT);

module.exports = router;
