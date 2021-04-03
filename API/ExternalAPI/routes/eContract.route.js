import express from'express';
const router = express.Router();

import { sendingContractData } from '../controllers/eContractController/sendingContractData.controller.js';
import { statusOfContract } from '../controllers/eContractController/statusOfCotract.controller.js';
import { getStructureAPI } from'../controllers/eContractController/getAPIStructure.controller.js';
// import contractDownloadApiController from'../controllers/eContractController/contractDownloadApi.controller';


router.post('/FTN_SCD_RQST', sendingContractData);

router.get('/FTN_CCS_RQST', statusOfContract);

router.get('/FTN_GAS_RQST', getStructureAPI);
//
// router.get('/FTN_GCT_RQST', contractDownloadApiController.contractDownloadApi);
export default router;