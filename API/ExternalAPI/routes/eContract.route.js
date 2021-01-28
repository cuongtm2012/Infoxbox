var express = require('express');
var router = express.Router();

var sendingDataContractFPTController = require('../controllers/sendingContractData.controller');
var statusContractFPTController = require('../controllers/statusOfCotract.controller');


router.post('/FTN_SCD_RQST', sendingDataContractFPTController.sendingContractData);

router.get('/FTN_CCS_RQST', statusContractFPTController.statusOfContract);

module.exports = router;