import validRequest from '../../util/validateRequestSendingDataContractFPT.js';
import commonServiceGetSequence from '../../services/common.service.js';
import responCode from '../../../shared/constant/responseCodeExternal.js';
import PreResponse from '../../domain/preResponse.response.js';
import DataSaveToInqLog from '../../domain/data_FptId_Save_To_InqLog.save.js';
import { insertDataToINQLOG, insertDataFPTContractToSCRPLOG,  updateRspCdScrapLogAfterGetResult } from '../../services/cicExternal.service.js';
import logger from '../../config/logger.js';
import sendingDataFPTContractResponse from '../../domain/sendingContractFPT.response.js';
import dateutil from '../../util/dateutil.js';
import util from '../../util/dateutil.js';
import _ from 'lodash';
import validS11AServiceSelectFiCode from '../../services/validS11A.service.js';
import utilFunction from '../../../shared/util/util.js';
import dataSendingDataFptContractSaveToScrapLog from '../../domain/dataSendingDataFptContractSaveToScrapLog.save.js';
import {axiosPost} from '../../services/httpClient.service.js';
import URI from '../../../shared/URI.js';
import bodyGetAuthEContract from '../../domain/bodyGetAuthEContract.body.js';
import bodySendInformationEContract from '../../domain/bodySubmitInformationEContract.body.js';
export function sendingContractData (req, res) {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 60 * 1000
        }
        let rsCheck = validRequest.checkParamRequest(req.body);
        logger.info(req.body);
        let preResponse, responseData, dataInqLogSave;
        commonServiceGetSequence().then(resSeq => {
            let niceSessionKey = util.timeStamp2() + resSeq[0].SEQ;
            let fullNiceKey = responCode.NiceProductCode.FTN_SCD_RQST.code + niceSessionKey;
            if (!_.isEmpty(rsCheck)) {
                preResponse = new PreResponse(rsCheck.responseMessage, fullNiceKey, dateutil.timeStamp(), rsCheck.responseCode);
                responseData = new sendingDataFPTContractResponse(req.body, preResponse);
                // save Inqlog
                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                insertDataToINQLOG(dataInqLogSave).then();
                logger.info(req.body);
                return res.status(200).send(responseData);
            }
            // check FI contract
            validS11AServiceSelectFiCode(req.body.fiCode, responCode.NiceProductCode.FTN_SCD_RQST.code).then(dataFICode => {
                if (_.isEmpty(dataFICode)) {
                    preResponse = new PreResponse(responCode.RESCODEEXT.InvalidNiceProductCode.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.InvalidNiceProductCode.code);
                    responseData = new sendingDataFPTContractResponse(req.body, preResponse);
                    // update INQLOG
                    dataInqLogSave = new DataSaveToInqLog(req.body, responseData);
                    insertDataToINQLOG(dataInqLogSave).then();
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
                insertDataFPTContractToSCRPLOG(dataInsertToScrapLog).then(
                    result => {
                        //    getAuthAccess
                        let bodyGetAuth = new bodyGetAuthEContract();
                        axiosPost(URI.URL_E_CONTRACT_GET_TOKEN_ACCESS_DEV, bodyGetAuth, config).then(
                            resultfetAuthAccess => {
                                if (!_.isEmpty(resultfetAuthAccess.data.access_token)) {
                                    //    Submit information
                                    let bodySubmitInfo = new bodySendInformationEContract(req.body);
                                    let configSubmitInfo = {
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${resultfetAuthAccess.data.access_token}`
                                        },
                                        timeout: 60 * 1000
                                    }
                                    axiosPost(URI.URL_E_CONTRACT_SUBMIT_INFORMATION_DEV, bodySubmitInfo, configSubmitInfo).then(
                                        resultSubmitInfo => {
                                            if (resultSubmitInfo.status === 200 && !_.isEmpty(resultSubmitInfo.data)) {
                                                //    update scraplog & response P000
                                                preResponse = new PreResponse(responCode.RESCODEEXT.NORMAL.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                                                responseData = new sendingDataFPTContractResponse(req.body, preResponse);
                                                responseData.id = resultSubmitInfo.data;
                                                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                insertDataToINQLOG(dataInqLogSave).then();
                                                updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.NORMAL.code).then();
                                                logger.info(responseData);
                                                logger.info({resultFromFpt: resultSubmitInfo.data});
                                                return res.status(200).json(responseData);
                                            } else if (resultSubmitInfo.status === 500) {
                                                //    update scraplog & response F070
                                                console.log('errSubmitInfo: ', resultfetAuthAccess);
                                                preResponse = new PreResponse(responCode.RESCODEEXT.ERRCONTRACTDATASENDING.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.ERRCONTRACTDATASENDING.code);
                                                responseData = new sendingDataFPTContractResponse(req.body, preResponse);
                                                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                insertDataToINQLOG(dataInqLogSave).then();
                                                updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.ERRCONTRACTDATASENDING.code).then();
                                                logger.info(responseData);
                                                return res.status(200).json(responseData);
                                            } else {
                                                //    update scraplog & response F048
                                                console.log('errSubmitInfo: ', resultfetAuthAccess);
                                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                responseData = new sendingDataFPTContractResponse(req.body, preResponse);
                                                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                insertDataToINQLOG(dataInqLogSave).then();
                                                updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                                logger.info(responseData);
                                                return res.status(200).json(responseData);
                                            }
                                        }).catch(reason => {
                                        console.log('errSubmitInfo: ', reason.toString());
                                        if (reason.response && reason.response.status === 500) {
                                            //    update scraplog & response F070
                                            preResponse = new PreResponse(responCode.RESCODEEXT.ERRCONTRACTDATASENDING.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.ERRCONTRACTDATASENDING.code);
                                            responseData = new sendingDataFPTContractResponse(req.body, preResponse);
                                            dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                            insertDataToINQLOG(dataInqLogSave).then();
                                            updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.ERRCONTRACTDATASENDING.code).then();
                                            logger.info(responseData);
                                            logger.info(reason.toString());
                                            return res.status(200).json(responseData);
                                        }  else if (reason.message === 'timeout of 60000ms exceeded') {
                                            preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFTIMEOUTERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFTIMEOUTERR.code);
                                            responseData = new sendingDataFPTContractResponse(req.body, preResponse);
                                            dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                            insertDataToINQLOG(dataInqLogSave).then();
                                            updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFTIMEOUTERR.code).then();
                                            logger.info(responseData);
                                            logger.info(reason.toString());
                                            return res.status(200).json(responseData);
                                        } else {
                                            preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                            responseData = new sendingDataFPTContractResponse(req.body, preResponse);
                                            dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                            insertDataToINQLOG(dataInqLogSave).then();
                                            updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                            logger.info(responseData);
                                            logger.info(reason.toString());
                                            return res.status(200).json(responseData);
                                        }
                                    })
                                } else if (resultfetAuthAccess.status === 500) {
                                    //    update scraplog & response F070
                                    console.log('errGetAuthAccess: ', resultfetAuthAccess.data);
                                    preResponse = new PreResponse(responCode.RESCODEEXT.ERRCONTRACTDATASENDING.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.ERRCONTRACTDATASENDING.code);
                                    responseData = new sendingDataFPTContractResponse(req.body, preResponse);
                                    dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                    insertDataToINQLOG(dataInqLogSave).then();
                                    updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.ERRCONTRACTDATASENDING.code).then();
                                    logger.info(responseData);
                                    return res.status(200).json(responseData);
                                } else {
                                    //    update scraplog & response F048
                                    console.log('errGetAuthAccess: ', resultfetAuthAccess.data);
                                    preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                    responseData = new sendingDataFPTContractResponse(req.body, preResponse);
                                    dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                    insertDataToINQLOG(dataInqLogSave).then();
                                    updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                    logger.info(responseData);
                                    return res.status(200).json(responseData);
                                }
                            }).catch(reason => {
                            if (reason.response) {
                                console.log('errGetAuth: ', reason.response.data);
                            }
                            if (reason.response && reason.response.status === 500) {
                                //    update scraplog & response F070
                                console.log('errSubmitInfo: ', reason.toString());
                                preResponse = new PreResponse(responCode.RESCODEEXT.ERRCONTRACTDATASENDING.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.ERRCONTRACTDATASENDING.code);
                                responseData = new sendingDataFPTContractResponse(req.body, preResponse);
                                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                insertDataToINQLOG(dataInqLogSave).then();
                                updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.ERRCONTRACTDATASENDING.code).then();
                                logger.info(responseData);
                                return res.status(200).json(responseData);
                            } else if (reason.message === 'timeout of 60000ms exceeded') {
                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFTIMEOUTERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFTIMEOUTERR.code);
                                responseData = new sendingDataFPTContractResponse(req.body, preResponse);
                                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                insertDataToINQLOG(dataInqLogSave).then();
                                updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFTIMEOUTERR.code).then();
                                logger.info(responseData);
                                logger.info(reason.toString());
                                return res.status(200).json(responseData);
                            } else {
                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                responseData = new sendingDataFPTContractResponse(req.body, preResponse);
                                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                insertDataToINQLOG(dataInqLogSave).then();
                                updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
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