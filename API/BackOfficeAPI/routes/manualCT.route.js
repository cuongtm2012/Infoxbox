var express = require('express');
var router = express.Router();
// var verifyToken = require('../shared/auth/verifyToken');


var manualCaptcha = require('../controllers/manualCaptcha.conroller');

router.get('/getListB003',  manualCaptcha.getListScrpLog);
module.exports = router;
