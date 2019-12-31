var express = require('express');
var router = express.Router();
// var verifyToken = require('../shared/auth/verifyToken');


var cics11a_controller = require('../controllers/cics11a.controller');
var cicS37Rqst_controller = require('../controllers/cics37.controller');
var cicProcStat_controller = require('../controllers/cicProcStat.controller');

router.post('/cics11aRQST',  cics11a_controller.cics11aRQST);

router.post('/cics11aRSLT',  cics11a_controller.cics11aRSLT);

router.post('/cicS37RQST', cicS37Rqst_controller.cics37Rqst);
//TODO
router.post('/cicProcSTAT', cicProcStat_controller.cicProcStat);

module.exports = router;
