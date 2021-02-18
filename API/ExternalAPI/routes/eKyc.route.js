var express = require('express');
var router = express.Router();

var VmgCAC1Controller = require('../controllers/VmgCAC1.controller');



router.post('/KYC_VC1_RQST', VmgCAC1Controller.KYC_VC1_RQST);

router.post('/KYC_VC1_RSLT', VmgCAC1Controller.KYC_VC1_RSLT);

module.exports = router;