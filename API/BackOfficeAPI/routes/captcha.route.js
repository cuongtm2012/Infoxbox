var express = require('express');
var router = express.Router();
// var verifyToken = require('../shared/auth/verifyToken');
var captcha_router = require('../controllers/captcha.controller');

router.get('/getCaptchaInfo',  captcha_router.getCaptchaInfo);
router.post('/createCaptcha',  captcha_router.createCaptcha);
router.put('/updateCaptcha',  captcha_router.updateCaptcha);


module.exports = router;
