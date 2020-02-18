
const logger = require('../config/logger');

const cics37RQSTReq = require('../domain/CIC_S37_RQST.request');

const cicExternalService = require('../services/cicExternal.service');

const cics37RQSTRes = require('../domain/CIC_S37_RQST.response');

const validation = require('../../shared/util/validation');
const validRequest = require('../util/validateParamRequest');
const encryptPassword = require('../util/encryptPassword');

const responcodeEXT = require('../../shared/constant/responseCodeExternal');

const util = require('../util/dateutil');
const common_service = require('../services/common.service');
const validS11AService = require('../services/validS11A.service');
const PreResponse = require('../domain/preResponse.response');

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

            let responseData = new cics37RQSTRes(req.body, preResponse);
            return res.status(200).json(responseData);
        }
        validS11AService.selectFiCode(req.body.fiCode, responcodeEXT.NiceProductCode.S37.code).then(dataFICode => {
            if (_.isEmpty(dataFICode)) {
                preResponse = new PreResponse(responcodeEXT.RESCODEEXT.InvalidNiceProductCode.name, '', dateutil.timeStamp(), responcodeEXT.RESCODEEXT.InvalidNiceProductCode.code);

                responseData = new cics37RQSTRes(req.body, preResponse);
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

                cicExternalService.insertINQLOG(getdataReq, res).then(res1 => {
                    console.log('insertINQLOG::', res1);
                    cicExternalService.insertSCRPLOG(getdataReq, res).then(niceSessionK => {
                        console.log("result cics11aRQST: ", niceSessionK);

                        let responseSuccess = new PreResponse(responcodeEXT.RESCODEEXT.INPROCESS.name, niceSessionK, dateutil.timeStamp(), responcodeEXT.RESCODEEXT.INPROCESS.code);
                        let responseUnknow = new PreResponse(responcodeEXT.RESCODEEXT.UNKNOW.name, '', dateutil.timeStamp(), responcodeEXT.RESCODEEXT.UNKNOW.code);

                        if (!validation.isEmptyStr(niceSessionK)) {
                            let responseData = new cics37RQSTRes(getdataReq, responseSuccess);
                            return res.status(200).json(responseData);
                        } else {
                            let responseData = new cics37RQSTRes(getdataReq, responseUnknow);
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
        let preResponse, responseData;

        if (!_.isEmpty(rsCheck)) {
            preResponse = new PreResponse(rsCheck.responseMessage, '', dateutil.timeStamp(), rsCheck.responseCode);

            responseData = new cics37RSLTRes(getdataReq, preResponse, {});
            return res.status(200).json(responseData);
        }
        validS11AService.selectFiCode(req.body.fiCode, responcodeEXT.NiceProductCode.S37.code).then(dataFICode => {
            if (_.isEmpty(dataFICode)) {
                preResponse = new PreResponse(responcodeEXT.RESCODEEXT.InvalidNiceProductCode.name, '', dateutil.timeStamp(), responcodeEXT.RESCODEEXT.InvalidNiceProductCode.code);

                responseData = new cics37RQSTRes(req.body, preResponse);
                return res.status(200).json(responseData);
            }
            //End check params request

            cicExternalService.selectCICS11aRSLT(getdataReq, res).then(reslt => {
                console.log("result selectCICS11aRSLT: ", reslt);

                let responseSuccess = new PreResponse(responcodeEXT.RESCODEEXT.NORMAL.name, '', dateutil.timeStamp(), responcodeEXT.RESCODEEXT.NORMAL.code);
                let responseUnknow = new PreResponse(responcodeEXT.RESCODEEXT.UNKNOW.name, '', dateutil.timeStamp(), responcodeEXT.RESCODEEXT.UNKNOW.code);

                if (!validation.isEmptyStr(reslt)) {
                    let responseData = new cics37RSLTRes(getdataReq, responseSuccess, reslt[0]);
                    return res.status(200).json(responseData);
                } else {
                    let responseData = new cics37RSLTRes(getdataReq, responseUnknow, {});
                    return res.status(200).json(responseData);
                }
            });
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.toString() });
    }

};