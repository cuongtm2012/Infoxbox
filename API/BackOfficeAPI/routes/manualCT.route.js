var express = require('express');
var router = express.Router();
var verifyToken = require('../util/verifyToken');


var manualCaptcha = require('../controllers/manualCaptcha.conroller');

router.get('/getListB003', verifyToken ,  manualCaptcha.getListB003);
router.get('/getListB001',  verifyToken  ,manualCaptcha.getListForB001);
router.get('/getListB002',  verifyToken , manualCaptcha.getListB002);
module.exports = router;
