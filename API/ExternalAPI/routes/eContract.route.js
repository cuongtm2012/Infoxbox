import express from 'express';
var router = express.Router();

import { sendingContractData } from '../controllers/eContractController/sendingContractData.controller.js';
// var statusContractFPTController = require('../controllers/eContractController/statusOfCotract.controller');
// var getStructureAPIController = require('../controllers/eContractController/getAPIStructure.controller');
// var contractDownloadApiController = require('../controllers/eContractController/contractDownloadApi.controller');


router.post('/FTN_SCD_RQST', sendingContractData);

// router.get('/FTN_CCS_RQST', statusContractFPTController.statusOfContract);
//
// router.get('/FTN_GAS_RQST', getStructureAPIController.getStructureAPI);
//
// router.get('/FTN_GCT_RQST', contractDownloadApiController.contractDownloadApi);
export default router;