const axios = require('axios');
const logger = require('../config/logger');

const cics37RQSTReq = require('../domain/CIC_S37_RQST.request');

const cicExternalService = require('../services/cicExternal.service');
const cicCicS37Service = require('../services/cicS37.service');

const cics37RQSTRes = require('../domain/CIC_S37_RQST.response');

const validation = require('../../shared/util/validation');
const validRequest = require('../util/validateParamRequestS37');
const encryptPassword = require('../util/encryptPassword');

const util = require('../util/dateutil');
const common_service = require('../services/common.service');
const validS11AService = require('../services/validS11A.service');
const PreResponse = require('../domain/preResponse.response');
const DataInqLogSave = require('../domain/INQLOG.save');
const _ = require('lodash');
const dateutil = require('../util/dateutil');

const URI = require('../../shared/URI');
const cicB1003Req = require('../domain/cicB1003.request');
const defaultParams = require('../../shared/domain/defaultParams.request');
const responCode = require('../../shared/constant/responseCodeExternal');
const cicService = require('../../InternalAPI/services/cicInternal.service');
const utilFunction = require('../../shared/util/util');
const CICB1003Save = require('../domain/cicB1003.save');
const cicS37Service = require('../services/cicInternalS37.service');
const convertBase64 = require('../../shared/util/convertBase64ToText');
const convertPassword = require('../../shared/util/convertBase64ToText');
const getIdGetway = require('../../shared/util/getIPGateWay');
const cicTransSave = require('../../InternalAPI/domain/cicTrans.save');
const cicServiceRes = require('../../InternalAPI/services/cicInternalRes.service');
const cics37RSLTRes = require('../domain/CIC_S37_RSLT.response');

const io = require('socket.io-client');

