var express = require('express');
var router = express.Router();
var verifyToken = require('../util/verifyToken');
var captcha_router = require('../controllers/captcha.controller');

router.get('/getCaptchaInfo',  verifyToken ,  captcha_router.getCaptchaInfo);
router.get('/getTriggerStatus',  verifyToken ,  captcha_router.checkStatusTrigger);
router.post('/createCaptcha',  verifyToken ,  captcha_router.createCaptcha);
router.put('/updateCaptcha', verifyToken ,   captcha_router.updateCaptcha);
router.put('/enableTrigger', verifyToken ,   captcha_router.enableTrigger);
router.put('/disableTrigger', verifyToken ,   captcha_router.disableTrigger);


module.exports = router;
