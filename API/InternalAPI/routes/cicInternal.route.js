var express = require('express');
var router = express.Router();
// var verifyToken = require('../shared/auth/verifyToken');


var cicB0001Controller = require('../controllers/cicB0001.controller');

// request to cic server
router.post('/cicB0001', cicB0001Controller.cicB0001);

router.post('/RequestCICB0001', cicB0001Controller.InternalCICB0001);

// router.post('/create/cics11a', )

module.exports = router;