exports.cics37Rqst = function (req, res) {
    let socket;

    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 70 * 1000
        }
        // encrypt password
        let password = encryptPassword.encrypt(req.body.loginPw);
        let niceSessionKey;

        /*
        * Checking parameters request
        * Request data
        */
        let rsCheck = validRequest.checkParamRequest(req.body);
        let preResponse, responseData, dataInqLogSave;

        if (!_.isEmpty(rsCheck)) {
            preResponse = new PreResponse(rsCheck.responseMessage, '', dateutil.timeStamp(), rsCheck.responseCode);

            responseData = new cics37RQSTRes(req.body, preResponse);
            // update INQLOG
            dataInqLogSave = new DataInqLogSave(req.body, responseData.responseCode);
            cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                console.log('insert INQLOG:', r);
            });
            logger.info(responseData);
            return res.status(200).json(responseData);
        }
        validS11AService.selectFiCode(req.body.fiCode, responCode.NiceProductCode.S37.code).then(dataFICode => {
            if (_.isEmpty(dataFICode)) {
                preResponse = new PreResponse(responCode.RESCODEEXT.InvalidNiceProductCode.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.InvalidNiceProductCode.code);

                responseData = new cics37RQSTRes(req.body, preResponse);
                // update INQLOG
                dataInqLogSave = new DataInqLogSave(req.body, responseData.responseCode);
                cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                    console.log('insert INQLOG:', r);
                });
                logger.info(responseData);
                return res.status(200).json(responseData);
            } else if (_.isEmpty(dataFICode[0]) && utilFunction.checkStatusCodeScraping(responCode.OracleError, utilFunction.getOracleCode(dataFICode))) {
                preResponse = new PreResponse(responCode.RESCODEEXT.ErrorDatabaseConnection.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.ErrorDatabaseConnection.code);

                responseData = new cics37RQSTRes(req.body, preResponse);
                logger.info(responseData);
                return res.status(500).json(responseData);
            }
            //End check params request
            common_service.getSequence().then(resSeq => {
                niceSessionKey = util.timeStamp2() + resSeq[0].SEQ;
                let fullNiceKey = responCode.NiceProductCode.S37.code + niceSessionKey;

                const getdataReq = new cics37RQSTReq(req.body, password, niceSessionKey);
                const getdataReqFullNiceKey = new cics37RQSTReq(req.body, password, fullNiceKey);
                // JSON.stringify(getdataReq);
                console.log("getdataReq=====", getdataReq);

                //Logging request
                logger.debug('Log request parameters from routes after manage request S37');
                logger.info(getdataReq);

                cicExternalService.insertSCRPLOG(getdataReq, res).then(niceSessionK => {
                    console.log("result cics11aRQST: ", niceSessionK);

                    if (!_.isEmpty(niceSessionK)) {

                        /* 
                        **call directly to scrapping service
                        */
                        let inqDt1 = req.body.inquiryDate ? req.body.inquiryDate : dateutil.getCurrentInquiryDate();
                        let inqDt2 = req.body.inquiryDate ? req.body.inquiryDate : dateutil.getCurrentInquiryDate();

                        let defaultValue = defaultParams.defaultParams(inqDt1, inqDt2, '', '', '');

                        /**
                            ** convert password
                        */

                        // get password
                        let decryptPW;
                        let _decryptPW = convertBase64.convertBase64ToText(req.body.loginPw);
                        if (14 < _decryptPW.length)
                            decryptPW = _decryptPW.substr(14);
                        else
                            decryptPW = _decryptPW;


                        var fnData = new cicB1003Req(req.body, defaultValue, decryptPW, fullNiceKey);
                        console.log('request data:', fnData);

                        axios.post(URI.cicInternalJson, fnData, config)
                            .then((body) => {
                                console.log('body:', body.data);

                                //Logging response
                                logger.debug('Logging response S37');
                                logger.info(body.data);

                                // Manual Captcha
                                if (_.isEqual('input captcha image', body.data.outJson.errMsg.toLowerCase())) {
                                    let dataStep = body.data.outJson.step_data;
                                    let imgBase64 = body.data.outJson.step_img;

                                    return res.status(200).json({ imgBase64, dataStep });
                                }

                                if (!_.isEmpty(body.data.outJson.outB1003) && body.data.outJson.outB1003.errYn == "N" && _.isEmpty(body.data.outJson.outB1003.errMsg)) {
                                    let dataB1003 = body.data.outJson.outB1003;
                                    // convert nice session key for B1003 process
                                    let niceKey = fnData.niceSessionKey;

                                    let CICB1003 = new CICB1003Save(dataB1003, niceKey);
                                    cicS37Service.insertS37Detail(CICB1003).then(resultS37 => {
                                        console.log('resultS37:', resultS37);
                                        if (1 < resultS37) {
                                            console.log('Successfully insert into S37 detail table');
                                            // update complete cic report inquiry status 10
                                            cicService.updateCICReportInquiryCompleted(niceKey, '').then(resultUpdated => {
                                                console.log("CIC report inquiry completed B1003!", resultUpdated);

                                            });

                                            /*
                                            **   update translog 
                                            */
                                            // encrypt password
                                            let password = convertPassword.convertTextToBase64(req.body.userPw);
                                            let requestParams = fnData;
                                            let responseParams = { cicNo: body.data.outJson.outB1003.cicNo };
                                            let scrplogid = 'S37' + dateutil.timeStamp();
                                            let workId = getIdGetway.getIPGateWay();

                                            let dataTransSave = new cicTransSave(requestParams, responseParams, scrplogid, workId, password, body.data.outJson.outB1003.cicNo, niceKey);
                                            cicServiceRes.updateScrapingTranslog(dataTransSave).then(() => {
                                                console.log("Updated to scraping transaction log B1003!");
                                                // return next();
                                            });

                                            /*
                                            * reponse result S37 report
                                            */
                                            let responseSuccess = new PreResponse(responCode.RESCODEEXT.NORMAL.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                                            responseData = new cics37RSLTRes(getdataReqFullNiceKey, responseSuccess, CICB1003, defaultValue, '10');

                                            // update INQLOG
                                            let dataInqLogSave = new DataInqLogSave(getdataReq, responseData.responseCode);
                                            cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                                                console.log('insert INQLOG:', r);
                                            });
                                            logger.info(responseData);
                                            return res.status(200).json(responseData);
                                        } else {
                                            let responseUnknow = new PreResponse(responCode.RESCODEEXT.OtherInternalDBError.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.OtherInternalDBError.code);
                                            responseData = new cics37RQSTRes(getdataReq, responseUnknow);

                                            // update INQLOG
                                            let dataInqLogSave = new DataInqLogSave(getdataReq, responseData.responseCode);
                                            cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                                                console.log('insert INQLOG:', r);
                                            });
                                            //Logging response
                                            logger.debug('Logging response S37');
                                            logger.info(responseData);

                                            return res.status(200).json(responseData);
                                        }
                                    });

                                }
                                else {
                                    // Log in error
                                    if (utilFunction.checkStatusCodeScraping(responCode.ScrappingResponseCodeLoginFailure, body.data.outJson.errMsg)) {
                                        if (0 <= _.indexOf([responCode.ScrappingResponseCodeLoginFailure.LoginFail1.code, responCode.ScrappingResponseCodeLoginFailure.LoginFail2.code, responCode.ScrappingResponseCodeLoginFailure.LoginFail6.code], utilFunction.getStatusScrappingCode(body.data.outJson.errMsg))) {
                                            cicService.updateScrpStatCdErrorResponseCodeScraping(fullNiceKey, responCode.ScrapingStatusCode.LoginInError.code, responCode.RESCODEEXT.CICSiteAccessFailure.code).then(rslt => {
                                                if (1 <= rslt) {
                                                    console.log('Update scraping status:' + responCode.ScrapingStatusCode.LoginInError.code + '-' + responCode.RESCODEEXT.CICSiteAccessFailure.code);

                                                    // update INQLOG
                                                    let dataInqLogSave = new DataInqLogSave(getdataReq, responCode.RESCODEEXT.CICSiteAccessFailure.code);
                                                    cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                                                        console.log('insert INQLOG:', r);
                                                    });
                                                    logger.info(selectScrapingStatusCodeSCRPLOG(getdataReqFullNiceKey, responCode.ScrapingStatusCode.LoginInError.code, responCode.RESCODEEXT.CICSiteAccessFailure.code));
                                                    return res.status(200).json(selectScrapingStatusCodeSCRPLOG(getdataReqFullNiceKey, responCode.ScrapingStatusCode.LoginInError.code, responCode.RESCODEEXT.CICSiteAccessFailure.code));
                                                }
                                                else
                                                    console.log('Update scraping status failure!');
                                            });
                                        } else if (0 <= _.indexOf([responCode.ScrappingResponseCodeLoginFailure.LoginFail3.code, responCode.ScrappingResponseCodeLoginFailure.LoginFail4.code, responCode.ScrappingResponseCodeLoginFailure.LoginFail5.code], utilFunction.getStatusScrappingCode(body.data.outJson.errMsg))) {
                                            cicService.updateScrpStatCdErrorResponseCodeScraping(fullNiceKey, responCode.ScrapingStatusCode.LoginInError.code, responCode.RESCODEEXT.CICSiteLoginFailure.code).then(rslt => {
                                                if (1 <= rslt) {
                                                    console.log('Update scraping status:' + responCode.ScrapingStatusCode.LoginInError.code + '-' + responCode.RESCODEEXT.CICSiteLoginFailure.code);

                                                    // update INQLOG
                                                    let dataInqLogSave = new DataInqLogSave(getdataReq, responCode.RESCODEEXT.CICSiteLoginFailure.code);
                                                    cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                                                        console.log('insert INQLOG:', r);
                                                    });
                                                    logger.info(selectScrapingStatusCodeSCRPLOG(getdataReqFullNiceKey, responCode.ScrapingStatusCode.LoginInError.code, responCode.RESCODEEXT.CICSiteLoginFailure.code))
                                                    return res.status(200).json(selectScrapingStatusCodeSCRPLOG(getdataReqFullNiceKey, responCode.ScrapingStatusCode.LoginInError.code, responCode.RESCODEEXT.CICSiteLoginFailure.code));
                                                }
                                                else
                                                    console.log('Update scraping status failure!');
                                            });
                                        } else if (0 <= _.indexOf([responCode.ScrappingResponseCodeLoginFailure.LoginFail7.code], utilFunction.getStatusScrappingCode(body.data.outJson.errMsg))) {
                                            cicService.updateScrpStatCdErrorResponseCodeScraping(fullNiceKey, responCode.ScrapingStatusCode.LoginInError.code, responCode.RESCODEEXT.S37ReportScreenAccsError.code).then(rslt => {
                                                if (1 <= rslt) {
                                                    console.log('Update scraping status:' + responCode.ScrapingStatusCode.LoginInError.code + '-' + responCode.RESCODEEXT.S37ReportScreenAccsError.code);

                                                    // update INQLOG
                                                    let dataInqLogSave = new DataInqLogSave(getdataReq, responCode.RESCODEEXT.S37ReportScreenAccsError.code);
                                                    cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                                                        console.log('insert INQLOG:', r);
                                                    });

                                                    logger.info(selectScrapingStatusCodeSCRPLOG(getdataReqFullNiceKey, responCode.ScrapingStatusCode.LoginInError.code, responCode.RESCODEEXT.S37ReportScreenAccsError.code));
                                                    return res.status(200).json(selectScrapingStatusCodeSCRPLOG(getdataReqFullNiceKey, responCode.ScrapingStatusCode.LoginInError.code, responCode.RESCODEEXT.S37ReportScreenAccsError.code));
                                                }
                                                else
                                                    console.log('Update scraping status failure!');
                                            });
                                        } else {
                                            cicService.updateScrpStatCdErrorResponseCodeScraping(fullNiceKey, responCode.ScrapingStatusCode.LoginInError.code, responCode.RESCODEEXT.ETCError.code).then(rslt => {
                                                if (1 <= rslt) {
                                                    console.log('Update scraping status:' + responCode.ScrapingStatusCode.LoginInError.code + '-' + responCode.RESCODEEXT.ETCError.code);

                                                    // update INQLOG
                                                    let dataInqLogSave = new DataInqLogSave(getdataReq, responCode.RESCODEEXT.ETCError.code);
                                                    cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                                                        console.log('insert INQLOG:', r);
                                                    });

                                                    logger.info(selectScrapingStatusCodeSCRPLOG(getdataReqFullNiceKey, responCode.ScrapingStatusCode.LoginInError.code, responCode.RESCODEEXT.ETCError.code));
                                                    return res.status(200).json(selectScrapingStatusCodeSCRPLOG(getdataReqFullNiceKey, responCode.ScrapingStatusCode.LoginInError.code, responCode.RESCODEEXT.ETCError.code));
                                                }
                                                else
                                                    console.log('Update scraping status failure!');
                                            });
                                        }
                                    }
                                    // CIC report result inquiry error S37
                                    else if (utilFunction.checkStatusCodeScraping(responCode.ScrappingResponseCodeCicReportResultINQS37Error, body.data.outJson.outB1003.errMsg) || utilFunction.checkStatusCodeScraping(responCode.ScrappingResponseCodeCicReportResultINQS37Error, body.data.outJson.errMsg)) {
                                        if (0 <= _.indexOf([responCode.ScrappingResponseCodeCicReportResultINQS37Error.CicReportINQError1.code, responCode.ScrappingResponseCodeCicReportResultINQS37Error.CicReportINQError2.code
                                            , responCode.ScrappingResponseCodeCicReportResultINQS37Error.CicReportINQError102.code, responCode.ScrappingResponseCodeCicReportResultINQS37Error.CicReportINQError103.code
                                            , responCode.ScrappingResponseCodeCicReportResultINQS37Error.CicReportINQError104.code, responCode.ScrappingResponseCodeCicReportResultINQS37Error.CicReportINQError105.code
                                            , responCode.ScrappingResponseCodeCicReportResultINQS37Error.CicReportINQError106.code, responCode.ScrappingResponseCodeCicReportResultINQS37Error.CicReportINQError107.code], utilFunction.getStatusScrappingCode(body.data.outJson.outB1003.errMsg, body.data.outJson.errMsg))) {
                                            cicService.updateScrpStatCdErrorResponseCodeScraping(fullNiceKey, responCode.ScrapingStatusCode.CicReportInqError.code, responCode.RESCODEEXT.S37ReportScreenAccsError.code).then(rslt => {
                                                if (1 <= rslt) {
                                                    console.log('Update scraping status B0003:' + responCode.ScrapingStatusCode.CicReportInqError.code + '-' + responCode.RESCODEEXT.S37ReportScreenAccsError.code);

                                                    // update INQLOG
                                                    let dataInqLogSave = new DataInqLogSave(getdataReq, responCode.RESCODEEXT.S37ReportScreenAccsError.code);
                                                    cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                                                        console.log('insert INQLOG:', r);
                                                    });

                                                    logger.info(selectScrapingStatusCodeSCRPLOG(getdataReqFullNiceKey, responCode.ScrapingStatusCode.CicReportInqError.code, responCode.RESCODEEXT.S37ReportScreenAccsError.code));
                                                    return res.status(200).json(selectScrapingStatusCodeSCRPLOG(getdataReqFullNiceKey, responCode.ScrapingStatusCode.CicReportInqError.code, responCode.RESCODEEXT.S37ReportScreenAccsError.code));
                                                }
                                                else
                                                    console.log('Update scraping status failure!');
                                            });
                                        } else if (0 <= _.indexOf([responCode.ScrappingResponseCodeCicReportResultINQS37Error.CicReportINQError3.code, responCode.ScrappingResponseCodeCicReportResultINQS37Error.CicReportINQError201.code], utilFunction.getStatusScrappingCode(body.data.outJson.outB1003.errMsg, body.data.outJson.errMsg))) {
                                            cicService.updateScrpStatCdErrorResponseCodeScraping(fullNiceKey, responCode.ScrapingStatusCode.CicIdInqError.code, responCode.RESCODEEXT.NoMatchingCICIDWithNalID.code).then(rslt => {
                                                if (1 <= rslt) {
                                                    console.log('Update scraping status:' + responCode.ScrapingStatusCode.CicIdInqError.code + responCode.RESCODEEXT.NoMatchingCICIDWithNalID.code);
                                                    // update INQLOG
                                                    let dataInqLogSave = new DataInqLogSave(getdataReq, responCode.RESCODEEXT.NoMatchingCICIDWithNalID.code);
                                                    cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                                                        console.log('insert INQLOG:', r);
                                                    });

                                                    logger.info(selectScrapingStatusCodeSCRPLOG(getdataReqFullNiceKey, responCode.ScrapingStatusCode.CicIdInqError.code, responCode.RESCODEEXT.NoMatchingCICIDWithNalID.code));
                                                    return res.status(200).json(selectScrapingStatusCodeSCRPLOG(getdataReqFullNiceKey, responCode.ScrapingStatusCode.CicIdInqError.code, responCode.RESCODEEXT.NoMatchingCICIDWithNalID.code));
                                                }
                                                else
                                                    console.log('Update scraping status failure!');
                                            });
                                        } else if (0 <= _.indexOf([responCode.ScrappingResponseCodeCicReportResultINQS37Error.CicReportINQError101.code], utilFunction.getStatusScrappingCode(body.data.outJson.outB1003.errMsg, body.data.outJson.errMsg))) {
                                            cicService.updateScrpStatCdErrorResponseCodeScraping(fullNiceKey, responCode.ScrapingStatusCode.CicIdInqError.code, responCode.RESCODEEXT.NotUniquePersonInCIC.code).then(rslt => {
                                                if (1 <= rslt) {
                                                    console.log('Update scraping status:' + responCode.ScrapingStatusCode.CicIdInqError.code + responCode.RESCODEEXT.NotUniquePersonInCIC.code);
                                                    // update INQLOG
                                                    let dataInqLogSave = new DataInqLogSave(getdataReq, responCode.RESCODEEXT.NotUniquePersonInCIC.code);
                                                    cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                                                        console.log('insert INQLOG:', r);
                                                    });

                                                    logger.info(selectScrapingStatusCodeSCRPLOG(getdataReqFullNiceKey, responCode.ScrapingStatusCode.CicIdInqError.code, responCode.RESCODEEXT.NotUniquePersonInCIC.code));
                                                    return res.status(200).json(selectScrapingStatusCodeSCRPLOG(getdataReqFullNiceKey, responCode.ScrapingStatusCode.CicIdInqError.code, responCode.RESCODEEXT.NotUniquePersonInCIC.code));
                                                }
                                                else
                                                    console.log('Update scraping status failure!');
                                            });
                                        } else if (0 <= _.indexOf([responCode.ScrappingResponseCodeCicReportResultINQS37Error.CicReportINQError108.code], utilFunction.getStatusScrappingCode(body.data.outJson.outB1003.errMsg, body.data.outJson.errMsg))) {
                                            cicService.updateScrpStatCdErrorResponseCodeScraping(fullNiceKey, responCode.ScrapingStatusCode.CicReportInqError.code, responCode.RESCODEEXT.CaptchaProcessFailure.code).then(rslt => {
                                                if (1 <= rslt) {
                                                    console.log('Update scraping status:' + responCode.ScrapingStatusCode.CicReportInqError.code + responCode.RESCODEEXT.CaptchaProcessFailure.code);
                                                    // update INQLOG
                                                    let dataInqLogSave = new DataInqLogSave(getdataReq, responCode.RESCODEEXT.CaptchaProcessFailure.code);
                                                    cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                                                        console.log('insert INQLOG:', r);
                                                    });

                                                    logger.info(selectScrapingStatusCodeSCRPLOG(getdataReqFullNiceKey, responCode.ScrapingStatusCode.CicReportInqError.code, responCode.RESCODEEXT.CaptchaProcessFailure.code));
                                                    return res.status(200).json(selectScrapingStatusCodeSCRPLOG(getdataReqFullNiceKey, responCode.ScrapingStatusCode.CicReportInqError.code, responCode.RESCODEEXT.CaptchaProcessFailure.code));
                                                }
                                                else
                                                    console.log('Update scraping status failure!');
                                            });
                                        }
                                        else {
                                            cicService.updateScrpStatCdErrorResponseCodeScraping(fullNiceKey, responCode.ScrapingStatusCode.OtherError.code, responCode.RESCODEEXT.ETCError.code).then(rslt => {
                                                if (1 <= rslt) {
                                                    console.log('Update scraping status:' + responCode.ScrapingStatusCode.OtherError.code + '-' + responCode.RESCODEEXT.ETCError.code);

                                                    // update INQLOG
                                                    let dataInqLogSave = new DataInqLogSave(getdataReq, responCode.RESCODEEXT.ETCError.code);
                                                    cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                                                        console.log('insert INQLOG:', r);
                                                    });

                                                    logger.info(selectScrapingStatusCodeSCRPLOG(getdataReqFullNiceKey, responCode.ScrapingStatusCode.OtherError.code, responCode.RESCODEEXT.ETCError.code));
                                                    return res.status(200).json(selectScrapingStatusCodeSCRPLOG(getdataReqFullNiceKey, responCode.ScrapingStatusCode.OtherError.code, responCode.RESCODEEXT.ETCError.code));
                                                }
                                                else
                                                    console.log('Update scraping status failure!');
                                            });

                                        }
                                    }
                                    else {
                                        cicService.updateScrpStatCdErrorResponseCodeScraping(fullNiceKey, responCode.ScrapingStatusCode.OtherError.code, responCode.RESCODEEXT.ETCError.code).then(rslt => {
                                            if (1 <= rslt) {
                                                console.log('Update scraping status:' + responCode.ScrapingStatusCode.OtherError.code + '-' + responCode.RESCODEEXT.ETCError.code);

                                                // update INQLOG
                                                let dataInqLogSave = new DataInqLogSave(getdataReq, responCode.RESCODEEXT.ETCError.code);
                                                cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                                                    console.log('insert INQLOG:', r);
                                                });

                                                logger.info(selectScrapingStatusCodeSCRPLOG(getdataReqFullNiceKey, responCode.ScrapingStatusCode.OtherError.code, responCode.RESCODEEXT.ETCError.code));
                                                return res.status(200).json(selectScrapingStatusCodeSCRPLOG(getdataReqFullNiceKey, responCode.ScrapingStatusCode.OtherError.code, responCode.RESCODEEXT.ETCError.code));
                                            }
                                            else
                                                console.log('Update scraping status failure!');
                                        });

                                    }

                                }

                            }).catch((error) => {
                                console.log("error scraping service S37 report~~", error);
                                //Update ScrpModCd 00
                                cicService.updateScrpStatCdErrorResponseCodeScraping(fullNiceKey, responCode.ScrapingStatusCode.OtherError.code, responCode.RESCODEEXT.TimeoutError.code).then(rslt => {
                                    if (1 <= rslt)
                                        console.log("Update scraping status:", responCode.ScrapingStatusCode.OtherError.code + '-' + responCode.RESCODEEXT.TimeoutError.code);
                                    else
                                        console.log('Update scraping status failure!');


                                    let responseTimeOut = new PreResponse(responCode.RESCODEEXT.TimeoutError.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.TimeoutError.code);
                                    responseData = new cics37RQSTRes(getdataReq, responseTimeOut);

                                    logger.info(responseData);
                                    return res.status(200).json(responseData);
                                });
                            });
                    } else {
                        let responseUnknow = new PreResponse(responCode.RESCODEEXT.UNKNOWOtherError.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.UNKNOWOtherError.code);
                        responseData = new cics37RQSTRes(getdataReq, responseUnknow);

                        logger.info(responseData);
                        return res.status(200).json(responseData);
                    }
                });
            });
        });

    } catch (err) {
        console.log(err);

        //conneciton socket
        socket = io.connect(URI.socket_url, { secure: true, rejectUnauthorized: false });

        // emit socket
        socket.emit('External_message', { responseTime: dateutil.getTimeHours(), responseMessage: 'Error CIC_S37_RQST' });
        // Close socket
        socket.emit('end');
        logger.error(err.toString());
        return res.status(500).json({ error: err.toString() });
    }
};

