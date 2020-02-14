const axios = require('axios');
const URI = require('../../shared/URI');
const cicService = require('../services/cicInternal.service');
const cicServiceRes = require('../services/cicInternalRes.service');
const cicTransSave = require('../domain/cicTrans.save');
const getIdGetway = require('../../shared/util/getIPGateWay');
const _ = require("lodash");
const logger = require('../config/logger');
const responCode = require('../../shared/constant/responseCodeExternal');
const convertPassword = require('../../shared/util/convertBase64ToText');
const defaultParams = require('../domain/defaultParams.request');
const cicB0002Req = require('../domain/cicB0002.request');
const manualCaptchaService = require('../services/manualCaptcha.service');

exports.internalCICManualCaptcha = function (req, res, next) {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
            // timeout: 6000
        }
        console.log(" req.body:::", req.body);

        const _step_useYn = req.body.step_useYn;
        const _step_input = req.body.step_input;
        const _step_data = req.body.step_data;

        let defaultValue = defaultParams.defaultParams('', '', _step_useYn, _step_input, _step_data);

        //decrypt password yyyymmddhhmmssPassword
        let decryptPW;
        let _decryptPW = convertBase64.convertBase64ToText(req.body.LOGIN_PW);
        if (14 < _decryptPW.length)
            decryptPW = _decryptPW.substr(14);
        else
            decryptPW = _decryptPW;

        var fnData = new cicB0002Req(req.body, defaultValue, decryptPW);

        console.log('fnData:', fnData);

        axios.post(URI.cicInternalJson, fnData, config)
            .then((body) => {
                if (!_.isEmpty(body.data.outJson.step_data) && _.isEqual("N", body.data.outJson.errYn)) {
                    let niceSessionKey = req.body.niceSessionKey;
                    let dataStep = body.data.outJson.step_data;
                    let imgBase64 = body.data.outJson.step_img;

                    // Save data in to manual_captcha
                    manualCaptchaService.insertManulCaptcha(dataStep, niceSessionKey, imgBase64).then(result => {

                        if (!_.isEmpty(result)) {
                            if (_.isEqual('input captcha image', body.data.outJson.errMsg.toLowerCase())) {
                                return res.status(400).json(dataStep);
                            }
                            // update process status = 04 update process completed
                            else if (!_.isEmpty(body.data.outJson.outB0001) && body.data.outJson.outB0001.errYn == "N" && !_.isEmpty(body.data.outJson.outB0002.cicNo)) {
                                //update process status = 04, sucecssful recieve response from scraping service
                                cicService.updateCICReportInquirySuccessful(req.body, res).then(resultUpdated => {
                                    console.log("CIC report inquiry successful!");

                                    // encrypt password
                                    let password = convertPassword.convertTextToBase64(req.body.userPw);
                                    let requestParams = req.body;
                                    let responseParams = body.data.outJson.outB0002;
                                    let scrplogid = body.data.outJson.in.thread_id.substring(0, 13);
                                    let workId = getIdGetway.getIPGateWay();
                                    let rpCicId = body.data.outJson.outB0002.cicNo;

                                    let dataTransSave = new cicTransSave(requestParams, responseParams, scrplogid, workId, password, rpCicId, niceSessionKey);
                                    cicServiceRes.updateScrapingTranslog(dataTransSave).then((re) => {
                                        if (re) {
                                            console.log("Updated to scraping transaction log!");
                                            cicService.updateScrpModCdHasNoResponseFromScraping(req.body.niceSessionKey, res).then(() => {
                                                console.log("update SCRP_MOD_CD = 00 ");
                                                return next();
                                            });
                                        }
                                        return next();
                                    });
                                });

                                return res.status(400).json(body.data.outJson);
                            } else {
                                // Log in error
                                if (checkStatusCodeScraping(responCode.ScrappingResponseCodeLoginFailure, body.data.outJson.errMsg)) {
                                    cicService.updateScrpStatCdErrorResponseCodeScraping(niceSessionKey, responCode.ScrapingStatusCode.LoginInError.code).then(rslt => {
                                        if (_.isEqual(rslt, 1))
                                            console.log('Update scraping status:' + responCode.ScrapingStatusCode.LoginInError.code);
                                        else
                                            console.log('Update scraping status failure!');
                                    });
                                }
                                // CIC ID inquiry error
                                else if (checkStatusCodeScraping(responCode.ScrappingResponseCodeCicINQError, body.data.outJson.outB0001.errMsg)) {
                                    cicService.updateScrpStatCdErrorResponseCodeScraping(niceSessionKey, responCode.ScrapingStatusCode.CicIdInqError.code).then(rslt => {
                                        if (_.isEqual(rslt, 1))
                                            console.log('Update scraping status:' + responCode.ScrapingStatusCode.CicIdInqError.code);
                                        else
                                            console.log('Update scraping status failure!');
                                    });
                                }
                                // CIC report inquiry error
                                else if (checkStatusCodeScraping(responCode.ScrappingResponseCodeCicReportINQError, body.data.outJson.outB0002.errMsg)) {
                                    cicService.updateScrpStatCdErrorResponseCodeScraping(niceSessionKey, responCode.ScrapingStatusCode.CicReportInqError.code).then(rslt => {
                                        if (_.isEqual(rslt, 1))
                                            console.log('Update scraping status:' + responCode.ScrapingStatusCode.CicReportInqError.code);
                                        else
                                            console.log('Update scraping status failure!');
                                    });
                                } else {
                                    // cicService.updateScrpModCdHasNoResponseFromScraping(req.body.niceSessionKey, res).then(() => {
                                    //     console.log("update SCRP_MOD_CD = 00 ");
                                    //     return next();
                                    // });
                                    cicService.updateScrpStatCdErrorResponseCodeScraping(niceSessionKey, responCode.ScrapingStatusCode.OtherError.code).then(rslt => {
                                        if (_.isEqual(rslt, 1))
                                            console.log('Update scraping status:' + responCode.ScrapingStatusCode.OtherError.code);
                                        else
                                            console.log('Update scraping status failure!');
                                    });
                                }

                            }

                        } else {
                            return res.status(200);
                        }
                    });
                }
            }).catch((error) => {
                console.log("error scraping service B0002~~", error);
                //Update ScrpModCd 00
                cicService.updateScrpModCdHasNoResponseFromScraping(req.body.niceSessionKey, res).then(() => {
                    console.log("update SCRP_MOD_CD = 00 ");
                    return next();
                });
            });

    } catch (err) {
        console.log("error cicInternalJson", err);
    }
};
