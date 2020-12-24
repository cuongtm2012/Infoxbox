const logger = require('../config/logger');

const OKF_SPL_RQSTReq = require('../domain/OKF_SPL_RQST.request');
const OKF_SPL_RQSTRes = require('../domain/OKF_SPL_RQST.response');
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
const DataInqLogSave = require('../domain/INQLOG.save');
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

        if (!_.isEmpty(rsCheck)) {
            preResponse = new PreResponse(rsCheck.responseMessage, '', dateutil.timeStamp(), rsCheck.responseCode);

            responseData = new OKF_SPL_RQSTRes(req.body, preResponse);
            // update INQLOG
            dataInqLogSave = new DataInqLogSave(req.body, responseData.responseCode);
            cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                console.log('insert INQLOG:', r);
            });
            return res.status(200).json(responseData);
        }
        validS11AService.selectFiCode(req.body.fiCode, responCode.NiceProductCode.OKF_SPL_RQST.code).then(dataFICode => {
			console.log('selectFiCode:');
            if (_.isEmpty(dataFICode)) {
                preResponse = new PreResponse(responCode.RESCODEEXT.InvalidNiceProductCode.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.InvalidNiceProductCode.code);

                responseData = new OKF_SPL_RQSTRes(req.body, preResponse);
                // update INQLOG
                dataInqLogSave = new DataInqLogSave(req.body, responseData.responseCode);
                cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                    console.log('insert INQLOG:', r);
                });
                return res.status(200).json(responseData);
            }
            else if (_.isEmpty(dataFICode[0]) && utilFunction.checkStatusCodeScraping(responCode.OracleError, utilFunction.getOracleCode(dataFICode))) {
                preResponse = new PreResponse(responCode.RESCODEEXT.ErrorDatabaseConnection.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.ErrorDatabaseConnection.code);

                responseData = new OKF_SPL_RQSTRes(req.body, preResponse);

                return res.status(500).json(responseData);
            }
            //End check params request

            common_service.getSequence().then(resSeq => {
                niceSessionKey = util.timeStamp2() + resSeq[0].SEQ;

                const getdataReq = new OKF_SPL_RQSTReq(req.body, niceSessionKey);
                //JSON.stringify(getdataReq);
                console.log("getdataReq = ", getdataReq);

                //logging request
                logger.debug('log request parameters from routes after manage request');
                logger.info(req.body);

				//calculated simple limit
                okFVNService.getSimpleLimit(getdataReq, res).then(data => {
                    console.log("result OKF_SPL_RQST: ", data);

                    let responseSuccess = new PreResponse(responCode.RESCODEEXT.NORMAL.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                    responseData = new OKF_SPL_RQSTRes(getdataReq, responseSuccess);
					responseData.simpleLimit = data
                    // update INQLOG
                    dataInqLogSave = new DataInqLogSave(getdataReq, responseData.responseCode);
                    cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                        console.log('insert INQLOG:', r);
                    });
					//console.log("responseData = ", responseData);
                    return res.status(200).json(responseData);
                });

            });
        });

    } catch (err) {
        //conneciton socket
        socket = io.connect(URI.socket_url, { secure: true, rejectUnauthorized: false, multiplex: true });

        // emit socket
        socket.emit('External_message', { responseTime: dateutil.getTimeHours(), responseMessage: 'Error OKF_SPL_RQST' });
        // Close socket
        socket.emit('end');

        return res.status(500).json({ error: err.toString() });
    }
};

const RCS_M01_RQSTReq = require('../domain/RCS_M01_RQST.request');
const RCS_M01_RQSTRes = require('../domain/RCS_M01_RQST.response');
const validRCS_M01_RQST = require('../util/validateRCSM01ParamRequest');

exports.rcs_OK1_RQST = function (req, res) {

    try {
        const getdataReq = new RCS_M01_RQSTReq(req.body);

        // check parameters request
        // request data
        let rsCheck = validRCS_M01_RQST.checkRCSM01ParamRequest(getdataReq);
        let preResponse, responseData, dataInqLogSave;

        if (!validation.isEmptyJson(rsCheck)) {
            preResponse = new PreResponse(rsCheck.responseMessage, '', dateutil.timeStamp(), rsCheck.responseCode);

            responseData = new RCS_M01_RQSTRes(getdataReq, preResponse, {}, {}, {});
            // update INQLOG
            dataInqLogSave = new DataInqLogSave(getdataReq, responseData.responseCode);
            cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                console.log('insert INQLOG:', r);
            });
            return res.status(200).json(responseData);
        }
        validS11AService.selectFiCode(req.body.fiCode, responCode.NiceProductCode.Mobile.code).then(dataFICode => {
            if (_.isEmpty(dataFICode)) {
                preResponse = new PreResponse(responCode.RESCODEEXT.InvalidNiceProductCode.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.InvalidNiceProductCode.code);

                responseData = new RCS_M01_RQSTRes(req.body, preResponse, {}, {}, {});
                // update INQLOG
                dataInqLogSave = new DataInqLogSave(getdataReq, responseData.responseCode);
                cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                    console.log('insert INQLOG:', r);
                });
                return res.status(200).json(responseData);
            }
            else if (_.isEmpty(dataFICode[0]) && utilFunction.checkStatusCodeScraping(responCode.OracleError, utilFunction.getOracleCode(dataFICode))) {
                preResponse = new PreResponse(responCode.RESCODEEXT.ErrorDatabaseConnection.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.ErrorDatabaseConnection.code);

                responseData = new RCS_M01_RQSTRes(req.body, preResponse, {}, {}, {});

                return res.status(500).json(responseData);
            }
            // end check params reqest

            cicMobileService.selectCicMobileDetailReport(getdataReq, res).then(reslt => {
                console.log("result selectSCRPTRLOG: ", reslt);
                if (!validation.isEmptyStr(reslt)) {
                    let responseSuccess = new PreResponse(responCode.RESCODEEXT.NORMAL.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                    responseData = new RCS_M01_RQSTRes(getdataReq, responseSuccess, reslt[0], {}, {});

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
                                responseCode: responCode.RESCODEEXT.NOTEXIST.code,
                                responseMessage: responCode.RESCODEEXT.NOTEXIST.name
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
                                _.forEach(responCode.RESCODEEXT, res => {
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
                                    responseMessage = responCode.RESCODEEXT.CICSiteLoginFailure.name;
                                    responseCode = responCode.RESCODEEXT.CICSiteLoginFailure.code;
                                } else if (_.isEqual(parseInt(result), 21) || _.isEqual(parseInt(result), 22)) {
                                    responseMessage = responCode.RESCODEEXT.CICReportInqFailure.name;
                                    responseCode = responCode.RESCODEEXT.CICReportInqFailure.code;
                                } else if (_.isEqual(parseInt(result), 23) || _.isEqual(parseInt(result), 24)) {
                                    responseMessage = responCode.RESCODEEXT.CICReportInqFailureTimeout.name;
                                    responseCode = responCode.RESCODEEXT.CICReportInqFailureTimeout.code;
                                }
                                else if (_.isEqual(parseInt(result), 1) || _.isEqual(parseInt(result), 4)) {
                                    responseMessage = responCode.RESCODEEXT.INPROCESS.name;
                                    responseCode = responCode.RESCODEEXT.INPROCESS.code;
                                }
                                else {
                                    responseMessage = responCode.RESCODEEXT.ETCError.name;
                                    responseCode = responCode.RESCODEEXT.ETCError.code;
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