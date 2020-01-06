//
const logger = require('../config/logger');
const cicMacrRQSTReq = require('../domain/CIC_MACR_RQST.request');

const cicMacrRQSTRes = require('../domain/CIC_MACR_RQST.response');

const cicMobileService = require('../services/cicMobile.service');

const validation = require('../../shared/util/validation');
const dateutil = require('../util/dateutil');
const validRequest = require('../util/validateMacrParamRequest');

const responcodeEXT = require('../../shared/constant/responseCodeExternal');


exports.cicMACRRQST = function (req, res) {
    //TODO
    try {
        var start = new Date();

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


    } catch (error) {
        console.log(error);
    }
};

exports.cicMACRRSLT = function (req, res) {
    //TODO
    try {

    } catch (error) {
        console.log(error);
    }
};