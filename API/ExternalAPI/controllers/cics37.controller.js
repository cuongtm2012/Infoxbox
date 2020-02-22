
const logger = require('../config/logger');

const cics37RQSTReq = require('../domain/CIC_S37_RQST.request');

const cicExternalService = require('../services/cicExternal.service');
const cicCicS37Service = require('../services/cicS37.service');

const cics37RQSTRes = require('../domain/CIC_S37_RQST.response');

const validation = require('../../shared/util/validation');
const validRequest = require('../util/validateParamRequestS37');
const encryptPassword = require('../util/encryptPassword');

const responcodeEXT = require('../../shared/constant/responseCodeExternal');

const util = require('../util/dateutil');
const common_service = require('../services/common.service');
const validS11AService = require('../services/validS11A.service');
const PreResponse = require('../domain/preResponse.response');
const DataInqLogSave = require('../domain/INQLOG.save');
const _ = require('lodash');
const dateutil = require('../util/dateutil');

exports.cics37Rqst = function (req, res) {
    try {
        // encrypt password
        let password = encryptPassword.encrypt(req.body.loginPw);
        let niceSessionKey;

        /*
        * Checking parameters request
        * Request data
        */
        let rsCheck = validRequest.checkParamRequest(req.body);
        let preResponse, responseData;

        if (!_.isEmpty(rsCheck)) {
            preResponse = new PreResponse(rsCheck.responseMessage, '', dateutil.timeStamp(), rsCheck.responseCode);

            responseData = new cics37RQSTRes(req.body, preResponse);
            // update INQLOG
            dataInqLogSave = new DataInqLogSave(req.body, responseData.responseCode);
            cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                console.log('insert INQLOG:', r);
            });
            return res.status(200).json(responseData);
        }
        validS11AService.selectFiCode(req.body.fiCode, responcodeEXT.NiceProductCode.S37.code).then(dataFICode => {
            if (_.isEmpty(dataFICode)) {
                preResponse = new PreResponse(responcodeEXT.RESCODEEXT.InvalidNiceProductCode.name, '', dateutil.timeStamp(), responcodeEXT.RESCODEEXT.InvalidNiceProductCode.code);

                responseData = new cics37RQSTRes(req.body, preResponse);
                // update INQLOG
                dataInqLogSave = new DataInqLogSave(req.body, responseData.responseCode);
                cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                    console.log('insert INQLOG:', r);
                });
                return res.status(200).json(responseData);
            }
            //End check params request
            common_service.getSequence().then(resSeq => {
                niceSessionKey = util.timeStamp2() + resSeq[0].SEQ;

                const getdataReq = new cics37RQSTReq(req.body, password, niceSessionKey);
                // JSON.stringify(getdataReq);
                console.log("getdataReq=====", getdataReq);

                //Logging request
                logger.debug('Log request parameters from routes after manage request');
                logger.info(getdataReq);

                cicExternalService.insertSCRPLOG(getdataReq, res).then(niceSessionK => {
                    console.log("result cics11aRQST: ", niceSessionK);

                    if (!validation.isEmptyStr(niceSessionK)) {
                        let responseSuccess = new PreResponse(responcodeEXT.RESCODEEXT.NORMAL.name, niceSessionK, dateutil.timeStamp(), responcodeEXT.RESCODEEXT.NORMAL.code);
                        responseData = new cics37RQSTRes(getdataReq, responseSuccess);
                    } else {
                        let responseUnknow = new PreResponse(responcodeEXT.RESCODEEXT.UNKNOW.name, '', dateutil.timeStamp(), responcodeEXT.RESCODEEXT.UNKNOW.code);
                        responseData = new cics37RQSTRes(getdataReq, responseUnknow);
                    }
                    // update INQLOG
                    dataInqLogSave = new DataInqLogSave(getdataReq, responseData.responseCode);
                    cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                        console.log('insert INQLOG:', r);
                    });
                    return res.status(200).json(responseData);
                });
            });
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ error: err.toString() });
    }
};

const cics37RSLTReq = require('../domain/CIC_S37_RSLT.request');
const cics37RSLTRes = require('../domain/CIC_S37_RSLT.response');
const validS11ARQLT = require('../util/validRequestS11AResponse');

