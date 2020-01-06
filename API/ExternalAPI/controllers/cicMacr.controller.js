
const logger = require('../config/logger');
const cicMacrRQSTReq = require('../domain/CIC_MACR_RQST.request');

const cicMacrRQSTRes = require('../domain/CIC_MACR_RQST.response');

const cicMobileService = require('../services/cicMobile.service');

const validation = require('../../shared/util/validation');
const dateutil = require('../util/dateutil');
const validRequest = require('../util/validateMacrParamRequest');

const util = require('../util/dateutil');
const common_service = require('../services/common.service');
const responcodeEXT = require('../../shared/constant/responseCodeExternal');


exports.cicMACRRQST = function (req, res) {
    
    try {
        var start = new Date();

        let niceSessionKey;

        common_service.getSequence().then(resSeq => {
            niceSessionKey = util.timeStamp2() + resSeq[0].SEQ;
        

        const getdataReq = new cicMacrRQSTReq(req.body);
         //JSON.stringify(getdataReq);
        console.log("getdataReq = ", getdataReq);

        //logging request
        logger.debug('log request parameters from routes after manage request');
        logger.info(getdataReq);

        /*
        Checking parameters request
        Request data
        */
        let rsCheck = validRequest.checkMacrParamRequest(getdataReq);
        let preResponse = {
            responseMessage: rsCheck.responseMessage,
            niceSessionKey: "",
            responseTime: dateutil.getSeconds(start),
            responseCode: rsCheck.responseCode
        }

            if (!validation.isEmptyJson(rsCheck)) {
            let responseData = new cicMacrRQSTRes(getdataReq, preResponse);
            return res.status(200).json(responseData);C
        }
        //End check params request

        cicMobileService.insertINQLOG(getdataReq, res).then(res1 => {
            console.log('insertINQLOG:', res1)
            cicMobileService.insertSCRPLOG(getdataReq, res).then(result => {
                console.log("result cicMacrRQST: ", result);

                let response = {
                    responseMessage: responcodeEXT.RESCODEEXT.INPROCESS.name,
                    niceSessionKey: result,
                    responseTime: dateutil.getSeconds(start),
                    responseCode: responcodeEXT.RESCODEEXT.INPROCESS.code
                }

                let responseUnknow = {
                    responseMessage: responcodeEXT.RESCODEEXT.UNKNOW.name,
                    niceSessionKey: result,
                    responseTime: dateutil.getSeconds(start),
                    responseCode: responcodeEXT.RESCODEEXT.UNKNOW.code
                }

                if (!validation.isEmptyStr(result)) {
                    let responseData = new cicMacrRQSTRes(getdataReq, response);
                    return res.status(200).json(responseData);
                } else {
                    let responseData = new cicMacrRQSTRes(getdataReq, responseUnknow);
                    return res.status(400).json(responseData);
                }
            });
        });
    });

    } catch (error) {
        console.log(error);
    }
};

const cicMacrRSLTReq = require('../domain/CIC_MACR_RSLT.request');
const cicMacrRSLTRes = require('../domain/CIC_MACR_RSLT.response');
const validMacrRSLT = require('../util/validRequestMACRResponse');

exports.cicMACRRSLT = function (req, res) {
    
    try {
        var start = new Date();
        const getdataReq = new cicMacrRSLTReq(req.body);

        // check parameters request
        // request data
        let rsCheck = validMacrRSLT.checkParamRequestForResponse(getdataReq);

        if (!validation.isEmptyJson(rsCheck)) {
			let preResponse = {
				responseMessage: rsCheck.responseMessage,
				responseTime: dateutil.getSeconds(start),
				responseCode: rsCheck.responseCode

            }
            let responseData = new cicMacrRSLTRes(getdataReq, preResponse, {});
			return res.status(200).json(responseData);
		}
        // end check params reqest

        cicMobileService.selectSCRPTRLOG(getdataReq, res).then(reslt => {
            console.log("result selectSCRPTRLOG: ", reslt);

            let response = {
				responseMessage: responcodeEXT.RESCODEEXT.NORMAL.name,
				responseTime: dateutil.getSeconds(start),
				responseCode: responcodeEXT.RESCODEEXT.NORMAL.code
			}

			let responseUnknow = {
				responseMessage: responcodeEXT.RESCODEEXT.UNKNOW.name,
				responseTime: dateutil.getSeconds(start),
				responseCode: responcodeEXT.RESCODEEXT.UNKNOW.code
            }
            
            if (!validation.isEmptyStr(reslt)) {
				let responseData = new cicMacrRSLTRes(getdataReq, response, reslt[0]);
				return res.status(200).json(responseData);
			} else {
				let responseData = new cicMacrRSLTRes(getdataReq, responseUnknow, {});
				return res.status(400).json(responseData);
			}

        });
    } catch (error) {
        console.log(error);
    }
};