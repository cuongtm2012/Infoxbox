const logger = require('../../config/logger');
const validRequest = require('../../util/validateCheckStatusContractRequest');
const responCode = require('../../../shared/constant/responseCodeExternal');
const PreResponse = require('../../domain/preResponse.response');
const DataSaveToInqLog = require('../../domain/data_FptId_Save_To_InqLog.save');
const cicExternalService = require('../../services/cicExternal.service');
const dateutil = require('../../util/dateutil');
const util = require('../../util/dateutil');
const _ = require('lodash');
const common_service = require('../../services/common.service');
const statusOfContractResponseWithoutResult = require('../../domain/statusOfContractResponseWithoutResult.response')
const statusOfContractResponseResult = require('../../domain/reponseStatusOfContractWithResult.response')
const validS11AService = require('../../services/validS11A.service');
const utilFunction = require('../../../shared/util/util');
const dataStatusOfContractSaveToScrapLog = require('../../domain/dataStatusOfContractSaveToScrapLog.save');
const httpClient = require('../../services/httpClient.service');
const URI = require('../../../shared/URI');
const bodyGetAuthEContract = require('../../domain/bodyGetAuthEContract.body');
exports.statusOfContract = function (req, res) {
    try {
        let rsCheck = validRequest.checkParamRequest(req.query);
        logger.info(req.query);
        let preResponse, responseData, dataInqLogSave;
        common_service.getSequence().then(resSeq => {
            let niceSessionKey = util.timeStamp2() + resSeq[0].SEQ;
            let fullNiceKey = responCode.NiceProductCode.FTN_SCD_RQST.code + niceSessionKey;
            if (!_.isEmpty(rsCheck)) {
                preResponse = new PreResponse(rsCheck.responseMessage, fullNiceKey, dateutil.timeStamp(), rsCheck.responseCode);
                responseData = new statusOfContractResponseWithoutResult(req.query, preResponse);
                // save Inqlog
                dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                logger.info(responseData);
                return res.status(200).send(responseData);
            }
            // check FI contract
            validS11AService.selectFiCode(req.query.fiCode, responCode.NiceProductCode.FTN_CSS_RQST.code).then(dataFICode => {
                if (_.isEmpty(dataFICode)) {
                    preResponse = new PreResponse(responCode.RESCODEEXT.InvalidNiceProductCode.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.InvalidNiceProductCode.code);
                    responseData = new statusOfContractResponseWithoutResult(req.query, preResponse);
                    // update INQLOG
                    dataInqLogSave = new DataSaveToInqLog(req.query, responseData);
                    cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                    logger.info(responseData);
                    return res.status(200).json(responseData);
                } else if (_.isEmpty(dataFICode[0]) && utilFunction.checkStatusCodeScraping(responCode.OracleError, utilFunction.getOracleCode(dataFICode))) {
                    preResponse = new PreResponse(responCode.RESCODEEXT.ErrorDatabaseConnection.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.ErrorDatabaseConnection.code);
                    responseData = new statusOfContractResponseWithoutResult(req.query, preResponse);
                    logger.info(responseData);
                    return res.status(500).json(responseData);
                }
                //    end check parmas
                let dataInsertToScrapLog = new dataStatusOfContractSaveToScrapLog(req.query, fullNiceKey);
                // insert rq to ScrapLog
                cicExternalService.insertDataFPTContractToSCRPLOG(dataInsertToScrapLog).then(
                    result => {
                        //    getAuthAccess
                        let bodyGetAuth = new bodyGetAuthEContract();
                        httpClient.superagentPost(URI.URL_E_CONTRACT_GET_TOKEN_ACCESS_DEV, bodyGetAuth).then(
                            resultGetAuthAccess => {
                                if (!_.isEmpty(resultGetAuthAccess.data.access_token)) {
                                //    get status contract
                                    let URlGetStatusContract = URI.URL_E_CONTRACT_GET_STATUS_DEV + req.query.id;
                                    let token = `Bearer ${resultGetAuthAccess.data.access_token}`;
                                    httpClient.superagentGet(URlGetStatusContract,'', token).then(
                                        resultGetStatus => {
                                            if (resultGetStatus.status === 200 && !_.isEmpty(resultGetStatus.data)) {
                                            //    success P000
                                                preResponse = new PreResponse(responCode.RESCODEEXT.NORMAL.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                                                responseData = new statusOfContractResponseResult(req.query, preResponse, resultGetStatus.data);
                                                dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.NORMAL.code).then().catch();
                                                logger.info(responseData);
                                                logger.info({resultFromFpt: resultGetStatus.data});
                                                return res.status(200).json(responseData);
                                            } else if (resultGetStatus.status === 500) {
                                                //    update scraplog & response F072
                                                console.log('errGetStatus: ', resultGetStatus);
                                                preResponse = new PreResponse(responCode.RESCODEEXT.ERRCONTRACTSTATUS.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.ERRCONTRACTSTATUS.code);
                                                responseData = new statusOfContractResponseWithoutResult(req.query, preResponse);
                                                dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.ERRCONTRACTSTATUS.code).then().catch();
                                                logger.info(responseData);
                                                logger.info(resultGetStatus.data);
                                                return res.status(200).json(responseData);
                                            } else {
                                                //    update scraplog & response F048
                                                console.log('errGetStatus: ', resultGetStatus);
                                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                responseData = new statusOfContractResponseWithoutResult(req.query, preResponse);
                                                dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then().catch();
                                                logger.info(responseData);
                                                logger.info(resultGetStatus.data);
                                                return res.status(200).json(responseData);
                                            }
                                        }
                                    ).catch(reason => {
                                        console.log('errGetStatus: ', reason.toString());
                                        if (reason.status === 500) {
                                            //    update scraplog & response F072
                                            preResponse = new PreResponse(responCode.RESCODEEXT.ERRCONTRACTSTATUS.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.ERRCONTRACTSTATUS.code);
                                            responseData = new statusOfContractResponseWithoutResult(req.query, preResponse);
                                            dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                            cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.ERRCONTRACTSTATUS.code).then().catch();
                                            logger.info(responseData);
                                            logger.info(reason.toString());
                                            return res.status(200).json(responseData);
                                        } else if (reason.code === 'ETIMEDOUT' || reason.errno === 'ETIMEDOUT') {
                                            preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFTIMEOUTERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFTIMEOUTERR.code);
                                            responseData = new statusOfContractResponseWithoutResult(req.query, preResponse);
                                            dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                            cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFTIMEOUTERR.code).then().catch();
                                            logger.info(responseData);
                                            logger.info(reason.toString());
                                            return res.status(200).json(responseData);
                                        } else {
                                            preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                            responseData = new statusOfContractResponseWithoutResult(req.query, preResponse);
                                            dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                            cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then().catch();
                                            logger.info(responseData);
                                            logger.info(reason.toString());
                                            return res.status(200).json(responseData);
                                        }
                                    })
                                } else if (resultGetAuthAccess.status === 500) {
                                    //    update scraplog & response F072
                                    console.log('errGetStatus: ', resultGetAuthAccess);
                                    preResponse = new PreResponse(responCode.RESCODEEXT.ERRCONTRACTSTATUS.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.ERRCONTRACTSTATUS.code);
                                    responseData = new statusOfContractResponseWithoutResult(req.query, preResponse);
                                    dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                    cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                    cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.ERRCONTRACTSTATUS.code).then().catch();
                                    logger.info(responseData);
                                    logger.info(resultGetAuthAccess.data);
                                    return res.status(200).json(responseData);
                                } else {
                                    //    update scraplog & response F048
                                    console.log('errGetStatus: ', resultGetAuthAccess);
                                    preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                    responseData = new statusOfContractResponseWithoutResult(req.query, preResponse);
                                    dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                    cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                    cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then().catch();
                                    logger.info(responseData);
                                    logger.info(resultGetAuthAccess.data);
                                    return res.status(200).json(responseData);
                                }
                            }).catch(reason => {
                            console.log('errGetAuth: ', reason.toString());
                            if (reason.status === 500) {
                                //    update scraplog & response F072
                                console.log('errGetAuth: ', reason.toString());
                                preResponse = new PreResponse(responCode.RESCODEEXT.ERRCONTRACTSTATUS.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.ERRCONTRACTSTATUS.code);
                                responseData = new statusOfContractResponseWithoutResult(req.query, preResponse);
                                dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.ERRCONTRACTSTATUS.code).then();
                                logger.info(responseData);
                                logger.info(reason.toString());
                                return res.status(200).json(responseData);
                            } else if (reason.code === 'ETIMEDOUT' || reason.errno === 'ETIMEDOUT') {
                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFTIMEOUTERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFTIMEOUTERR.code);
                                responseData = new statusOfContractResponseWithoutResult(req.query, preResponse);
                                dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFTIMEOUTERR.code).then();
                                logger.info(responseData);
                                logger.info(reason.toString());
                                return res.status(200).json(responseData);
                            } else {
                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                responseData = new statusOfContractResponseWithoutResult(req.query, preResponse);
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
