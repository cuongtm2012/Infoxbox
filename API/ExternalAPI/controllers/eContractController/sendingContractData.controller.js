const validRequest = require('../../util/validateRequestSendingDataContractFPT');
const common_service = require('../../services/common.service');
const responCode = require('../../../shared/constant/responseCodeExternal');
const PreResponse = require('../../domain/preResponse.response');
const DataSaveToInqLog = require('../../domain/data_FptId_Save_To_InqLog.save');
const cicExternalService = require('../../services/cicExternal.service');
const logger = require('../../config/logger');
const sendingDataFPTContractResponse = require('../../domain/sendingContractFPT.response')
const dateutil = require('../../util/dateutil');
const util = require('../../util/dateutil');
const _ = require('lodash');
const validS11AService = require('../../services/validS11A.service');
const utilFunction = require('../../../shared/util/util');
const dataSendingDataFptContractSaveToScrapLog = require('../../domain/dataSendingDataFptContractSaveToScrapLog.save');
const URI = require('../../../shared/URI');
const bodyGetAuthEContract = require('../../domain/bodyGetAuthEContract.body');
const bodySendInformationEContract = require('../../domain/bodySubmitInformationEContract.body');
const httpClient = require('../../services/httpClient.service');

exports.sendingContractData = function (req, res) {
    try {
        let rsCheck = validRequest.checkParamRequest(req.body);
        logger.info(req.body);
        let preResponse, responseData, dataInqLogSave;
        common_service.getSequence().then(resSeq => {
            let niceSessionKey = util.timeStamp2() + resSeq[0].SEQ;
            let fullNiceKey = responCode.NiceProductCode.FTN_SCD_RQST.code + niceSessionKey;
            if (!_.isEmpty(rsCheck)) {
                preResponse = new PreResponse(rsCheck.responseMessage, fullNiceKey, dateutil.timeStamp(), rsCheck.responseCode);
                responseData = new sendingDataFPTContractResponse(req.body, preResponse);
                // save Inqlog
                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                logger.info(req.body);
                return res.status(200).send(responseData);
            }
            // check FI contract
            validS11AService.selectFiCode(req.body.fiCode, responCode.NiceProductCode.FTN_SCD_RQST.code).then(dataFICode => {
                if (_.isEmpty(dataFICode)) {
                    preResponse = new PreResponse(responCode.RESCODEEXT.InvalidNiceProductCode.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.InvalidNiceProductCode.code);
                    responseData = new sendingDataFPTContractResponse(req.body, preResponse);
                    // update INQLOG
                    dataInqLogSave = new DataSaveToInqLog(req.body, responseData);
                    cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                    logger.info(req.body);
                    return res.status(200).json(responseData);
                } else if (_.isEmpty(dataFICode[0]) && utilFunction.checkStatusCodeScraping(responCode.OracleError, utilFunction.getOracleCode(dataFICode))) {
                    preResponse = new PreResponse(responCode.RESCODEEXT.ErrorDatabaseConnection.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.ErrorDatabaseConnection.code);
                    responseData = new sendingDataFPTContractResponse(req.body, preResponse);
                    logger.info(req.body);
                    return res.status(500).json(responseData);
                }
                //    end check parmas
                let dataInsertToScrapLog = new dataSendingDataFptContractSaveToScrapLog(req.body, fullNiceKey);
                // insert rq to ScrapLog
                cicExternalService.insertDataFPTContractToSCRPLOG(dataInsertToScrapLog).then(
                    result => {
                        //    getAuthAccess
                        let bodyGetAuth = new bodyGetAuthEContract();
                        httpClient.superagentPost(URI.URL_E_CONTRACT_GET_TOKEN_ACCESS_DEV, bodyGetAuth).then(
                            resultGetAuthAccess => {
                                if (!_.isEmpty(resultGetAuthAccess.data.access_token)) {
                                    //    Submit information
                                    let bodySubmitInfo = new bodySendInformationEContract(req.body);
                                    let token = `Bearer ${resultGetAuthAccess.data.access_token}`;
                                    httpClient.superagentPost(URI.URL_E_CONTRACT_SUBMIT_INFORMATION_DEV, bodySubmitInfo, token).then(
                                        resultSubmitInfo => {
                                            if (resultSubmitInfo.status === 200 && !_.isEmpty(resultSubmitInfo.data)) {
                                                //    update scraplog & response P000
                                                preResponse = new PreResponse(responCode.RESCODEEXT.NORMAL.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                                                responseData = new sendingDataFPTContractResponse(req.body, preResponse);
                                                responseData.id = resultSubmitInfo.data;
                                                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.NORMAL.code).then();
                                                logger.info(responseData);
                                                logger.info({resultFromFpt: resultSubmitInfo.data});
                                                return res.status(200).json(responseData);
                                            } else if (resultSubmitInfo.status === 500) {
                                                //    update scraplog & response F070
                                                console.log('errSubmitInfo: ', resultGetAuthAccess);
                                                preResponse = new PreResponse(responCode.RESCODEEXT.ERRCONTRACTDATASENDING.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.ERRCONTRACTDATASENDING.code);
                                                responseData = new sendingDataFPTContractResponse(req.body, preResponse);
                                                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.ERRCONTRACTDATASENDING.code).then();
                                                logger.info(responseData);
                                                return res.status(200).json(responseData);
                                            } else {
                                                //    update scraplog & response F048
                                                console.log('errSubmitInfo: ', resultGetAuthAccess);
                                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                responseData = new sendingDataFPTContractResponse(req.body, preResponse);
                                                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                                logger.info(responseData);
                                                return res.status(200).json(responseData);
                                            }
                                        }).catch(reason => {
                                        console.log('errSubmitInfo: ', reason.res.statusMessage);
                                        if (reason.res && reason.res.statusCode === 500) {
                                            //    update scraplog & response F070
                                            preResponse = new PreResponse(responCode.RESCODEEXT.ERRCONTRACTDATASENDING.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.ERRCONTRACTDATASENDING.code);
                                            responseData = new sendingDataFPTContractResponse(req.body, preResponse);
                                            dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                            cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.ERRCONTRACTDATASENDING.code).then();
                                            logger.info(responseData);
                                            logger.info(reason.toString());
                                            return res.status(200).json(responseData);
                                        }  else if (reason.res && reason.res.statusMessage === 'timeout of 60000ms exceeded') {
                                            preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFTIMEOUTERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFTIMEOUTERR.code);
                                            responseData = new sendingDataFPTContractResponse(req.body, preResponse);
                                            dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                            cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFTIMEOUTERR.code).then();
                                            logger.info(responseData);
                                            logger.info(reason.toString());
                                            return res.status(200).json(responseData);
                                        } else {
                                            preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                            responseData = new sendingDataFPTContractResponse(req.body, preResponse);
                                            dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                            cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                            logger.info(responseData);
                                            logger.info(reason.toString());
                                            return res.status(200).json(responseData);
                                        }
                                    })
                                } else if (resultGetAuthAccess.status === 500) {
                                    //    update scraplog & response F070
                                    console.log('errGetAuthAccess: ', resultGetAuthAccess.data);
                                    preResponse = new PreResponse(responCode.RESCODEEXT.ERRCONTRACTDATASENDING.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.ERRCONTRACTDATASENDING.code);
                                    responseData = new sendingDataFPTContractResponse(req.body, preResponse);
                                    dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                    cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                    cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.ERRCONTRACTDATASENDING.code).then();
                                    logger.info(responseData);
                                    return res.status(200).json(responseData);
                                } else {
                                    //    update scraplog & response F048
                                    console.log('errGetAuthAccess: ', resultGetAuthAccess.data);
                                    preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                    responseData = new sendingDataFPTContractResponse(req.body, preResponse);
                                    dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                    cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                    cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                    logger.info(responseData);
                                    return res.status(200).json(responseData);
                                }
                            }).catch(reason => {
                                console.log('errGetAuth: ', reason.res.statusMessage);
                            if (reason.res && reason.res.statusCode === 500) {
                                //    update scraplog & response F070
                                console.log('errSubmitInfo: ', reason.toString());
                                preResponse = new PreResponse(responCode.RESCODEEXT.ERRCONTRACTDATASENDING.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.ERRCONTRACTDATASENDING.code);
                                responseData = new sendingDataFPTContractResponse(req.body, preResponse);
                                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.ERRCONTRACTDATASENDING.code).then();
                                logger.info(responseData);
                                return res.status(200).json(responseData);
                            } else if (reason.res && reason.res.statusMessage === 'timeout of 60000ms exceeded') {
                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFTIMEOUTERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFTIMEOUTERR.code);
                                responseData = new sendingDataFPTContractResponse(req.body, preResponse);
                                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFTIMEOUTERR.code).then();
                                logger.info(responseData);
                                logger.info(reason.toString());
                                return res.status(200).json(responseData);
                            } else {
                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                responseData = new sendingDataFPTContractResponse(req.body, preResponse);
                                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
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
        })
    } catch (err) {
        logger.error(err.toString());
        return res.status(500).json({error: err.toString()});
    }
}