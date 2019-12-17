var express = require('express');
var router = express.Router();
// var verifyToken = require('../shared/auth/verifyToken');


var cics11a_controller = require('../controllers/cics11a.controller');

router.post('/cics11aRQST', cics11a_controller.validate('cics11aRQST'), cics11a_controller.cics11aRQST);

// router.post('/create/cics11a', )

module.exports = router;
