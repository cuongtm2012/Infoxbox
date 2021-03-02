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
const axios = require('axios');
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
        let preResponse, responseData, dataInqLogSave;
        common_service.getSequence().then(resSeq => {
            let niceSessionKey = util.timeStamp2() + resSeq[0].SEQ;
            let fullNiceKey = responCode.NiceProductCode.FTN_GAS_RQST.code + niceSessionKey;
            if (!_.isEmpty(rsCheck)) {
                preResponse = new PreResponse(rsCheck.responseMessage, fullNiceKey, dateutil.timeStamp(), rsCheck.responseCode);
                responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
                // save Inqlog
                dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                logger.info(responseData);
                return res.status(200).send(responseData);
            }
            // check FI contract
            validS11AService.selectFiCode(req.query.fiCode, responCode.NiceProductCode.FTN_GAS_RQST.code).then(dataFICode => {
                if (_.isEmpty(dataFICode)) {
                    preResponse = new PreResponse(responCode.RESCODEEXT.InvalidNiceProductCode.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.InvalidNiceProductCode.code);
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
                }
                //    end check parmas
                let dataScrapLog = new dataGetStructureAPISaveToScrapLog(req.query, fullNiceKey);
                cicExternalService.insertDataFPTContractToSCRPLOG(dataScrapLog).then(
                    result => {
                        //    getAuthAccess
                        let bodyGetAuth = new bodyGetAuthEContract();
                        axios.post(URI.URL_E_CONTRACT_GET_TOKEN_ACCESS_DEV, bodyGetAuth, config).then(
                            resultGetAuthAccess => {
                                if (!_.isEmpty(resultGetAuthAccess.data.access_token)) {
                                    let URlGetStructureContract = URI.URL_E_CONTRACT_GET_STRUCTURE_API_DEV + req.query.alias;
                                    let configGetStructure = {
                                        headers: {
                                            'Authorization': `Bearer ${resultGetAuthAccess.data.access_token}`,
                                            'Accept-Encoding': 'gzip, deflate, br'
                                        },
                                        timeout: 60 * 1000
                                    }
                                    axios.get(URlGetStructureContract, configGetStructure).then(
                                        resultGetStructure => {
                                            if (resultGetStructure.status === 200 && !_.isEmpty(resultGetStructure.data)) {
                                                preResponse = new PreResponse(responCode.RESCODEEXT.NORMAL.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                                                responseData = new responseGetApiStructureResponseWithResult(req.query, preResponse, resultGetStructure.data);
                                                dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.NORMAL.code).then();
                                                logger.info(responseData);
                                                return res.status(200).json(responseData);
                                            } else if (resultGetStructure.status === 500) {
                                                //    update scraplog & response F072
                                                console.log('errGetStatus: ', resultGetStructure);
                                                preResponse = new PreResponse(responCode.RESCODEEXT.ERRCONTRACTSTATUS.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.ERRCONTRACTSTATUS.code);
                                                responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
                                                dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.ERRCONTRACTSTATUS.code).then();
                                                logger.info(responseData);
                                                logger.info(resultGetStructure.data);
                                                return res.status(200).json(responseData);
                                            } else {
                                                //    update scraplog & response F048
                                                console.log('errGetStatus: ', resultGetStructure);
                                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
                                                dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                                logger.info(responseData);
                                                logger.info(resultGetStructure.data);
                                                return res.status(200).json(responseData);
                                            }
                                        }).catch(reason => {
                                        console.log('errGetStatus: ', reason.toString());
                                        if (reason.response && reason.response.status === 500) {
                                            //    update scraplog & response F072
                                            preResponse = new PreResponse(responCode.RESCODEEXT.ERRCONTRACTSTATUS.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.ERRCONTRACTSTATUS.code);
                                            responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
                                            dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                            cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.ERRCONTRACTSTATUS.code).then();
                                            logger.info(responseData);
                                            logger.info(reason.toString());
                                            return res.status(200).json(responseData);
                                        } else if (reason.message === 'timeout of 60000ms exceeded') {
                                            preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFTIMEOUTERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFTIMEOUTERR.code);
                                            responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
                                            dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                            cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFTIMEOUTERR.code).then();
                                            logger.info(responseData);
                                            logger.info(reason.toString());
                                            return res.status(200).json(responseData);
                                        } else {
                                            preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                            responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
                                            dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                            cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                            logger.info(responseData);
                                            logger.info(reason.toString());
                                            return res.status(200).json(responseData);
                                        }
                                    })
                                }
                            }
                        ).catch(reason => {
                            console.log('errGetStatus: ', reason.toString());
                            if (reason.response && reason.response.status === 500) {
                                //    update scraplog & response F072
                                preResponse = new PreResponse(responCode.RESCODEEXT.ERRCONTRACTSTATUS.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.ERRCONTRACTSTATUS.code);
                                responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
                                dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.ERRCONTRACTSTATUS.code).then();
                                logger.info(responseData);
                                logger.info(reason.toString());
                                return res.status(200).json(responseData);
                            } else if (reason.message === 'timeout of 60000ms exceeded') {
                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFTIMEOUTERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFTIMEOUTERR.code);
                                responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
                                dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFTIMEOUTERR.code).then();
                                logger.info(responseData);
                                logger.info(reason.toString());
                                return res.status(200).json(responseData);
                            } else {
                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
                                dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                logger.info(responseData);
                                logger.info(reason.toString());
                                return res.status(200).json(responseData);
                            }
                        })
                    }).catch(reason => {
                    logger.error(reason.toString());
                    return res.status(500).json({error: reason.toString()});
                })
            }).catch(reason => {
                logger.error(reason.toString());
                return res.status(500).json({error: reason.toString()});
            })
        }).catch(reason => {
            logger.error(reason.toString());
            return res.status(500).json({error: reason.toString()});
        })
    } catch (err) {
        logger.error(err.toString());
        return res.status(500).json({error: err.toString()});
    }
}