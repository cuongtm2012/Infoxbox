const logger = require('../config/logger');

const cicMacrRQSTReq = require('../domain/CIC_MACR_RQST.request');

const cicMacrRQSTRes = require('../domain/CIC_MACR_RQST.response');

const cicMobileService = require('../services/cicMobile.service');

const validation = require('../../shared/util/validation');

const validRequest = require('../util/validateMacrParamRequest');

const util = require('../util/dateutil');

const common_service = require('../services/common.service');

const responcodeEXT = require('../../shared/constant/responseCodeExternal');
const _ = require('lodash');
const validS11AService = require('../services/validS11A.service');
const PreResponse = require('../domain/preResponse.response');
const dateutil = require('../util/dateutil');
const DataInqLogSave = require('../domain/INQLOG.save');
const cicExternalService = require('../services/cicExternal.service');

exports.cicMACRRQST = function (req, res, next) {

    try {
        let niceSessionKey;
        let preResponse, responseData, dataInqLogSave;

        /*
        Checking parameters request
        Request data
        */
        let rsCheck = validRequest.checkMacrParamRequest(req.body);

        if (!_.isEmpty(rsCheck)) {
            preResponse = new PreResponse(rsCheck.responseMessage, '', dateutil.timeStamp(), rsCheck.responseCode);

            responseData = new cicMacrRQSTRes(req.body, preResponse);
            // update INQLOG
            dataInqLogSave = new DataInqLogSave(req.body, responseData.responseCode);
            cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                console.log('insert INQLOG:', r);
            });
            return res.status(200).json(responseData);
        }
        validS11AService.selectFiCode(req.body.fiCode, responcodeEXT.NiceProductCode.Mobile.code).then(dataFICode => {
            if (_.isEmpty(dataFICode)) {
                preResponse = new PreResponse(responcodeEXT.RESCODEEXT.InvalidNiceProductCode.name, '', dateutil.timeStamp(), responcodeEXT.RESCODEEXT.InvalidNiceProductCode.code);

                responseData = new cicMacrRQSTRes(req.body, preResponse);
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

                const getdataReq = new cicMacrRQSTReq(req.body, niceSessionKey);
                //JSON.stringify(getdataReq);
                console.log("getdataReq = ", getdataReq);

                //logging request
                logger.debug('log request parameters from routes after manage request');
                logger.info(req.body);

                cicMobileService.insertSCRPLOG(getdataReq, res).then(niceSessionK => {
                    console.log("result cicMacrRQST: ", niceSessionK);

                    if (!_.isEmpty(niceSessionK) && niceSessionK.length <= 25) {
                        let responseSuccess = new PreResponse(responcodeEXT.RESCODEEXT.NORMAL.name, niceSessionK, dateutil.timeStamp(), responcodeEXT.RESCODEEXT.NORMAL.code);
                        responseData = new cicMacrRQSTRes(getdataReq, responseSuccess);
                    } else {
                        let responseUnknow = new PreResponse(responcodeEXT.RESCODEEXT.UNKNOW.name, '', dateutil.timeStamp(), responcodeEXT.RESCODEEXT.UNKNOW.code);
                        responseData = new cicMacrRQSTRes(getdataReq, responseUnknow);
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
        return res.status(500).json({ error: err.toString() });
    }
};

const cicMacrRSLTReq = require('../domain/CIC_MACR_RSLT.request');
const cicMacrRSLTRes = require('../domain/CIC_MACR_RSLT.response');
const validMacrRSLT = require('../util/validRequestMACRResponse');

exports.cicMACRRSLT = function (req, res) {

    try {
        const getdataReq = new cicMacrRSLTReq(req.body);

        // check parameters request
        // request data
        let rsCheck = validMacrRSLT.checkParamRequestForResponse(getdataReq);
        let preResponse, responseData, dataInqLogSave;

        if (!validation.isEmptyJson(rsCheck)) {
            preResponse = new PreResponse(rsCheck.responseMessage, '', dateutil.timeStamp(), rsCheck.responseCode);

            responseData = new cicMacrRSLTRes(getdataReq, preResponse, {});
            // update INQLOG
            dataInqLogSave = new DataInqLogSave(getdataReq, responseData.responseCode);
            cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                console.log('insert INQLOG:', r);
            });
            return res.status(200).json(responseData);
        }
        validS11AService.selectFiCode(req.body.fiCode, responcodeEXT.NiceProductCode.Mobile.code).then(dataFICode => {
            if (_.isEmpty(dataFICode)) {
                preResponse = new PreResponse(responcodeEXT.RESCODEEXT.InvalidNiceProductCode.name, '', dateutil.timeStamp(), responcodeEXT.RESCODEEXT.InvalidNiceProductCode.code);

                responseData = new cicMacrRSLTRes(req.body, preResponse);
                // update INQLOG
                dataInqLogSave = new DataInqLogSave(getdataReq, responseData.responseCode);
                cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                    console.log('insert INQLOG:', r);
                });
                return res.status(200).json(responseData);
            }
            // end check params reqest

            cicMobileService.selectCicMobileDetailReport(getdataReq, res).then(reslt => {
                console.log("result selectSCRPTRLOG: ", reslt);
                if (!validation.isEmptyStr(reslt)) {
                    let responseSuccess = new PreResponse(responcodeEXT.RESCODEEXT.NORMAL.name, '', dateutil.timeStamp(), responcodeEXT.RESCODEEXT.NORMAL.code);
                    responseData = new cicMacrRSLTRes(getdataReq, responseSuccess, reslt[0]);

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
                            let rsp_cd = rslt[0].RSP_CD;
                            let responseMessage, responseCode;

                            if (!_.isEmpty(rsp_cd)) {
                                _.forEach(responcodeEXT.RESCODEEXT, res => {
                                    _.forEach(res, (val, key) => {
                                        if (_.isEqual(val, rsp_cd)) {
                                            console.log('response nice code:', res.code + '-' + res.name);
                                            responseMessage = res.name;
                                            responseCode = res.code;
                                        }
                                    });
                                });
                            } else {

                                if (_.isEqual(parseInt(result), 20)) {
                                    responseMessage = responcodeEXT.RESCODEEXT.CICSiteLoginFailure.name;
                                    responseCode = responcodeEXT.RESCODEEXT.CICSiteLoginFailure.code;
                                } else if (_.isEqual(parseInt(result), 21) || _.isEqual(parseInt(result), 22)) {
                                    responseMessage = responcodeEXT.RESCODEEXT.CICReportInqFailure.name;
                                    responseCode = responcodeEXT.RESCODEEXT.CICReportInqFailure.code;
                                } else if (_.isEqual(parseInt(result), 23) || _.isEqual(parseInt(result), 24)) {
                                    responseMessage = responcodeEXT.RESCODEEXT.CICReportInqFailureTimeout.name;
                                    responseCode = responcodeEXT.RESCODEEXT.CICReportInqFailureTimeout.code;
                                }
                                else if (_.isEqual(parseInt(result), 1) || _.isEqual(parseInt(result), 4)) {
                                    responseMessage = responcodeEXT.RESCODEEXT.INPROCESS.name;
                                    responseCode = responcodeEXT.RESCODEEXT.INPROCESS.code;
                                }
                                else {
                                    responseMessage = responcodeEXT.RESCODEEXT.ETCError.name;
                                    responseCode = responcodeEXT.RESCODEEXT.ETCError.code;
                                }
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