/*
** response error code
*/
function selectScrapingStatusCodeSCRPLOG(getdataReqFullNiceKey, scrapingStatusCode, rsp_cd) {
    let responseCode, responseMessage;
    _.forEach(responCode.RESCODEEXT, res => {
        _.forEach(res, (val, key) => {
            if (_.isEqual(val, rsp_cd)) {
                console.log('response nice code:', res.code + '-' + res.name);
                responseMessage = res.name;
                responseCode = res.code;
            }
        });
    });

    let responseSrapingStatus = {
        fiSessionKey: getdataReqFullNiceKey.fiSessionKey,
        fiCode: getdataReqFullNiceKey.fiCode,
        taskCode: getdataReqFullNiceKey.taskCode,
        loginId: getdataReqFullNiceKey.loginId,
        taxCode: getdataReqFullNiceKey.taxCode ? getdataReqFullNiceKey.taxCode : '',
        natId: getdataReqFullNiceKey.natId ? getdataReqFullNiceKey.natId : '',
        oldNatId: getdataReqFullNiceKey.oldNatId ? getdataReqFullNiceKey.oldNatId : '',
        passportNumber: getdataReqFullNiceKey.passportNumber ? getdataReqFullNiceKey.passportNumber : '',
        cicId: getdataReqFullNiceKey.cicId ? getdataReqFullNiceKey.cicId : '',
        infoProvConcent: getdataReqFullNiceKey.infoProvConcent,
        niceSessionKey: getdataReqFullNiceKey.niceSessionKey,
        inquiryDate: getdataReqFullNiceKey.inquiryDate,
        responseTime: dateutil.timeStamp(),
        responseCode: responseCode,
        responseMessage: responseMessage,
        scrapingStatusCode: scrapingStatusCode
    }


    return responseSrapingStatus;
}


