var express = require('express');
var router = express.Router();
const _ = require('lodash');
var maxSize = 1000 * 1000 * 1000 *1000;
var multer  = require('multer');
const path = require('path');
const __dad = path.join(__dirname, '..')
const pathToSaveImg = path.join(__dad, 'uploads');
const checkRequest = require('../util/checkSizeRequest')
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, pathToSaveImg);
    },
    filename: function (req, file, callback) {
        callback(null,Date.now() + file.originalname);
    },
    onFileUploadStart: function(file, req, res){
        if(req.files.file.length > maxSize) {
            return false;
        }
    }

});

var upload = multer({storage: storage, limits: { fileSize: maxSize }});
// var verifyToken = require('../shared/auth/verifyToken');


var cics11a_controller = require('../controllers/cics11a.controller');
var cicS37Rqst_controller = require('../controllers/cics37.controller');
var cicProcStat_controller = require('../controllers/cicProcStat.controller');
const cicMacr_Controller = require('../controllers/cicMacr.controller');
var zaloScoreController = require('../controllers/zaloScore.controller')
var vmgRiskScoreController = require('../controllers/vmgRiskScore.controller')
var fptDigitalizeIDController = require('../controllers/fptDigitalizeID.controller')
var fptFaceMatchingController = require('../controllers/fptFaceMatching.controller')
var fptDigitalizeIDAndFaceMatchingController = require('../controllers/Fpt_DigitalizeID_And_FaceMatching.controller')

var okFVNController = require('../controllers/okFVN.controller')
var pingPongController = require('../controllers/pingPong.controller')

router.post('/CIC_S11A_RQST', cics11a_controller.cics11aRQST);

router.post('/CIC_S11A_RSLT', cics11a_controller.cics11aRSLT);

router.post('/CIC_S37_RQST', cicS37Rqst_controller.cics37Rqst);

router.post('/CIC_S37_RSLT', cicS37Rqst_controller.cics37RSLT);

router.post('/CIC_PROC_STAT', cicProcStat_controller.cicProcStat);

router.post('/CIC_MACR_RQST', cicMacr_Controller.cicMACRRQST);
router.post('/CIC_MACR_RSLT', cicMacr_Controller.cicMACRRSLT);

router.post('/PHN_SCO_RQST', zaloScoreController.zaloScore);
router.post('/TCO_S01_RQST', vmgRiskScoreController.vmgRiskScore);

router.post('/OKF_SPL_RQST', okFVNController.okf_SPL_RQST);
router.post('/RCS_OK1_RQST', okFVNController.rcs_OK1_RQST);

router.post('/KYC_F01_RQST', checkRequest.checkRequestV01orV02 ,upload.fields([{ name: 'frontImage', maxCount: 1 }, { name: 'rearImage', maxCount: 1 }]) , function (req, res, next){
    fptDigitalizeIDController.fptDigitalizeID(req,res);
});

router.post('/KYC_F02_RQST',checkRequest.checkRequestV01orV02, upload.fields([{ name: 'sourceImage', maxCount: 1 }, { name: 'targetImage', maxCount: 1 }]) , function (req, res, next){
    fptFaceMatchingController.fptFaceMatching(req,res);
});

router.post('/KYC_FI1_RQST',checkRequest.checkRequestV01AndV02, upload.fields([{ name: 'frontImage', maxCount: 1 }, { name: 'rearImage', maxCount: 1 }, {name: 'selfieImage', maxCount: 1}]) , function (req, res, next){
    fptDigitalizeIDAndFaceMatchingController.fptDigitalizeIdAndFaceMatching(req,res);
});

router.get('/api/ping', pingPongController.pingPong);

module.exports = router;
