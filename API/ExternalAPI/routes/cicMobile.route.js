var express = require('express');
var router = express.Router();

const cicMacr_Controller = require('../controllers/cicMacr.controller');

//TODO
router.post('/CIC_MACR_RQST', cicMacr_Controller.cicMACRRQST);
router.post('/CIC_MACR_RSLT', cicMacr_Controller.cicMACRRSLT);

module.exports = router;