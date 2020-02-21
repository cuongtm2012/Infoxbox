var express = require('express');
var router = express.Router();
var verifyToken = require('../util/verifyToken');
var captcha_router = require('../controllers/captcha.controller');

router.get('/getCaptchaInfo',  verifyToken ,  captcha_router.getCaptchaInfo);
router.post('/createCaptcha',  verifyToken ,  captcha_router.createCaptcha);
router.put('/updateCaptcha', verifyToken ,   captcha_router.updateCaptcha);


module.exports = router;
