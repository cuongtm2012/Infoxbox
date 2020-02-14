var express = require('express');
var router = express.Router();
var ManualCaptchaController = require('../controllers/manualCaptcha.controller');

router.post('/serviceStart', ManualCaptchaController.serviceStart);
router.post('/serviceCall', ManualCaptchaController.serviceCall);
router.post('/serviceCall2', ManualCaptchaController.serviceCall2);

module.exports = router;