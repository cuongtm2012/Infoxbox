import validRequest from '../../util/validateFTN_GAS_RQSTRequest.js';
import logger from '../../config/logger.js';
import responCode from '../../../shared/constant/responseCodeExternal.js';
import PreResponse from '../../domain/preResponse.response.js';
import DataSaveToInqLog from '../../domain/data_FptId_Save_To_InqLog.save.js';
import {insertDataToINQLOG} from '../../services/cicExternal.service.js';
import dateutil from '../../util/dateutil.js';
import {getApiStructureResponseWithoutResult} from '../../domain/getApiStructureReponseWithoutResult.response.js';
import validS11AServiceSelectFiCode from '../../services/validS11A.service.js';
import utilFunction from '../../../shared/util/util.js';
import _ from 'lodash';
import bodyGetAuthEContract from '../../domain/bodyGetAuthEContract.body.js';
import {axiosPost, axiosGet} from '../../services/httpClient.service.js';
import URI from '../../../shared/URI.js';
import {responseGetApiStructureResponseWithResult} from '../../domain/responseGetStructureApiWithResult.response.js';
export function getStructureAPI (req, res) {
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
                insertDataToINQLOG(dataInqLogSave).then();
                logger.info(responseData);
                return res.status(200).send(responseData);
            } else {
                // check FI contract
                validS11AServiceSelectFiCode(req.query.fiCode, responCode.NiceProductCode.FTN_GAS_RQST.code).then(dataFICode => {
                    if (_.isEmpty(dataFICode)) {
                        preResponse = new PreResponse(responCode.RESCODEEXT.InvalidNiceProductCode.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.InvalidNiceProductCode.code);
                        responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
                        // update INQLOG
                        dataInqLogSave = new DataSaveToInqLog(req.query, responseData);
                        insertDataToINQLOG(dataInqLogSave).then();
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
                        axiosPost(URI.URL_E_CONTRACT_GET_TOKEN_ACCESS_DEV, bodyGetAuth, config).then(
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
                                    axiosGet(URlGetStructureContract, configGetStructure).then(
                                        resultGetStructure => {
                                            if (resultGetStructure.status === 200 && !_.isEmpty(resultGetStructure.data)) {
                                                preResponse = new PreResponse(responCode.RESCODEEXT.NORMAL.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                                                responseData = new responseGetApiStructureResponseWithResult(req.query, preResponse, resultGetStructure.data);
                                                dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                                insertDataToINQLOG(dataInqLogSave).then();
                                                logger.info(responseData);
                                                return res.status(200).json(responseData);
                                            } else {
                                                //    update scraplog & response F048
                                                console.log('errGetStructure: ', resultGetStructure);
                                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
                                                dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                                insertDataToINQLOG(dataInqLogSave).then();
                                                logger.info(responseData);
                                                logger.info(resultGetStructure.data);
                                                return res.status(200).json(responseData);
                                            }
                                        }).catch(reason => {
                                        console.log('errGetStructureContract: ', reason.toString());
                                        if (reason.response && reason.response.data.message === 'Internal Server Error: template  is not exists') {
                                            console.log('errGetStructureContract: ', reason.response.data.message);
                                            preResponse = new PreResponse(responCode.RESCODEEXT.NoContractTemplateForInputAlias.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.NoContractTemplateForInputAlias.code);
                                            responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
                                            dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                            insertDataToINQLOG(dataInqLogSave).then();
                                            logger.info(responseData);
                                            logger.info(reason.toString());
                                            return res.status(200).json(responseData);
                                        } else if (reason.message === 'timeout of 60000ms exceeded') {
                                            preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFTIMEOUTERR.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFTIMEOUTERR.code);
                                            responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
                                            dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                            insertDataToINQLOG(dataInqLogSave).then();
                                            logger.info(responseData);
                                            logger.info(reason.toString());
                                            return res.status(200).json(responseData);
                                        } else {
                                            preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                            responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
                                            dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                            insertDataToINQLOG(dataInqLogSave).then();
                                            logger.info(responseData);
                                            logger.info(reason.toString());
                                            return res.status(200).json(responseData);
                                        }
                                    })
                                }
                            }
                        ).catch(reason => {
                            console.log('errGetStatus: ', reason.toString());
                            if (reason.message === 'timeout of 60000ms exceeded') {
                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFTIMEOUTERR.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFTIMEOUTERR.code);
                                responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
                                dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                insertDataToINQLOG(dataInqLogSave).then();
                                logger.info(responseData);
                                logger.info(reason.toString());
                                return res.status(200).json(responseData);
                            } else {
                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
                                dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                insertDataToINQLOG(dataInqLogSave).then();
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