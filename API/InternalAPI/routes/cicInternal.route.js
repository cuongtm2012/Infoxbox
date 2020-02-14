var express = require('express');
var router = express.Router();

var internalCIC_controller = require('../controllers/internalCIC.controller');
var manualCaptcha_controller = require('../controllers/manualCaptcha.controller');

// request to cic server
router.post('/cic', internalCIC_controller.internalCIC);
router.post('/cicB0003', internalCIC_controller.internalCICB0003);

router.post('/manualCaptcha', manualCaptcha_controller.internalCICManualCaptcha);

module.exports = router;
