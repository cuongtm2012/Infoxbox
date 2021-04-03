import logger from '../../config/logger.js';
import validRequest from '../../util/validateCheckStatusContractRequest.js';
import responCode from '../../../shared/constant/responseCodeExternal.js';
import PreResponse from '../../domain/preResponse.response.js';
import DataSaveToInqLog from '../../domain/data_FptId_Save_To_InqLog.save.js';
import { insertDataToINQLOG, insertDataFPTContractToSCRPLOG, updateRspCdScrapLogAfterGetResult} from '../../services/cicExternal.service.js';
import dateutil from '../../util/dateutil.js';
import util from '../../util/dateutil.js';
import _ from 'lodash';
import commonServiceGetSequence from '../../services/common.service.js';
import {statusOfContractResponse} from '../../domain/statusOfContractResponseWithoutResult.response.js'
import {statusOfContractResponseWithResult} from '../../domain/reponseStatusOfContractWithResult.response.js'
import validS11AServiceSelectFiCode from '../../services/validS11A.service.js';
import utilFunction from '../../../shared/util/util.js';
import {dataStatusContractSaveToScrapLog} from '../../domain/dataStatusOfContractSaveToScrapLog.save.js';
import {axiosPost, axiosGet, httpsGet, superagentGet, superagentPost} from '../../services/httpClient.service.js';
import URI from '../../../shared/URI.js';
import bodyGetAuthEContract from '../../domain/bodyGetAuthEContract.body.js';
import {bodyPostVmgKYC2} from '../../domain/bodyVmg_KYC_2.body.js';
import axios from 'axios';
import {registerInterceptor} from 'axios-cached-dns-resolve';
import config from '../../config/config.js';
const axiosClient = axios.create(config.configCacheAxios);
registerInterceptor(axiosClient);
export function statusOfContract (req, res) {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 60 * 1000
        }
        const test = {
            mobilePhoneNumber: '0964785596',
            natId: '001096002249'
        }
        let rsCheck = validRequest.checkParamRequest(req.query);
        logger.info(req.query);
        let preResponse, responseData, dataInqLogSave;
        commonServiceGetSequence().then(resSeq => {
            let niceSessionKey = util.timeStamp2() + resSeq[0].SEQ;
            let fullNiceKey = responCode.NiceProductCode.FTN_SCD_RQST.code + niceSessionKey;
            if (!_.isEmpty(rsCheck)) {
                preResponse = new PreResponse(rsCheck.responseMessage, fullNiceKey, dateutil.timeStamp(), rsCheck.responseCode);
                responseData = new statusOfContractResponse(req.query, preResponse);
                // save Inqlog
                dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                insertDataToINQLOG(dataInqLogSave).then();
                logger.info(responseData);
                return res.status(200).send(responseData);
            }
            // check FI contract
            validS11AServiceSelectFiCode(req.query.fiCode, responCode.NiceProductCode.FTN_CSS_RQST.code).then(dataFICode => {
                if (_.isEmpty(dataFICode)) {
                    preResponse = new PreResponse(responCode.RESCODEEXT.InvalidNiceProductCode.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.InvalidNiceProductCode.code);
                    responseData = new statusOfContractResponse(req.query, preResponse);
                    // update INQLOG
                    dataInqLogSave = new DataSaveToInqLog(req.query, responseData);
                    insertDataToINQLOG(dataInqLogSave).then();
                    logger.info(responseData);
                    return res.status(200).json(responseData);
                } else if (_.isEmpty(dataFICode[0]) && utilFunction.checkStatusCodeScraping(responCode.OracleError, utilFunction.getOracleCode(dataFICode))) {
                    preResponse = new PreResponse(responCode.RESCODEEXT.ErrorDatabaseConnection.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.ErrorDatabaseConnection.code);
                    responseData = new statusOfContractResponse(req.query, preResponse);
                    logger.info(responseData);
                    return res.status(500).json(responseData);

                }
                //    end check parmas
                let dataInsertToScrapLog = new dataStatusContractSaveToScrapLog(req.query, fullNiceKey);
                // insert rq to ScrapLog
                insertDataFPTContractToSCRPLOG(dataInsertToScrapLog).then(
                    result => {
                        //    getAuthAccess
                        // let bodyGetAuth = new bodyGetAuthEContract();
                        let bodyK2 = new bodyPostVmgKYC2(test.natId);
                        superagentPost(URI.URL_VMG_DEV, bodyK2, config).then(
                            resultGetAuthAccess => {
                                if (!_.isEmpty(resultGetAuthAccess)) {
                                //    get status contract
                                    console.log(resultGetAuthAccess.data.error_code)
                                    let URlGetStatusContract = URI.URL_E_CONTRACT_GET_STATUS_DEV + req.query.id;
                                    let configGetStatus = {
                                        headers: {
                                            'Content-Type': 'application/json',
                                            'Authorization': `Bearer ${resultGetAuthAccess.data.access_token}`
                                        },
                                        timeout: 60 * 1000
                                    }
                                    let headers = {
                                        'Content-Type': 'application/json',
                                        'Authorization': `Bearer ${resultGetAuthAccess.data.access_token}`
                                    }
                                    superagentGet('https://dev-partner.score.dmp.zaloapp.com/v1/api/auth?username=partner&password=password', {} , `Bearer`).then(
                                        resultGetStatus => {
                                            if (resultGetStatus.status === 200 && !_.isEmpty(resultGetStatus.data)) {
                                            //    success P000
                                                console.log('message: ',  resultGetStatus.data.message);
                                                preResponse = new PreResponse(responCode.RESCODEEXT.NORMAL.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                                                responseData = new statusOfContractResponse(req.query, preResponse);                                                dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                                insertDataToINQLOG(dataInqLogSave).then();
                                                updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.NORMAL.code).then();
                                                logger.info(responseData);
                                                logger.info({resultFromFpt: resultGetStatus.data});
                                                return res.status(200).json(responseData);
                                            } else if (resultGetStatus.status === 500) {
                                                //    update scraplog & response F072
                                                console.log('errGetStatus: ', resultGetStatus);
                                                preResponse = new PreResponse(responCode.RESCODEEXT.ERRCONTRACTSTATUS.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.ERRCONTRACTSTATUS.code);
                                                responseData = new statusOfContractResponse(req.query, preResponse);
                                                dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                                insertDataToINQLOG(dataInqLogSave).then();
                                                updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.ERRCONTRACTSTATUS.code).then();
                                                logger.info(responseData);
                                                logger.info(resultGetStatus.data);
                                                return res.status(200).json(responseData);
                                            } else {
                                                //    update scraplog & response F048
                                                console.log('errGetStatus: ', resultGetStatus);
                                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                responseData = new statusOfContractResponse(req.query, preResponse);
                                                dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                                insertDataToINQLOG(dataInqLogSave).then();
                                                updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                                logger.info(responseData);
                                                logger.info(resultGetStatus.data);
                                                return res.status(200).json(responseData);
                                            }
                                        }
                                    ).catch(reason => {
                                        console.log('errGetStatus: ', reason.toString());
                                        if (reason.response && reason.response.status === 500) {
                                            //    update scraplog & response F072
                                            preResponse = new PreResponse(responCode.RESCODEEXT.ERRCONTRACTSTATUS.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.ERRCONTRACTSTATUS.code);
                                            responseData = new statusOfContractResponse(req.query, preResponse);
                                            dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                            insertDataToINQLOG(dataInqLogSave).then();
                                            updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.ERRCONTRACTSTATUS.code).then();
                                            logger.info(responseData);
                                            logger.info(reason.toString());
                                            return res.status(200).json(responseData);
                                        } else if (reason.message === 'timeout of 60000ms exceeded') {
                                            preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFTIMEOUTERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFTIMEOUTERR.code);
                                            responseData = new statusOfContractResponse(req.query, preResponse);
                                            dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                            insertDataToINQLOG(dataInqLogSave).then();
                                            updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFTIMEOUTERR.code).then();
                                            logger.info(responseData);
                                            logger.info(reason.toString());
                                            return res.status(200).json(responseData);
                                        } else {
                                            preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                            responseData = new statusOfContractResponse(req.query, preResponse);
                                            dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                            insertDataToINQLOG(dataInqLogSave).then();
                                            updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                            logger.info(responseData);
                                            logger.info(reason.toString());
                                            return res.status(200).json(responseData);
                                        }
                                    })
                                } else if (resultGetAuthAccess.status === 500) {
                                    //    update scraplog & response F072
                                    console.log('errGetAuth: ', resultGetAuthAccess);
                                    preResponse = new PreResponse(responCode.RESCODEEXT.ERRCONTRACTSTATUS.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.ERRCONTRACTSTATUS.code);
                                    responseData = new statusOfContractResponse(req.query, preResponse);
                                    dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                    insertDataToINQLOG(dataInqLogSave).then();
                                    updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.ERRCONTRACTSTATUS.code).then();
                                    logger.info(responseData);
                                    logger.info(resultGetAuthAccess.data);
                                    return res.status(200).json(responseData);
                                } else {
                                    //    update scraplog & response F048
                                    console.log('errGetAuth: ', resultGetAuthAccess);
                                    preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                    responseData = new statusOfContractResponse(req.query, preResponse);
                                    dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                    insertDataToINQLOG(dataInqLogSave).then();
                                    updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                    logger.info(responseData);
                                    logger.info(resultGetAuthAccess.data);
                                    return res.status(200).json(responseData);
                                }
                            }).catch(reason => {
                            console.log('errGetAuth: ', reason.toString());
                            if (reason.response && reason.response.status === 500) {
                                //    update scraplog & response F072
                                preResponse = new PreResponse(responCode.RESCODEEXT.ERRCONTRACTSTATUS.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.ERRCONTRACTSTATUS.code);
                                responseData = new statusOfContractResponse(req.query, preResponse);
                                dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                insertDataToINQLOG(dataInqLogSave).then();
                                updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.ERRCONTRACTSTATUS.code).then();
                                logger.info(responseData);
                                logger.info(reason.toString());
                                return res.status(200).json(responseData);
                            } else if (reason.message === 'timeout of 60000ms exceeded') {
                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFTIMEOUTERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFTIMEOUTERR.code);
                                responseData = new statusOfContractResponse(req.query, preResponse);
                                dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                insertDataToINQLOG(dataInqLogSave).then();
                                updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFTIMEOUTERR.code).then();
                                logger.info(responseData);
                                logger.info(reason.toString());
                                return res.status(200).json(responseData);
                            } else {
                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                responseData = new statusOfContractResponse(req.query, preResponse);
                                dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
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
        }).catch(reason => {
            logger.error(reason.toString());
            return res.status(500).json({error: reason.toString()});
        })
    } catch (err) {
        logger.error(err.toString());
        return res.status(500).json({error: err.toString()});
    }
}
