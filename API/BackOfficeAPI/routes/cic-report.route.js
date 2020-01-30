var express = require('express');
var router = express.Router();
// var verifyToken = require('../shared/auth/verifyToken');


var cicReportController = require('../controllers/cic-report.controller');

router.get('/cicReportManagement',  auth_controller.cicReportManagement);
module.exports = router;

