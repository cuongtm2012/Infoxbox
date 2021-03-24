var express = require('express');
var router = express.Router();

var sendingDataContractFPTController = require('../controllers/eContractController/sendingContractData.controller');
var statusContractFPTController = require('../controllers/eContractController/statusOfCotract.controller');
var getStructureAPIController = require('../controllers/eContractController/getAPIStructure.controller');
var contractDownloadApiController = require('../controllers/eContractController/contractDownloadApi.controller');
var testDnsController = require('../controllers/eContractController/getAPIStructureDemo.controller');


router.post('/FTN_SCD_RQST', sendingDataContractFPTController.sendingContractData);

router.get('/FTN_CCS_RQST', statusContractFPTController.statusOfContract);

router.get('/FTN_GAS_RQST', getStructureAPIController.getStructureAPI);

router.get('/FTN_GCT_RQST', contractDownloadApiController.contractDownloadApi);

router.get('/testDnsProd', testDnsController.getStructureAPI_Test);
module.exports = router;