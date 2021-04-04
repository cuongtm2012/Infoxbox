const validRequest = require('../../util/validateFTN_GAS_RQSTRequest');
const logger = require('../../config/logger');
const common_service = require('../../services/common.service');
const responCode = require('../../../shared/constant/responseCodeExternal');
const PreResponse = require('../../domain/preResponse.response');
const DataSaveToInqLog = require('../../domain/data_FptId_Save_To_InqLog.save');
const cicExternalService = require('../../services/cicExternal.service');
const dateutil = require('../../util/dateutil');
const util = require('../../util/dateutil');
const getApiStructureResponseWithoutResult = require('../../domain/getApiStructureReponseWithoutResult.response')
const validS11AService = require('../../services/validS11A.service');
const utilFunction = require('../../../shared/util/util');
const _ = require('lodash');
const dataGetStructureAPISaveToScrapLog = require('../../domain/dataGetStructureAPISaveToScrapLog.save');
const bodyGetAuthEContract = require('../../domain/bodyGetAuthEContract.body');
const httpClient = require('../../services/httpClient.service');
const URI = require('../../../shared/URI');
const responseGetApiStructureResponseWithResult = require('../../domain/responseGetStructureApiWithResult.response');
exports.getStructureAPI = function (req, res) {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 60 * 1000
        }
        let rsCheck = validRequest.checkParamRequest(req.query);
        logger.info(req.query);
        let preResponse, responseData, dataInqLogSave;
            if (!_.isEmpty(rsCheck)) {
                preResponse = new PreResponse(rsCheck.responseMessage, '', dateutil.timeStamp(), rsCheck.responseCode);
                responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
                // save Inqlog
                dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
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
                        cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                        logger.info(responseData);
                        return res.status(200).json(responseData);
                    } else if (_.isEmpty(dataFICode[0]) && utilFunction.checkStatusCodeScraping(responCode.OracleError, utilFunction.getOracleCode(dataFICode))) {
                        preResponse = new PreResponse(responCode.RESCODEEXT.ErrorDatabaseConnection.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.ErrorDatabaseConnection.code);
                        responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
                        logger.info(responseData);
                        return res.status(500).json(responseData);
                    } else {
                        //    getAuthAccess
                        let bodyGetAuth = new bodyGetAuthEContract();
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
                                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                cicExternalService.updateRspCdScrapLogAfterGetResult('', responCode.RESCODEEXT.NORMAL.code).then();
                                                logger.info(responseData);
                                                return res.status(200).json(responseData);
                                            } else {
                                                //    update scraplog & response F048
                                                console.log('errGetStructure: ', resultGetStructure);
                                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
                                                dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                cicExternalService.updateRspCdScrapLogAfterGetResult('', responCode.RESCODEEXT.EXTITFERR.code).then();
                                                logger.info(responseData);
                                                logger.info(resultGetStructure.data);
                                                return res.status(200).json(responseData);
                                            }
                                        }).catch(reason => {
                                        console.log('errGetStructureContract: ',  reason.res.statusMessage);
                                        if (reason.res && reason.res.statusMessage === 'Internal Server Error') {
                                            preResponse = new PreResponse(responCode.RESCODEEXT.NoContractTemplateForInputAlias.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.NoContractTemplateForInputAlias.code);
                                            responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
                                            dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                            cicExternalService.updateRspCdScrapLogAfterGetResult('', responCode.RESCODEEXT.NoContractTemplateForInputAlias.code).then();
                                            logger.info(responseData);
                                            logger.info(reason.res.statusMessage);
                                            return res.status(200).json(responseData);
                                        } else if (reason.res && reason.res.statusMessage === 'timeout of 60000ms exceeded') {
                                            preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFTIMEOUTERR.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFTIMEOUTERR.code);
                                            responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
                                            dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                            cicExternalService.updateRspCdScrapLogAfterGetResult('', responCode.RESCODEEXT.EXTITFTIMEOUTERR.code).then();
                                            logger.info(responseData);
                                            logger.info(reason.res.statusMessage);
                                            return res.status(200).json(responseData);
                                        } else {
                                            preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                            responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
                                            dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                            cicExternalService.updateRspCdScrapLogAfterGetResult('', responCode.RESCODEEXT.EXTITFERR.code).then();
                                            logger.info(responseData);
                                            logger.info(reason.res.statusMessage);
                                            return res.status(200).json(responseData);
                                        }
                                    })
                                }
                            }
                        ).catch(reason => {
                            console.log('errGetAuth: ', reason.res.statusMessage);
                            if (reason.res && reason.res.statusMessage === 'timeout of 60000ms exceeded') {
                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFTIMEOUTERR.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFTIMEOUTERR.code);
                                responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
                                dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                cicExternalService.updateRspCdScrapLogAfterGetResult('', responCode.RESCODEEXT.EXTITFTIMEOUTERR.code).then();
                                logger.info(responseData);
                                logger.info(reason.res.statusMessage);
                                return res.status(200).json(responseData);
                            } else {
                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
                                dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                cicExternalService.updateRspCdScrapLogAfterGetResult('', responCode.RESCODEEXT.EXTITFERR.code).then();
                                logger.info(responseData);
                                logger.info(reason.res.statusMessage);
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