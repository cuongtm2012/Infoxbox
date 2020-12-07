const validRequest = require('../util/validateFptV01Request');
const axios = require('axios');
const common_service = require('../services/common.service');
const responCode = require('../../shared/constant/responseCodeExternal');
const _ = require('lodash');
const PreResponse = require('../domain/preResponse.response');
const dateutil = require('../util/dateutil');
const ResponseFptIdWithoutResult = require('../domain/FptId_Res_Without_Result.response');
const DataFptIdSaveToInqLog = require('../domain/data_FptId_Save_To_InqLog.save');
const util = require('../util/dateutil');
const cicExternalService = require('../services/cicExternal.service');
const fs = require('fs');
const pathToFile = './uploads/'
exports.fptFaceMatch = function (req, res) {
    const config = {
        headers: {
            'Content-Type': 'application/json'
        },
        timeout: 60 * 1000
    }
    //checking params
    let rsCheck = validRequest.checkParamRequest(req.body, req.files);
    let preResponse, responseData, dataInqLogSave, dataScoreFptId;

    common_service.getSequence().then(resSeq => {
        let niceSessionKey = util.timeStamp2() + resSeq[0].SEQ;
        let fullNiceKey = responCode.NiceProductCode.KYC_F01_RQST.code + niceSessionKey;

        if (!_.isEmpty(rsCheck)) {
            preResponse = new PreResponse(rsCheck.responseMessage, fullNiceKey, dateutil.timeStamp(), rsCheck.responseCode);
            responseData = new ResponseFptIdWithoutResult(req, preResponse);
            // save Inqlog
            dataInqLogSave = new DataFptIdSaveToInqLog(req.body, preResponse);
            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
            if (!_.isEmpty(req.files)) {
                if (!_.isEmpty(req.files.frontImage)) {
                    fs.unlink(pathToFile + req.files.frontImage[0].filename, function (err) {
                        if (err) throw err;
                        console.log('deleted frontImage ')
                    });
                }

                if (!_.isEmpty(req.files.rearImage)) {
                    fs.unlink(pathToFile + req.files.rearImage[0].filename, function (err) {
                        if (err) throw err;
                        console.log('deleted rearImage ')
                    });
                }
            }
            res.status(200).send(responseData);
        }


    });
}
