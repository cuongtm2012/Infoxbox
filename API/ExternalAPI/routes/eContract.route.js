import express from'express';
const router = express.Router();

import { sendingContractData } from '../controllers/eContractController/sendingContractData.controller.js';
// import statusContractFPTController from'../controllers/eContractController/statusOfCotract.controller';
// import getStructureAPIController from'../controllers/eContractController/getAPIStructure.controller';
// import contractDownloadApiController from'../controllers/eContractController/contractDownloadApi.controller';


router.post('/FTN_SCD_RQST', sendingContractData);

// router.get('/FTN_CCS_RQST', statusContractFPTController.statusOfContract);
//
// router.get('/FTN_GAS_RQST', getStructureAPIController.getStructureAPI);
//
// router.get('/FTN_GCT_RQST', contractDownloadApiController.contractDownloadApi);
export default router;