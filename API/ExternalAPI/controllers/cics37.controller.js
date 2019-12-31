
const logger = require('../config/logger');

const cics37RQSTReq = require('../domain/CIC_S37_RQST.request');

const cicExternalService = require('../services/cicExternal.service');

const cics37RQSTRes = require('../domain/CIC_S37_RQST.response');

const validation = require('../../shared/util/validation');
const dateutil = require('../util/dateutil');
const validRequest = require('../util/validateParamRequest');
const encryptPassword = require('../util/encryptPassword');

const responcodeEXT = require('../../shared/constant/responseCodeExternal');

const util = require('../util/dateutil');
const common_service = require('../services/common.service');

exports.cics37Rqst = function (req, res) {
    try {
        var start = new Date();

        // encrypt password
        let password = encryptPassword.encrypt(req.body.loginPw);
        // let niceSessionKey = nicekey.makeNiceSessionKey();
        let niceSessionKey;
        common_service.getSequence().then(resSeq => {
            niceSessionKey = util.timeStamp2() + resSeq[0].SEQ;

            const getdataReq = new cics37RQSTReq(req.body, password, niceSessionKey);
            // JSON.stringify(getdataReq);
            console.log("getdataReq=====", getdataReq);

            //Logging request
            logger.debug('Log request parameters from routes after manage request');
            logger.info(getdataReq);

			/*
			* Checking parameters request
			* Request data
			*/
            let rsCheck = validRequest.checkParamRequest(getdataReq);

            if (!validation.isEmptyJson(rsCheck)) {
                let preResponse = {
                    responseMessage: rsCheck.responseMessage,
                    niceSessionKey: "",
                    responseTime: dateutil.getSeconds(start),
                    responseCode: rsCheck.responseCode
                }

                let responseData = new cics37RQSTRes(getdataReq, preResponse);
                return res.status(200).json(responseData);
            }
            //End check params request

            cicExternalService.insertINQLOG(getdataReq, res).then(res1 => {
                console.log('insertINQLOG::', res1);
                cicExternalService.insertSCRPLOG(getdataReq, res).then(result => {
                    console.log("result cics11aRQST: ", result);

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
                        let responseData = new cics37RQSTRes(getdataReq, response);
                        return res.status(200).json(responseData);
                    } else {
                        let responseData = new cics37RQSTRes(getdataReq, responseUnknow);
                        return res.status(400).json(responseData);
                    }
                });
            });
        });

    } catch (err) {
        return next(err)
    }
};

const cics37RSLTReq = require('../domain/CIC_S37_RSLT.request');
const cics37RSLTRes = require('../domain/CIC_S37_RSLT.response');
const validS11ARQLT = require('../util/validRequestS11AResponse');

exports.cics11aRSLT = function (req, res) {
    try {
        var start = new Date();

        const getdataReq = new cics37RSLTReq(req.body);

		/*
		* Checking parameters request
		* Request data
		*/
        let rsCheck = validS11ARQLT.checkParamRequestForResponse(getdataReq);

        if (!validation.isEmptyJson(rsCheck)) {
            let preResponse = {
                responseMessage: rsCheck.responseMessage,
                responseTime: dateutil.getSeconds(start),
                responseCode: rsCheck.responseCode

            }

            let responseData = new cics37RSLTRes(getdataReq, preResponse, {});
            return res.status(200).json(responseData);
        }
        //End check params request

        cicExternalService.selectCICS11aRSLT(getdataReq, res).then(reslt => {
            console.log("result selectCICS11aRSLT: ", reslt);

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
                let responseData = new cics37RSLTRes(getdataReq, response, reslt[0]);
                return res.status(200).json(responseData);
            } else {
                let responseData = new cics37RSLTRes(getdataReq, responseUnknow, {});
                return res.status(400).json(responseData);
            }
        });

    } catch (error) {
        console.log(error);
    }

};