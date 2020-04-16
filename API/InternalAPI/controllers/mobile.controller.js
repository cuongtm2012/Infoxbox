const axios = require('axios');
const URI = require('../../shared/URI');
const _ = require('lodash');
const cicMobileService = require('../services/cicMobile.service');
const cicService = require('../services/cicInternal.service');
const cicServiceRes = require('../services/cicInternalRes.service');
const cicTransA001Save = require('../domain/cicTransA0001.save');
const CicA0001Save = require('../domain/cicA0001.save');
const utilFunction = require('../../shared/util/util');
const responCode = require('../../shared/constant/responseCodeExternal');

exports.mobileCicController = function (req, res, next) {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 1 * 60 * 1000
        }

        axios.post(URI.cicInternalJson, req.body, config)
            .then((body) => {
                let _dataReport, dataReportSave;

                if (_.isEqual('input captcha image', body.data.outJson.errMsg.toLowerCase())) {
                    let dataStep = body.data.outJson.step_data;
                    let imgBase64 = body.data.outJson.step_img;

                    return res.status(200).json({ imgBase64, dataStep });
                }
                else if (!_.isEmpty(body.data.outJson.outA0001) && _.isEqual('N', (body.data.outJson.outA0001.errYn))) {
                    if (!_.isEmpty(body.data.outJson.outA0001.list[0].dataReport)) {
                        _dataReport = JSON.parse(body.data.outJson.outA0001.list[0].dataReport);

                        dataReportSave = new CicA0001Save(_dataReport, req.body);
                        console.log('dataReportSave', dataReportSave);

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
                            if (1 <= rslt)
                                console.log('Update scraping status:' + responCode.ScrapingStatusCode.CicReportResultNotExist.code + '-' + responCode.RESCODEEXT.CICMobileAppScrapingTargetReportNotExist.code);
                            else
                                console.log('Update scraping status failure!');
                        });
                    }
                }
                else {
                    // Log in error
                    if (utilFunction.checkStatusCodeScraping(responCode.ScrappingResponseCodeLoginFailure, body.data.outJson.errMsg)) {
                        if (0 <= _.indexOf([responCode.ScrappingResponseCodeLoginFailure.LoginFail1.code], utilFunction.getStatusScrappingCode(body.data.outJson.errMsg))) {
                            cicService.updateScrpStatCdErrorResponseCodeScraping(req.body.niceSessionKey, responCode.ScrapingStatusCode.LoginInError.code, responCode.RESCODEEXT.CICMobileAppLoginFailure.code).then(rslt => {
                                if (1 <= rslt)
                                    console.log('Update scraping status:' + responCode.ScrapingStatusCode.LoginInError.code + '-' + responCode.RESCODEEXT.CICMobileAppLoginFailure.code);
                                else
                                    console.log('Update scraping status failure!');
                            });
                        } else if (0 <= _.indexOf([responCode.ScrappingResponseCodeLoginFailure.LoginFail999.code], utilFunction.getStatusScrappingCode(body.data.outJson.errMsg))) {
                            cicService.updateScrpStatCdErrorResponseCodeScraping(req.body.niceSessionKey, responCode.ScrapingStatusCode.LoginInError.code, responCode.RESCODEEXT.CICMobileAppAccessFailure.code).then(rslt => {
                                if (1 <= rslt)
                                    console.log('Update scraping status:' + responCode.ScrapingStatusCode.LoginInError.code + '-' + responCode.RESCODEEXT.CICMobileAppAccessFailure.code);
                                else
                                    console.log('Update scraping status failure!');
                            });
                        }

                    } else if (utilFunction.checkStatusCodeScraping(responCode.ScrappingResponseCodeCicMobilerror, body.data.outJson.outA0001.errMsg)) {
                        if (0 <= _.indexOf([responCode.ScrappingResponseCodeCicMobilerror.CicIdINQError999.code], utilFunction.getStatusScrappingCode(body.data.outJson.errMsg))) {
                            cicService.updateScrpStatCdErrorResponseCodeScraping(req.body.niceSessionKey, responCode.ScrapingStatusCode.CicReportResultInqError.code, responCode.RESCODEEXT.ETCError.code).then(rslt => {
                                if (1 <= rslt)
                                    console.log('Update scraping status:' + responCode.ScrapingStatusCode.CicReportResultInqError.code + '-' + responCode.RESCODEEXT.ETCError.code);
                                else
                                    console.log('Update scraping status failure!');
                            });
                        }
                    }

                    else {
                        cicService.updateScrpStatCdErrorResponseCodeScraping(req.body.niceSessionKey, responCode.ScrapingStatusCode.OtherError.code, responCode.RESCODEEXT.ETCError.code).then(rslt => {
                            if (1 <= rslt)
                                console.log('Update scraping status:' + responCode.ScrapingStatusCode.OtherError.code + '-' + responCode.RESCODEEXT.ETCError.code);
                            else
                                console.log('Update scraping status failure!');
                        });
                    }
                }

                return res.status(200).json(body.data);
            }).catch((error) => {
                console.log("error scraping service A0001~~", error);
                //Update ScrpModCd 00
                cicMobileService.updateScrpModCdTryCntHasNoResponseFromScraping06(req.body.niceSessionKey, res).then(() => {
                    console.log("update SCRP_MOD_CD = 06 ");
                    return next();
                });
            });

    } catch (err) {
        console.log("error internalCICA0001", err);
        return res.status(500).json({ error: err.toString() });
    }
}
