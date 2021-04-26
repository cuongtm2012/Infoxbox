const express = require('express');
const router = express.Router();

const sendingDataContractFPTController = require('../controllers/eContractController/sendingContractData.controller');
const statusContractFPTController = require('../controllers/eContractController/statusOfCotract.controller');
const getStructureAPIController = require('../controllers/eContractController/getAPIStructure.controller');
const contractDownloadApiController = require('../controllers/eContractController/contractDownloadApi.controller');
const sendingDataContractFPTController_TMP = require('../controllers/eContractController/sendingContractData_TMP.controller');


router.post('/FTN_SCD_RQST', sendingDataContractFPTController.sendingContractData);

router.get('/FTN_CCS_RQST', statusContractFPTController.statusOfContract);

router.get('/FTN_GAS_RQST', getStructureAPIController.getStructureAPI);

router.get('/FTN_GCT_RQST', contractDownloadApiController.contractDownloadApi);

router.post('/FTN_SCD_RQST_TMP', sendingDataContractFPTController_TMP.sendingContractData_TMP);
module.exports = router;