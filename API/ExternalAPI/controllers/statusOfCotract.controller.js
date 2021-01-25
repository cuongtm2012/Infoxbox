const logger = require('../config/logger');
const validRequest = require('../util/validateCheckStatusContractRequest');
const responCode = require('../../shared/constant/responseCodeExternal');
const PreResponse = require('../domain/preResponse.response');
const DataSaveToInqLog = require('../domain/data_FptId_Save_To_InqLog.save');
const cicExternalService = require('../services/cicExternal.service');
const dateutil = require('../util/dateutil');
const util = require('../util/dateutil');
const _ = require('lodash');
const common_service = require('../services/common.service');
const statusOfContractResponseWithoutResult = require('../domain/statusOfContractResponseWithoutResult.response')
const statusOfContractResponseResult = require('../domain/reponseStatusOfContractWithResult.response')
const validS11AService = require('../services/validS11A.service');
const utilFunction = require('../../shared/util/util');
const dataStatusOfContractSaveToScrapLog = require('../domain/dataStatusOfContractSaveToScrapLog.save');
const axios = require('axios');
const URI = require('../../shared/URI');
const bodyGetAuthEContract = require('../domain/bodyGetAuthEContract.body')
exports.statusOfContract = function (req, res) {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 60 * 1000
        }
        let rsCheck = validRequest.checkParamRequest(req.body);
        let preResponse, responseData, dataInqLogSave;
        common_service.getSequence().then(resSeq => {
            let niceSessionKey = util.timeStamp2() + resSeq[0].SEQ;
            let fullNiceKey = responCode.NiceProductCode.FTN_SCD_RQST.code + niceSessionKey;
            if (!_.isEmpty(rsCheck)) {
                preResponse = new PreResponse(rsCheck.responseMessage, fullNiceKey, dateutil.timeStamp(), rsCheck.responseCode);
                responseData = new statusOfContractResponseWithoutResult(req.body, preResponse);
                // save Inqlog
                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                logger.error(req.body);
                return res.status(200).send(responseData);
            }
            // check FI contract
            validS11AService.selectFiCode(req.body.fiCode, responCode.NiceProductCode.FTN_CSS_RQST.code).then(dataFICode => {
                if (_.isEmpty(dataFICode)) {
                    preResponse = new PreResponse(responCode.RESCODEEXT.InvalidNiceProductCode.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.InvalidNiceProductCode.code);
                    responseData = new statusOfContractResponseWithoutResult(req.body, preResponse);
                    // update INQLOG
                    dataInqLogSave = new DataSaveToInqLog(req.body, responseData);
                    cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                    logger.error(req.body);
                    return res.status(200).json(responseData);
                } else if (_.isEmpty(dataFICode[0]) && utilFunction.checkStatusCodeScraping(responCode.OracleError, utilFunction.getOracleCode(dataFICode))) {
                    preResponse = new PreResponse(responCode.RESCODEEXT.ErrorDatabaseConnection.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.ErrorDatabaseConnection.code);
                    responseData = new statusOfContractResponseWithoutResult(req.body, preResponse);
                    logger.error(req.body);
                    return res.status(500).json(responseData);
                }
                //    end check parmas
                let dataInsertToScrapLog = new dataStatusOfContractSaveToScrapLog(req.body, fullNiceKey);
                // insert rq to ScrapLog
                cicExternalService.insertDataFPTContractToSCRPLOG(dataInsertToScrapLog).then(
                    result => {
                        //    getAuthAccess
                        let bodyGetAuth = new bodyGetAuthEContract();
                        axios.post(URI.URL_E_CONTRACT_GET_TOKEN_ACCESS_DEV, bodyGetAuth, config).then(
                            resultfetAuthAccess => {
                                if (!_.isEmpty(resultfetAuthAccess.data.access_token)) {
                                //    get status contract
                                    let URlgetStatusContract = URI.URL_E_CONTRACT_GET_STATUS_DEV + req.body.id;
                                    let configGetStatus = {
                                        headers: {
                                            'Authorization': `Bearer ${resultfetAuthAccess.data.access_token}`
                                        },
                                        timeout: 60 * 1000
                                    }
                                    axios.get(URlgetStatusContract,configGetStatus).then(
                                        resultGetStatus => {
                                            if (resultGetStatus.status === 200 && !_.isEmpty(resultGetStatus.data)) {
                                            //    success P000
                                                preResponse = new PreResponse(responCode.RESCODEEXT.NORMAL.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                                                responseData = new statusOfContractResponseResult(req.body, preResponse, resultGetStatus.data);
                                                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.NORMAL.code).then();
                                                logger.info(req.body);
                                                logger.info(resultGetStatus.data);
                                                return res.status(200).json(responseData);
                                            } else if (resultGetStatus.status === 500) {
                                                //    update scraplog & response F072
                                                console.log('errGetStatus: ', resultGetStatus);
                                                preResponse = new PreResponse(responCode.RESCODEEXT.ERRCONTRACTSTATUS.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.ERRCONTRACTSTATUS.code);
                                                responseData = new statusOfContractResponseWithoutResult(req.body, preResponse);
                                                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.ERRCONTRACTSTATUS.code).then();
                                                logger.error(req.body);
                                                logger.error(resultGetStatus.data);
                                                return res.status(200).json(responseData);
                                            } else {
                                                //    update scraplog & response F048
                                                console.log('errGetStatus: ', resultGetStatus);
                                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                responseData = new statusOfContractResponseWithoutResult(req.body, preResponse);
                                                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                                logger.error(req.body);
                                                logger.error(resultGetStatus.data);
                                                return res.status(200).json(responseData);
                                            }
                                        }
                                    ).catch(reason => {
                                        logger.error(req.body);
                                        logger.error(reason.toString());
                                        if (reason.response && reason.response.status === 500) {
                                            //    update scraplog & response F072
                                            console.log('errGetStatus: ', reason.toString());
                                            preResponse = new PreResponse(responCode.RESCODEEXT.ERRCONTRACTSTATUS.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.ERRCONTRACTSTATUS.code);
                                            responseData = new statusOfContractResponseWithoutResult(req.body, preResponse);
                                            dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                            cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.ERRCONTRACTSTATUS.code).then();
                                            return res.status(200).json(responseData);
                                        } else {
                                            return res.status(500).json({error: reason.toString()});
                                        }
                                    })
                                } else if (resultfetAuthAccess.status === 500) {
                                    //    update scraplog & response F072
                                    console.log('errGetStatus: ', resultfetAuthAccess);
                                    preResponse = new PreResponse(responCode.RESCODEEXT.ERRCONTRACTSTATUS.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.ERRCONTRACTSTATUS.code);
                                    responseData = new statusOfContractResponseWithoutResult(req.body, preResponse);
                                    dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                    cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                    cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.ERRCONTRACTSTATUS.code).then();
                                    logger.error(req.body);
                                    logger.error(resultfetAuthAccess.data);
                                    return res.status(200).json(responseData);
                                } else {
                                    //    update scraplog & response F048
                                    console.log('errGetStatus: ', resultfetAuthAccess);
                                    preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                    responseData = new statusOfContractResponseWithoutResult(req.body, preResponse);
                                    dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                    cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                    cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                    logger.error(req.body);
                                    logger.error(resultfetAuthAccess.data);
                                    return res.status(200).json(responseData);
                                }
                            }).catch(reason => {
                            logger.error(req.body);
                            logger.error(reason.toString());
                            if (reason.response && reason.response.status === 500) {
                                //    update scraplog & response F072
                                console.log('errGetStatus: ', reason.toString());
                                preResponse = new PreResponse(responCode.RESCODEEXT.ERRCONTRACTSTATUS.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.ERRCONTRACTSTATUS.code);
                                responseData = new statusOfContractResponseWithoutResult(req.body, preResponse);
                                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.ERRCONTRACTSTATUS.code).then();
                                return res.status(200).json(responseData);
                            } else {
                                return res.status(500).json({error: reason.toString()});
                            }
                        })
                    }).catch(reason => {
                    logger.error(req.body);
                    logger.error(reason.toString());
                    return res.status(500).json({error: reason.toString()});
                })
            }).catch(reason => {
                logger.error(req.body);
                logger.error(reason.toString());
                return res.status(500).json({error: reason.toString()});
            })
        }).catch(reason => {
            logger.error(req.body);
            logger.error(reason.toString());
            return res.status(500).json({error: reason.toString()});
        })
    } catch (err) {
        logger.error(req.body);
        logger.error(err.toString());
        return res.status(500).json({error: err.toString()});
    }
}
