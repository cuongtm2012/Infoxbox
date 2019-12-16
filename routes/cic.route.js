var express = require('express');
var router = express.Router();
// var verifyToken = require('../shared/auth/verifyToken');


var cicB0001Controller = require('../controllers/cicB0001.controller');

// cicB0001Controller.validate('cicB0001')
router.post('/cicB0001', cicB0001Controller.cicB0001);

router.post('/InternalCICB0001', cicB0001Controller.InternalCICB0001);

// router.post('/create/cics11a', )

module.exports = router;
