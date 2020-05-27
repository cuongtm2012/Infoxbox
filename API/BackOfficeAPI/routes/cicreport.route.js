var express = require('express');
var router = express.Router();
var verifyToken = require('../util/verifyToken');


var cicReportController = require('../controllers/cic-report.controller');

router.get('/viewHistoryCICReport',  verifyToken ,cicReportController.viewHistoryCICReport);
router.get('/checkRecordToExecuteManual', verifyToken , cicReportController.checkRecordToExecuteManual);

module.exports = router;
