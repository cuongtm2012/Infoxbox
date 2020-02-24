var express = require('express');
var router = express.Router();
var verifyToken = require('../util/verifyToken');


var cicReportController = require('../controllers/cic-report.controller');

router.get('/viewHistoryCICReport',  verifyToken ,cicReportController.viewHistoryCICReport);
router.get('/handledViewReportCIC', verifyToken , cicReportController.handledViewReportCIC);

module.exports = router;
