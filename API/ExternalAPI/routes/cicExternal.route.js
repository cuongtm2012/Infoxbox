var express = require('express');
var router = express.Router();
// var verifyToken = require('../shared/auth/verifyToken');


var cics11a_controller = require('../controllers/cics11a.controller');
var cicS37Rqst_controller = require('../controllers/cics37.controller');
var cicProcStat_controller = require('../controllers/cicProcStat.controller');
const cicMacr_Controller = require('../controllers/cicMacr.controller');

router.post('/CIC_S11A_RQST', cics11a_controller.cics11aRQST);

router.post('/CIC_S11A_RSLT', cics11a_controller.cics11aRSLT);

router.post('/CIC_S37_RQST', cicS37Rqst_controller.cics37Rqst);

router.post('/CIC_S37_RSLT', cicS37Rqst_controller.cics37RSLT);

router.post('/CIC_PROC_STAT', cicProcStat_controller.cicProcStat);

router.post('/CIC_MACR_RQST', cicMacr_Controller.cicMACRRQST);
router.post('/CIC_MACR_RSLT', cicMacr_Controller.cicMACRRSLT);

module.exports = router;
