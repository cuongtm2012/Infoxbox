var express = require('express');
var router = express.Router();

var sendingDataContractFPTController = require('../controllers/eContractController/sendingContractData.controller');
var statusContractFPTController = require('../controllers/eContractController/statusOfCotract.controller');
var getStructureAPIController = require('../controllers/eContractController/getAPIStructure.controller');


router.post('/FTN_SCD_RQST', sendingDataContractFPTController.sendingContractData);

router.get('/FTN_CCS_RQST', statusContractFPTController.statusOfContract);

router.get('/FTN_GAS_RQST', getStructureAPIController.getStructureAPI);

module.exports = router;