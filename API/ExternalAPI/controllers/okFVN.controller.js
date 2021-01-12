const logger = require('../config/logger');

const OKF_SPL_RQSTReq = require('../domain/OKF_SPL_RQST.request');
const OKF_SPL_RQSTRes = require('../domain/OKF_SPL_RQST.response');
const dataSimpleLimitSaveToScrapLog = require('../domain/dataSimpleLimitSaveToScrapLog.save');
const okFVNService = require('../services/okFVN.service');

const validation = require('../../shared/util/validation');

const validRequest = require('../util/validateOKVNParamRequest');

const util = require('../util/dateutil');

const common_service = require('../services/common.service');

const responCode = require('../../shared/constant/responseCodeExternal');
const _ = require('lodash');

const validS11AService = require('../services/validS11A.service');
const PreResponse = require('../domain/preResponse.response');
const dateutil = require('../util/dateutil');
const DataSaveToInqLog = require('../domain/data_FptId_Save_To_InqLog.save');
const cicExternalService = require('../services/cicExternal.service');
const utilFunction = require('../../shared/util/util');
const io = require('socket.io-client');
const URI = require('../../shared/URI');

exports.okf_SPL_RQST = function (req, res, next) {
    let socket;

    try {
        let niceSessionKey;
        let preResponse, responseData, dataInqLogSave;

        /*
        Checking parameters request
        Request data
        */
        let rsCheck = validRequest.checkOKVNParamRequest(req.body);
        common_service.getSequence().then(resSeq => {
            let niceSessionKey = util.timeStamp2() + resSeq[0].SEQ;
            let fullNiceKey = responCode.NiceProductCode.OKF_SPL_RQST.code + niceSessionKey;
            if (!_.isEmpty(rsCheck)) {
                preResponse = new PreResponse(rsCheck.responseMessage, fullNiceKey, dateutil.timeStamp(), rsCheck.responseCode);
                responseData = new OKF_SPL_RQSTRes(req.body, preResponse);
                // update INQLOG
                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                return res.status(200).json(responseData);
            }
            validS11AService.selectFiCode(req.body.fiCode, responCode.NiceProductCode.OKF_SPL_RQST.code).then(dataFICode => {
                if (_.isEmpty(dataFICode)) {
                    preResponse = new PreResponse(responCode.RESCODEEXT.InvalidNiceProductCode.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.InvalidNiceProductCode.code);
                    responseData = new OKF_SPL_RQSTRes(req.body, preResponse);
                    // update INQLOG
                    dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                    cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                    return res.status(200).json(responseData);
                } else if (_.isEmpty(dataFICode[0]) && utilFunction.checkStatusCodeScraping(responCode.OracleError, utilFunction.getOracleCode(dataFICode))) {
                    preResponse = new PreResponse(responCode.RESCODEEXT.ErrorDatabaseConnection.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.ErrorDatabaseConnection.code);
                    responseData = new OKF_SPL_RQSTRes(req.body, preResponse);
                    return res.status(500).json(responseData);
                }
                //End check params request
                const getdataReq = new OKF_SPL_RQSTReq(req.body, niceSessionKey);
                let dataSaveToScrapLog = new dataSimpleLimitSaveToScrapLog(req.body, fullNiceKey);
                //calculated simple limit
                cicExternalService.insertDataSimpleLimitToSCRPLOG(dataSaveToScrapLog).then(
                    result => {
                        okFVNService.getSimpleLimit(getdataReq, res).then(data => {
                            preResponse = new PreResponse(responCode.RESCODEEXT.NORMAL.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                            responseData = new OKF_SPL_RQSTRes(getdataReq, preResponse);
                            responseData.maxSimpleLimit = data.toString();
                            // update INQLOG
                            dataInqLogSave = new DataSaveToInqLog(getdataReq, preResponse);
                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                            cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.NORMAL.code).then();
                            return res.status(200).json(responseData);
                        }).catch(reason => {
                            return res.status(500).json({error: reason.toString()});
                        });
                    }).catch(reason => {
                    return res.status(500).json({error: reason.toString()});
                });
            }).catch(reason => {
                return res.status(500).json({error: reason.toString()});
            });
        }).catch(reason => {
            return res.status(500).json({error: reason.toString()});
        });
    } catch (err) {
        return res.status(500).json({error: err.toString()});
    }
};