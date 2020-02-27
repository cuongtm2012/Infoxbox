var express = require('express');
var router = express.Router();
var verifyToken = require('../util/verifyToken');


var manualCaptcha = require('../controllers/manualCaptcha.conroller');

router.get('/getListB003', verifyToken ,  manualCaptcha.getListB003);
router.get('/getListB001',   manualCaptcha.getListForB001);
module.exports = router;