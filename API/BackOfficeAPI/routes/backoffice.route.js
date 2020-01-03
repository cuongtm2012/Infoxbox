var express = require('express');
var router = express.Router();
var verifyToken = require('../util/verifyToken');


var cics11a_controller = require('../controllers/cics11a.controller');

router.post('/cics11aRSLT', verifyToken,  cics11a_controller.cics11aRSLT);

module.exports = router;
