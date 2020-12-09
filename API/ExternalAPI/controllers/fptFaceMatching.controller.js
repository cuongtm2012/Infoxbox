const path = require('path');
const __dad = path.join(__dirname, '..')
const pathToSaveImg = path.join(__dad, 'uploads');
const validRequest = require('../util/validateFptV02Request');
const common_service = require('../services/common.service');
const util = require('../util/dateutil');
const dateutil = require('../util/dateutil');
const responCode = require('../../shared/constant/responseCodeExternal');
const PreResponse = require('../domain/preResponse.response');
const ResponseFptFaceMatchingWithoutResult = require('../domain/fpt_FaceMatching_Res_Without_Result.response');
const DataSaveToInqLog = require('../domain/data_FptId_Save_To_InqLog.save');
const cicExternalService = require('../services/cicExternal.service');
const _ = require('lodash');
const fs = require('fs');
const validS11AService = require('../services/validS11A.service');
const DataFptFaceMatchingSaveToScapLog = require('../domain/data_Fpt_FaceMatching_Save_To_ScrapLog.save');
exports.fptFaceMatching = function (req, res) {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 60 * 1000
        }
        //checking params
        let rsCheck = validRequest.checkParamRequest(req.body, req.files);
        let preResponse, responseData, dataInqLogSave;

        common_service.getSequence().then(resSeq => {
            let seqRquestId = resSeq[0].SEQ;
            let niceSessionKey = util.timeStamp2() + resSeq[0].SEQ;
            let fullNiceKey = responCode.NiceProductCode.KYC_F01_RQST.code + niceSessionKey;
            //is have invalid params
            if (!_.isEmpty(rsCheck)) {
                preResponse = new PreResponse(rsCheck.responseMessage, fullNiceKey, dateutil.timeStamp(), rsCheck.responseCode);
                responseData = new ResponseFptFaceMatchingWithoutResult(req, preResponse);
                // save Inqlog
                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                deleteFile(req);
                return res.status(200).send(responseData);
            }
            // check FI contract
            validS11AService.selectFiCode(req.body.fiCode, responCode.NiceProductCode.VMG_RISK_SCORE.code).then(dataFICode => {
                if (_.isEmpty(dataFICode)) {
                    preResponse = new PreResponse(responCode.RESCODEEXT.InvalidNiceProductCode.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.InvalidNiceProductCode.code);
                    responseData = new ResponseFptFaceMatchingWithoutResult(req.body, preResponse);
                    // update INQLOG
                    dataInqLogSave = new DataSaveToInqLog(req.body, responseData);
                    cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                    deleteFile(req);
                    return res.status(200).json(responseData);
                } else if (_.isEmpty(dataFICode[0]) && utilFunction.checkStatusCodeScraping(responCode.OracleError, utilFunction.getOracleCode(dataFICode))) {
                    preResponse = new PreResponse(responCode.RESCODEEXT.ErrorDatabaseConnection.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.ErrorDatabaseConnection.code);
                    responseData = new ResponseFptFaceMatchingWithoutResult(req.body, preResponse);
                    deleteFile(req);
                    return res.status(500).json(responseData);
                }
                //    end check parmas
                let dataInsertToScrapLog = new DataFptFaceMatchingSaveToScapLog(req.body, fullNiceKey);
                // insert rq to ScrapLog
                cicExternalService.insertDataFptRqToSCRPLOG(dataInsertToScrapLog).then(
                    result => {
                        deleteFile(req);
                    }).catch(reason => {
                    return res.status(500).json({error: reason.toString()});
                })
            }).catch(reason => {
                return res.status(500).json({error: reason.toString()});
            });
        }).catch(reason => {
            return res.status(500).json({error: reason.toString()});
        });
    } catch (err) {
        deleteFile(req);
        return res.status(500).json({error: err.toString()});
    }
}

function deleteFile(req) {
    // delete file
    if (!_.isEmpty(req.files)) {
        if (!_.isEmpty(req.files.sourceImage)) {
            fs.unlink(path.join(pathToSaveImg,req.files.sourceImage[0].filename), function (err) {
                if (err) throw err;
                console.log('deleted sourceImage ')
            });
        }

        if (!_.isEmpty(req.files.targetImage)) {
            fs.unlink(path.join(pathToSaveImg, req.files.targetImage[0].filename), function (err) {
                if (err) throw err;
                console.log('deleted targetImage ')
            });
        }
    }
}