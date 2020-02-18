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

exports.cicMACRRQST = function (req, res, next) {

    try {
        let niceSessionKey;
        let preResponse, responseData;

        /*
        Checking parameters request
        Request data
        */
        let rsCheck = validRequest.checkMacrParamRequest(req.body);

        if (!validation.isEmptyJson(rsCheck)) {
            preResponse = new PreResponse(rsCheck.responseMessage, '', dateutil.timeStamp(), rsCheck.responseCode);

            let responseData = new cicMacrRQSTRes(req.body, preResponse);
            return res.status(200).json(responseData);
        }
        validS11AService.selectFiCode(req.body.fiCode, responcodeEXT.NiceProductCode.Mobile.code).then(dataFICode => {
            if (_.isEmpty(dataFICode)) {
                preResponse = new PreResponse(responcodeEXT.RESCODEEXT.InvalidNiceProductCode.name, '', dateutil.timeStamp(), responcodeEXT.RESCODEEXT.InvalidNiceProductCode.code);

                responseData = new cicMacrRQSTRes(req.body, preResponse);
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
                logger.info(getdataReq);

                cicMobileService.insertINQLOG(getdataReq, res).then(res1 => {
                    console.log('insertINQLOG:', res1)
                    cicMobileService.insertSCRPLOG(getdataReq, res).then(niceSessionK => {
                        console.log("result cicMacrRQST: ", niceSessionK);

                        let responseSuccess = new PreResponse(responcodeEXT.RESCODEEXT.INPROCESS.name, niceSessionK, dateutil.timeStamp(), responcodeEXT.RESCODEEXT.INPROCESS.code);
                        let responseUnknow = new PreResponse(responcodeEXT.RESCODEEXT.UNKNOW.name, '', dateutil.timeStamp(), responcodeEXT.RESCODEEXT.UNKNOW.code);

                        if (!validation.isEmptyStr(niceSessionK)) {
                            let responseData = new cicMacrRQSTRes(getdataReq, responseSuccess);
                            return res.status(200).json(responseData);
                        } else {
                            let responseData = new cicMacrRQSTRes(getdataReq, responseUnknow);
                            return res.status(200).json(responseData);
                        }
                    });
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
        let preResponse, responseData;

        if (!validation.isEmptyJson(rsCheck)) {
            preResponse = new PreResponse(rsCheck.responseMessage, '', dateutil.timeStamp(), rsCheck.responseCode);

            responseData = new cicMacrRSLTRes(getdataReq, preResponse, {});
            return res.status(200).json(responseData);
        }
        validS11AService.selectFiCode(req.body.fiCode, responcodeEXT.NiceProductCode.Mobile.code).then(dataFICode => {
            if (_.isEmpty(dataFICode)) {
                preResponse = new PreResponse(responcodeEXT.RESCODEEXT.InvalidNiceProductCode.name, '', dateutil.timeStamp(), responcodeEXT.RESCODEEXT.InvalidNiceProductCode.code);

                responseData = new cicMacrRSLTRes(req.body, preResponse);
                return res.status(200).json(responseData);
            }
            // end check params reqest

            cicMobileService.selectSCRPTRLOG(getdataReq, res).then(reslt => {
                console.log("result selectSCRPTRLOG: ", reslt);

                let responseSuccess = new PreResponse(responcodeEXT.RESCODEEXT.NORMAL.name, '', dateutil.timeStamp(), responcodeEXT.RESCODEEXT.NORMAL.code);
                let responseUnknow = new PreResponse(responcodeEXT.RESCODEEXT.UNKNOW.name, '', dateutil.timeStamp(), responcodeEXT.RESCODEEXT.UNKNOW.code);


                if (!validation.isEmptyStr(reslt)) {
                    let responseData = new cicMacrRSLTRes(getdataReq, responseSuccess, reslt[0]);
                    return res.status(200).json(responseData);
                } else {
                    let responseData = new cicMacrRSLTRes(getdataReq, responseUnknow, {});
                    return res.status(200).json(responseData);
                }

            });

            cicMobileService.selectScrapingStatusCodeSCRPLOG(getdataReq.niceSessionKey).then(rslt => {

                if (_.isEmpty(rslt)) {
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

                    return res.status(200).json(responseSrapingStatus);
                }
            });
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.toString() });
    }
};