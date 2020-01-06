var express = require('express');
var router = express.Router();
// var verifyToken = require('../shared/auth/verifyToken');


var cicB0002Controller = require('../controllers/cicB0002.controller');
var internalCIC_controller = require('../controllers/internalCIC.controller');

// request to cic server
router.post('/cic', internalCIC_controller.internalCIC);
router.post('/cicB0003', internalCIC_controller.internalCICB0003);

router.post('/RequestCICB0002', cicB0002Controller.InternalCICB0002);
router.post('/RequestCICB0002NotExist', cicB0002Controller.InternalCICB0002NotExist);

// router.post('/create/cics11a', )

module.exports = router;