exports.cics37RSLT = function (req, res) {
    try {
        const getdataReq = new cics37RSLTReq(req.body);

		/*
		* Checking parameters request
		* Request data
		*/
        let rsCheck = validS11ARQLT.checkParamRequestForResponse(getdataReq);
        let preResponse, responseData, dataInqLogSave;

        if (!_.isEmpty(rsCheck)) {
            preResponse = new PreResponse(rsCheck.responseMessage, '', dateutil.timeStamp(), rsCheck.responseCode);

            responseData = new cics37RSLTRes(getdataReq, preResponse, {});
            // update INQLOG
            dataInqLogSave = new DataInqLogSave(getdataReq, responseData.responseCode);
            cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                console.log('insert INQLOG:', r);
            });
            return res.status(200).json(responseData);
        }
        validS11AService.selectFiCode(req.body.fiCode, responcodeEXT.NiceProductCode.S37.code).then(dataFICode => {
            if (_.isEmpty(dataFICode)) {
                preResponse = new PreResponse(responcodeEXT.RESCODEEXT.InvalidNiceProductCode.name, '', dateutil.timeStamp(), responcodeEXT.RESCODEEXT.InvalidNiceProductCode.code);

                responseData = new cics37RQSTRes(req.body, preResponse);
                // update INQLOG
                dataInqLogSave = new DataInqLogSave(getdataReq, responseData.responseCode);
                cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                    console.log('insert INQLOG:', r);
                });
                return res.status(200).json(responseData);
            }
            //End check params request

            cicCicS37Service.selectCicS37DetailReport(getdataReq, res).then(reslt => {
                console.log("result selectCicS37DetailReport: ", reslt);
                if (!_.isEmpty(reslt)) {
                    let responseSuccess = new PreResponse(responcodeEXT.RESCODEEXT.NORMAL.name, '', dateutil.timeStamp(), responcodeEXT.RESCODEEXT.NORMAL.code);
                    responseData = new cics37RSLTRes(getdataReq, responseSuccess, reslt.outputScrpTranlog[0], reslt.outputS37Detail[0]);

                    // update INQLOG
                    dataInqLogSave = new DataInqLogSave(getdataReq, responseData.responseCode);
                    cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                        console.log('insert INQLOG:', r);
                    });
                    return res.status(200).json(responseData);
                } else {
                    cicExternalService.selectScrapingStatusCodeSCRPLOG(getdataReq).then(rslt => {

                        if (_.isEmpty(rslt)) {
                            let responseUnknow = {

                                fiSessionKey: getdataReq.fiSessionKey,
                                fiCode: getdataReq.fiCode,
                                taskCode: getdataReq.taskCode,
                                niceSessionKey: getdataReq.niceSessionKey,
                                inquiryDate: getdataReq.inquiryDate,
                                responseTime: dateutil.timeStamp(),
                                responseCode: responcodeEXT.RESCODEEXT.NOTEXIST.code,
                                responseMessage: responcodeEXT.RESCODEEXT.NOTEXIST.name
                            }
                            //update INQLog
                            dataInqLogSave = new DataInqLogSave(getdataReq, responseUnknow.responseCode);
                            cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                                console.log('insert INQLOG:', r);
                            });
                            return res.status(200).json(responseUnknow);
                        }
                        else {
                            const result = rslt[0].SCRP_STAT_CD;
                            let responseMessage, responseCode;

                            if (_.isEqual(parseInt(result), 20)) {
                                responseMessage = responcodeEXT.RESCODEEXT.CICMobileAppLoginFailure.name;
                                responseCode = responcodeEXT.RESCODEEXT.CICMobileAppLoginFailure.code;
                            } else if (_.isEqual(parseInt(result), 24)) {
                                responseMessage = responcodeEXT.RESCODEEXT.CICMobileAppScrapingTargetReportNotExist.name;
                                responseCode = responcodeEXT.RESCODEEXT.CICMobileAppScrapingTargetReportNotExist.code;
                            } else if (_.isEqual(parseInt(result), 1) || _.isEqual(parseInt(result), 4)) {
                                responseMessage = responcodeEXT.RESCODEEXT.INPROCESS.name;
                                responseCode = responcodeEXT.RESCODEEXT.INPROCESS.code;
                            }
                            else {
                                responseMessage = responcodeEXT.RESCODEEXT.ETCError.name;
                                responseCode = responcodeEXT.RESCODEEXT.ETCError.code;
                            }

                            let responseSrapingStatus = {
                                fiSessionKey: getdataReq.fiSessionKey,
                                fiCode: getdataReq.fiCode,
                                taskCode: getdataReq.taskCode,
                                niceSessionKey: getdataReq.niceSessionKey,
                                inquiryDate: getdataReq.inquiryDate,
                                responseTime: dateutil.timeStamp(),
                                responseCode: responseCode,
                                responseMessage: responseMessage,
                                scrapingStatusCode: result
                            }
                            //update INQLog
                            dataInqLogSave = new DataInqLogSave(getdataReq, responseSrapingStatus.responseCode);
                            cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                                console.log('insert INQLOG:', r);
                            });
                            return res.status(200).json(responseSrapingStatus);
                        }
                    });
                }
            });
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.toString() });
    }

};