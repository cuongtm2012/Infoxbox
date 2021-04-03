import express from 'express';
const router = express.Router();
import _ from 'lodash';
import path from 'path';
const __dirname = path.resolve()
const __dad = path.join(__dirname, '..')
const pathToSaveImg = path.join(__dad, 'uploads');
import {checkRequestV01orV02, checkRequestV01AndV02} from '../util/checkSizeRequest.js';
import multipart from 'connect-multiparty';
const multipartMiddleware = multipart({maxFieldsSize: '1000mb' , uploadDir: pathToSaveImg});


import {cics11aRQST, cics11aRSLT} from '../controllers/cicController/cics11a.controller.js';
// import cicS37Rqst_controller from '../controllers/cicController/cics37.controller.js' ;
// import cicProcStat_controller from '../controllers/cicController/cicProcStat.controller.js' ;
// import cicMacr_Controller from '../controllers/cicController/cicMacr.controller.js' ;
// import zaloScoreController from '../controllers/zaloAndVmgController/zaloScore.controller.js' ;
// import vmgRiskScoreController from '../controllers/zaloAndVmgController/vmgRiskScore.controller.js' ;
// import fptDigitalizeIDController from '../controllers/fptTrandataController/fptDigitalizeID.controller.js' ;
// import fptFaceMatchingController from '../controllers/fptTrandataController/fptFaceMatching.controller.js' ;
// import fptDigitalizeIDAndFaceMatchingController from '../controllers/fptTrandataController/Fpt_DigitalizeID_And_FaceMatching.controller.js' ;
// import nonFinancialScoreOKController from '../controllers/niceController/NonFinancialScoreOK.controller.js' ;
// import mainScoreController from '../controllers/niceController/MainScore.Controller.js' ;

// import okFVNController from '../controllers/niceController/okFVN.controller.js' ;
// import pingPongController from '../controllers/pingPong.controller.js' ;

router.post('/CIC_S11A_RQST', cics11aRQST);

router.post('/CIC_S11A_RSLT', cics11aRSLT);

// router.post('/CIC_S37_RQST', cicS37Rqst_controller.cics37Rqst);

// router.post('/CIC_S37_RSLT', cicS37Rqst_controller.cics37RSLT);

// router.post('/CIC_PROC_STAT', cicProcStat_controller.cicProcStat);

// router.post('/CIC_MACR_RQST', cicMacr_Controller.cicMACRRQST);
// router.post('/CIC_MACR_RSLT', cicMacr_Controller.cicMACRRSLT);

// router.post('/PHN_SCO_RQST', zaloScoreController.zaloScore);
// router.post('/TCO_S01_RQST', vmgRiskScoreController.vmgRiskScore);
// router.post('/OKF_SCO_RQST', nonFinancialScoreOKController.nonFinancialScoreOk);

// router.post('/OKF_SPL_RQST', okFVNController.okf_SPL_RQST);
// router.post('/RCS_M01_RQST', mainScoreController.rcs_M01_RQST);

// router.post('/KYC_F01_RQST', checkRequest.checkRequestV01orV02 , multipartMiddleware, function (req, res, next){
//     fptDigitalizeIDController.fptDigitalizeID(req,res);
// });

// router.post('/KYC_F02_RQST',checkRequest.checkRequestV01orV02, multipartMiddleware, function (req, res, next){
//     fptFaceMatchingController.fptFaceMatching(req,res);
// });

// router.post('/KYC_FI1_RQST',checkRequest.checkRequestV01AndV02, multipartMiddleware, function (req, res, next){
//     fptDigitalizeIDAndFaceMatchingController.fptDigitalizeIdAndFaceMatching(req,res);
// });

// router.get('/api/ping', pingPongController.pingPong);


export default router;
