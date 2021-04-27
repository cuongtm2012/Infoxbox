const validRequest = require('../../util/validateFTN_GAS_RQST_TMP.request');
const logger = require('../../config/logger');
const responCode = require('../../../shared/constant/responseCodeExternal');
const PreResponse = require('../../domain/preResponse.response');
const DataSaveToInqLog = require('../../domain/data_FptId_Save_To_InqLog.save');
const cicExternalService = require('../../services/cicExternal.service');
const dateutil = require('../../util/dateutil');
const getApiStructureResponseWithoutResult = require('../../domain/getApiStructure_TMP_ResponseWithoutResult.response')
const validS11AService = require('../../services/validS11A.service');
const utilFunction = require('../../../shared/util/util');
const _ = require('lodash');
const bodyGetAuthEContract = require('../../domain/bodyGetTokenEcontract.body');
const httpClient = require('../../services/httpClient.service');
const URI = require('../../../shared/URI');
const responseGetApiStructureResponseWithResult = require('../../domain/responseGetStructureApi_TMP_WithResult.response');
const convertBase64 = require('../../../shared/util/convertBase64ToText');
exports.getStructureAPI_TMP = function (req, res) {
    try {
        let rsCheck = validRequest.checkParamRequest(req.query);
        logger.info(req.query);
        let preResponse, responseData, dataInqLogSave;
        if (!_.isEmpty(rsCheck)) {
            preResponse = new PreResponse(rsCheck.responseMessage, '', dateutil.timeStamp(), rsCheck.responseCode);
            responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
            // save Inqlog
            dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
            cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
            logger.info(responseData);
            return res.status(200).send(responseData);
        } else {
            // check FI contract
            validS11AService.selectFiCode(req.query.fiCode, responCode.NiceProductCode.FTN_GAS_RQST.code).then(dataFICode => {
                if (_.isEmpty(dataFICode)) {
                    preResponse = new PreResponse(responCode.RESCODEEXT.InvalidNiceProductCode.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.InvalidNiceProductCode.code);
                    responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
                    // update INQLOG
                    dataInqLogSave = new DataSaveToInqLog(req.query, responseData);
                    cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                    logger.info(responseData);
                    return res.status(200).json(responseData);
                } else if (_.isEmpty(dataFICode[0]) && utilFunction.checkStatusCodeScraping(responCode.OracleError, utilFunction.getOracleCode(dataFICode))) {
                    preResponse = new PreResponse(responCode.RESCODEEXT.ErrorDatabaseConnection.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.ErrorDatabaseConnection.code);
                    responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
                    logger.info(responseData);
                    return res.status(500).json(responseData);
                } else {
                    //    getAuthAccess
                    let decryptPW;
                    let _decryptPW = convertBase64.convertBase64ToText(req.query.loginPw);
                    if (14 < _decryptPW.length)
                        decryptPW = _decryptPW.substr(14);
                    else
                        decryptPW = _decryptPW;
                    let bodyGetAuth = new bodyGetAuthEContract(req.query.loginId, decryptPW);
                    httpClient.superagentPost(URI.URL_E_CONTRACT_GET_TOKEN_ACCESS_DEV, bodyGetAuth).then(
                        resultGetAuthAccess => {
                            if (!_.isEmpty(resultGetAuthAccess.data.access_token)) {
                                let URlGetStructureContract = URI.URL_E_CONTRACT_GET_STRUCTURE_API_DEV + req.query.alias;
                                let token = `Bearer ${resultGetAuthAccess.data.access_token}`;
                                httpClient.superagentGetAcceptEncoding(URlGetStructureContract, '',token).then(
                                    resultGetStructure => {
                                        if (resultGetStructure.status === 200 && !_.isEmpty(resultGetStructure.data)) {
                                            preResponse = new PreResponse(responCode.RESCODEEXT.NORMAL.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                                            responseData = new responseGetApiStructureResponseWithResult(req.query, preResponse, resultGetStructure.data);
                                            dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                            logger.info(responseData);
                                            return res.status(200).json(responseData);
                                        } else {
                                            //    update scraplog & response F048
                                            console.log('errGetStructure: ', resultGetStructure);
                                            preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                            responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
                                            dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                            logger.info(responseData);
                                            logger.info(resultGetStructure.data);
                                            return res.status(200).json(responseData);
                                        }
                                    }).catch(reason => {
                                    console.log('errGetStructureContract: ',  reason.toString());
                                    if (reason && reason.status === 500) {
                                        preResponse = new PreResponse(responCode.RESCODEEXT.NoContractTemplateForInputAlias.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.NoContractTemplateForInputAlias.code);
                                        responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
                                        dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                        cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                        logger.info(responseData);
                                        return res.status(200).json(responseData);
                                    } else if (reason.code === 'ETIMEDOUT' || reason.errno === 'ETIMEDOUT') {
                                        preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFTIMEOUTERR.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFTIMEOUTERR.code);
                                        responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
                                        dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                        cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                        logger.info(responseData);
                                        logger.info(reason.toString());
                                        return res.status(200).json(responseData);
                                    } else {
                                        preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                        responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
                                        dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                        cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                        logger.info(responseData);
                                        logger.info(reason.toString());
                                        return res.status(200).json(responseData);
                                    }
                                })
                            }
                        }
                    ).catch(reason => {
                        console.log('errGetAuth: ', reason.toString());
                        if (reason && reason.status === 401) {
                            preResponse = new PreResponse(responCode.RESCODEEXT.LoginFailure.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.LoginFailure.code);
                            responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
                            dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                            logger.info(responseData);
                            return res.status(200).json(responseData);
                        } if (reason && reason.status === 500) {
                            preResponse = new PreResponse(responCode.RESCODEEXT.NoContractTemplateForInputAlias.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.NoContractTemplateForInputAlias.code);
                            responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
                            dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                            logger.info(responseData);
                            return res.status(200).json(responseData);
                        } else if (reason.code === 'ETIMEDOUT' || reason.errno === 'ETIMEDOUT') {
                            preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFTIMEOUTERR.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFTIMEOUTERR.code);
                            responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
                            dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                            logger.info(responseData);
                            logger.info(reason.toString());
                            return res.status(200).json(responseData);
                        } else {
                            preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                            responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
                            dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                            logger.info(responseData);
                            logger.info(reason.toString());
                            return res.status(200).json(responseData);
                        }
                    })
                }
            }).catch(reason => {
                logger.error(reason.toString());
                return res.status(500).json({error: reason.toString()});
            })
        }
    } catch (err) {
        logger.error(err.toString());
        return res.status(500).json({error: err.toString()});
    }
}