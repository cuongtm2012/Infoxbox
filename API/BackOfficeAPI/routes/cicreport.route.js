var express = require('express');
var router = express.Router();
// var verifyToken = require('../shared/auth/verifyToken');


var cicReportController = require('../controllers/cic-report.controller');

router.get('/viewHistoryCICReport', cicReportController.viewHistoryCICReport);
router.get('/viewDetailInfoCICReport', cicReportController.viewDetailInfoCICReport);

module.exports = router;
