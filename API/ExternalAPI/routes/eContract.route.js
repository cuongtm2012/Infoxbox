import express from'express';
const router = express.Router();

import { sendingContractData } from '../controllers/eContractController/sendingContractData.controller.js';
import { statusOfContract } from '../controllers/eContractController/statusOfCotract.controller.js';
import { getStructureAPI } from'../controllers/eContractController/getAPIStructure.controller.js';
import {contractDownloadApi} from '../controllers/eContractController/contractDownloadApi.controller.js';


router.post('/FTN_SCD_RQST', sendingContractData);

router.get('/FTN_CCS_RQST', statusOfContract);

router.get('/FTN_GAS_RQST', getStructureAPI);

router.get('/FTN_GCT_RQST', contractDownloadApi);
export default router;