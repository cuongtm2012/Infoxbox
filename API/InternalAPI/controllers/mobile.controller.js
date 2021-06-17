const axios = require('axios');
const URI = require('../../shared/URI');
const _ = require('lodash');
const cicMobileService = require('../services/cicMobile.service');
const cicService = require('../services/cicInternal.service');
const cicServiceRes = require('../services/cicInternalRes.service');
const cicTransA001Save = require('../domain/cicTransA0001.save');
const CicA0001Save = require('../domain/cicA0001.save');
const CicA0001SaveV2_0 = require('../domain/cicA0001v2.save');
const utilFunction = require('../../shared/util/util');
const responCode = require('../../shared/constant/responseCodeExternal');
const io = require('socket.io-client');
const logger = require('../config/logger');

exports.mobileCicController = function (req, res, next) {
    try {
        //conneciton socket
        const socket = io.connect(URI.socket_mobile_url, { secure: true, rejectUnauthorized: false });

        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 2 * 60 * 1000
        }
        //Logging request
        logger.info('Log request parameters request to Scrap');
        logger.info(req.body)

        axios.post(URI.cicInternalJson, req.body, config)
            .then((body) => {
                let _dataReport, dataReportSave;

                //Logging response
                logger.debug('Log response from scrapping service');
                logger.info(body.data);

                if (body.data && body.data.outJson && body.data.outJson.errMsg && _.isEqual('input captcha image', body.data.outJson.errMsg.toLowerCase())) {
                    let dataStep = body.data.outJson.step_data;
                    let imgBase64 = body.data.outJson.step_img;

                    return res.status(200).json({ imgBase64, dataStep });
                }
                else if (body.data && body.data.outJson && body.data.outJson.outA0001 && body.data.outJson.outA0001.errYn && _.isEqual('N', (body.data.outJson.outA0001.errYn))) {
                    console.log('result A0001 Mobile report :', body.data.outJson.outA0001.list)
                    if (!_.isEmpty(body.data.outJson.outA0001.list[0]) && (!_.isEmpty(body.data.outJson.outA0001.list[0].dataReport) || !_.isEmpty(body.data.outJson.outA0001.list[0].dataReportNew))) {
                        _dataReport = body.data.outJson.outA0001.list[0].dataReportNew ? JSON.parse(body.data.outJson.outA0001.list[0].dataReportNew) : JSON.parse(body.data.outJson.outA0001.list[0].dataReport);
                        logger.info(_dataReport);
                        if (body.data.outJson.outA0001.list[0].dataReportNew)
                            dataReportSave = new CicA0001SaveV2_0(_dataReport, req.body);
                        else
                            dataReportSave = new CicA0001Save(_dataReport, req.body);
                        logger.info(dataReportSave);
                        cicMobileService.insertMobileReportA0001(dataReportSave).then(rowInsert => {
                            if (1 < rowInsert) {
                                console.log('insert successfully A0001');
                                // update complete cic report inquiry status 10
                                cicService.updateCICReportInquiryCompleted(req.body.niceSessionKey, req.body.svcCd).then(resultUpdated => {
                                    console.log("CIC report inquiry completed!", resultUpdated);
                                });

                                /*
                                **   update translog 
                                */
                                // encrypt password
                                let dataTransSave = new cicTransA001Save(req.body, dataReportSave, body.data.outJson.errMsg);
                                cicServiceRes.updateScrapingTranslog(dataTransSave).then((r) => {
                                    if (1 <= r)
                                        console.log("Updated to scraping transaction log A0001! successful");
                                    else
                                        console.log("Updated to scraping transaction log A0001! Failured");
                                });

                                // emit socket
                                socket.emit('mesage_A0001', { responseMessage: true });
                                // close connection socket
                                socket.emit('end');
                            }
                            else {
                                console.log('insert failure A0001');
                                cicMobileService.updateScrpModCdTryCntHasNoResponseFromScraping06(req.body.niceSessionKey).then(() => {
                                    console.log("A0001 update SCRP_MOD_CD = 06 ");
                                    return next();
                                });
                            }
                        });
                    } else {
                        cicService.updateScrpStatCdErrorResponseCodeScraping(req.body.niceSessionKey, responCode.ScrapingStatusCode.CicReportResultNotExist.code, responCode.RESCODEEXT.CICMobileAppScrapingTargetReportNotExist.code).then(rslt => {
                            if (1 <= rslt) {
                                console.log('Update scraping status:' + responCode.ScrapingStatusCode.CicReportResultNotExist.code + '-' + responCode.RESCODEEXT.CICMobileAppScrapingTargetReportNotExist.code);

                                // emit socket
                                socket.emit('mesage_A0001', { responseMessage: true });
                                // close connection socket
                                socket.emit('end');
                            }
                            else
                                console.log('Update scraping status failure!');
                        });
                    }
                }
                else {
                    // Log in error
                    if (body.data.outJson && body.data.outJson.errMsg && utilFunction.checkStatusCodeScraping(responCode.ScrappingResponseCodeLoginFailure, body.data.outJson.errMsg)) {
                        if (0 <= _.indexOf([responCode.ScrappingResponseCodeLoginFailure.LoginFail1.code], utilFunction.getStatusScrappingCode(body.data.outJson.errMsg))) {
                            cicService.updateScrpStatCdErrorResponseCodeScraping(req.body.niceSessionKey, responCode.ScrapingStatusCode.LoginInError.code, responCode.RESCODEEXT.CICMobileAppLoginFailure.code).then(rslt => {
                                if (1 <= rslt) {
                                    console.log('Update scraping status:' + responCode.ScrapingStatusCode.LoginInError.code + '-' + responCode.RESCODEEXT.CICMobileAppLoginFailure.code);

                                    // emit socket
                                    socket.emit('mesage_A0001', { responseMessage: true });
                                    // close connection socket
                                    socket.emit('end');
                                }
                                else
                                    console.log('Update scraping status failure!');
                            });
                        } else if (0 <= _.indexOf([responCode.ScrappingResponseCodeLoginFailure.LoginFail999.code], utilFunction.getStatusScrappingCode(body.data.outJson.errMsg))) {
                            cicService.updateScrpStatCdErrorResponseCodeScraping(req.body.niceSessionKey, responCode.ScrapingStatusCode.LoginInError.code, responCode.RESCODEEXT.CICMobileAppAccessFailure.code).then(rslt => {
                                if (1 <= rslt) {
                                    console.log('Update scraping status:' + responCode.ScrapingStatusCode.LoginInError.code + '-' + responCode.RESCODEEXT.CICMobileAppAccessFailure.code);

                                    // emit socket
                                    socket.emit('mesage_A0001', { responseMessage: true });
                                    // close connection socket
                                    socket.emit('end');
                                }
                                else
                                    console.log('Update scraping status failure!');
                            });
                        }

                    } else if (body.data.outJson && body.data.outJson.outA0001 && body.data.outJson.outA0001.errMsg && utilFunction.checkStatusCodeScraping(responCode.ScrappingResponseCodeCicMobilerror, body.data.outJson.outA0001.errMsg)) {
                        if (0 <= _.indexOf([responCode.ScrappingResponseCodeCicMobilerror.CicIdINQError999.code], utilFunction.getStatusScrappingCode(body.data.outJson.errMsg))) {
                            cicService.updateScrpStatCdErrorResponseCodeScraping(req.body.niceSessionKey, responCode.ScrapingStatusCode.CicReportResultInqError.code, responCode.RESCODEEXT.ETCError.code).then(rslt => {
                                if (1 <= rslt) {
                                    console.log('Update scraping status:' + responCode.ScrapingStatusCode.CicReportResultInqError.code + '-' + responCode.RESCODEEXT.ETCError.code);

                                    // emit socket
                                    socket.emit('mesage_A0001', { responseMessage: true });
                                    // close connection socket
                                    socket.emit('end');
                                }
                                else
                                    console.log('Update scraping status failure!');
                            });
                        }
                    }

                    else {
                        cicService.updateScrpStatCdErrorResponseCodeScraping(req.body.niceSessionKey, responCode.ScrapingStatusCode.OtherError.code, responCode.RESCODEEXT.ETCError.code).then(rslt => {
                            if (1 <= rslt) {
                                console.log('Update scraping status:' + responCode.ScrapingStatusCode.OtherError.code + '-' + responCode.RESCODEEXT.ETCError.code);

                                // emit socket
                                socket.emit('mesage_A0001', { responseMessage: true });
                                // close connection socket
                                socket.emit('end');
                            }
                            else
                                console.log('Update scraping status failure!');
                        });
                    }
                }

                return res.status(200).json(body.data);
            }).catch((error) => {
                logger.error("error scraping service A0001~~");
                console.log(error);
                //Update ScrpModCd 00
                cicMobileService.updateScrpModCdTryCntHasNoResponseFromScraping06(req.body.niceSessionKey, res).then(() => {
                    console.log("update SCRP_MOD_CD = 06 ");
                    return res.status(500).json({ error: error.toString() });
                });
            });

    } catch (err) {
        logger.error("error internalCICA0001", err);
        return res.status(500).json({ error: err.toString() });
    }
}