const cics37RSLTReq = require('../domain/CIC_S37_RSLT.request');
const cics37RSLTManualRes = require('../domain/CIC_S37_RSLT.manual.res');
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

            responseData = new cics37RQSTRes(getdataReq, preResponse);
            // update INQLOG
            dataInqLogSave = new DataInqLogSave(getdataReq, responseData.responseCode);
            cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                console.log('insert INQLOG:', r);
            });
            logger.info(responseData);
            return res.status(200).json(responseData);
        }
        validS11AService.selectFiCode(req.body.fiCode, responCode.NiceProductCode.S37.code).then(dataFICode => {
            if (_.isEmpty(dataFICode)) {
                preResponse = new PreResponse(responCode.RESCODEEXT.InvalidNiceProductCode.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.InvalidNiceProductCode.code);

                responseData = new cics37RQSTRes(getdataReq, preResponse);
                // update INQLOG
                dataInqLogSave = new DataInqLogSave(getdataReq, responseData.responseCode);
                cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                    console.log('insert INQLOG:', r);
                });
                logger.info(responseData);
                return res.status(200).json(responseData);
            }
            else if (_.isEmpty(dataFICode[0]) && utilFunction.checkStatusCodeScraping(responCode.OracleError, utilFunction.getOracleCode(dataFICode))) {
                preResponse = new PreResponse(responCode.RESCODEEXT.ErrorDatabaseConnection.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.ErrorDatabaseConnection.code);

                responseData = new cics37RQSTRes(req.body, preResponse);

                logger.info(responseData);
                return res.status(500).json(responseData);
            }
            //End check params request

            cicCicS37Service.selectCicS37DetailReport(getdataReq, res).then(reslt => {
                console.log("result selectCicS37DetailReport: ", reslt);
                if (!_.isEmpty(reslt)) {
                    let responseSuccess = new PreResponse(responCode.RESCODEEXT.NORMAL.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                    responseData = new cics37RSLTManualRes(getdataReq, responseSuccess, reslt.outputScrpTranlog[0], reslt.outputS37Detail[0]);

                    // update INQLOG
                    dataInqLogSave = new DataInqLogSave(getdataReq, responseData.responseCode);
                    cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                        console.log('insert INQLOG:', r);
                    });
                    logger.info(responseData);
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
                            logger.info(responseUnknow);
                            return res.status(200).json(responseUnknow);
                        }
                        else {
                            const result = rslt[0].SCRP_STAT_CD;
                            let responseMessage, responseCode;
                            let rsp_cd = rslt[0].RSP_CD;

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
                            }
                            else {

                                if (_.isEqual(parseInt(result), 20)) {
                                    responseMessage = responCode.RESCODEEXT.CICMobileAppLoginFailure.name;
                                    responseCode = responCode.RESCODEEXT.CICMobileAppLoginFailure.code;
                                } else if (_.isEqual(parseInt(result), 24)) {
                                    responseMessage = responCode.RESCODEEXT.CICMobileAppScrapingTargetReportNotExist.name;
                                    responseCode = responCode.RESCODEEXT.CICMobileAppScrapingTargetReportNotExist.code;
                                } else if (_.isEqual(parseInt(result), 1) || _.isEqual(parseInt(result), 4)) {
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
                            logger.info(responseSrapingStatus);
                            return res.status(200).json(responseSrapingStatus);
                        }
                    });
                }
            });
        });

    } catch (error) {
        console.log(error);
        logger.error(error.toString());
        return res.status(500).json({ error: error.toString() });
    }

};