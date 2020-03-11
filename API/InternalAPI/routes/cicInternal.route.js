var express = require('express');
var router = express.Router();

var internalCIC_controller = require('../controllers/internalCIC.controller');
const mobileCIC_controller = require('../controllers/mobile.controller');

// request to cic server
router.post('/cic', internalCIC_controller.internalCIC);
router.post('/cicB0003', internalCIC_controller.internalCICB0003);
router.post('/mobile', mobileCIC_controller.mobileCicController);


module.exports = router;
