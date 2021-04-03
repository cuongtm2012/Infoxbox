import validRequest from '../../util/validateFTN_GCT_RQSTRequest.js';
import responCode from '../../../shared/constant/responseCodeExternal.js';
import PreResponse from '../../domain/preResponse.response.js';
import DataSaveToInqLog from '../../domain/data_FptId_Save_To_InqLog.save.js';
import {insertDataToINQLOG, } from '../../services/cicExternal.service.js';
import dateutil from '../../util/dateutil.js';
import util from '../../util/dateutil.js';
import _ from 'lodash';
import commonServiceGetSequence from '../../services/common.service.js';
import logger from '../../config/logger.js';
import {responseContractDownloadApi} from '../../domain/responseContractDownloadApi.response.js';
import validS11AServiceSelectFiCode from '../../services/validS11A.service.js';
import utilFunction from '../../../shared/util/util.js';
import {axiosPost, axiosGet} from '../../services/httpClient.service.js';
import URI from '../../../shared/URI.js';
import bodyGetAuthEContract from '../../domain/bodyGetAuthEContract.body.js';
import fs from 'fs';
export function contractDownloadApi (req, res) {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 60 * 1000
        }
        let rsCheck = validRequest.checkParamRequest(req.query);
        logger.info(req.query);
        let preResponse, responseData, dataInqLogSave, filename;
        commonServiceGetSequence().then(resSeq => {
            let niceSessionKey = util.timeStamp2() + resSeq[0].SEQ;
            let fullNiceKey = responCode.NiceProductCode.FTN_GCT_RQST.code + niceSessionKey;
            if (!_.isEmpty(rsCheck)) {
                preResponse = new PreResponse(rsCheck.responseMessage, '', dateutil.timeStamp(), rsCheck.responseCode);
                responseData = new responseContractDownloadApi(req.query, preResponse);
                // save Inqlog
                dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                insertDataToINQLOG(dataInqLogSave).then();
                logger.info(responseData);
                return res.status(200).send(responseData);
            } else {
                validS11AServiceSelectFiCode(req.query.fiCode, responCode.NiceProductCode.FTN_GCT_RQST.code).then(dataFICode => {
                    if (_.isEmpty(dataFICode)) {
                        preResponse = new PreResponse(responCode.RESCODEEXT.InvalidNiceProductCode.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.InvalidNiceProductCode.code);
                        responseData = new responseContractDownloadApi(req.query, preResponse);
                        // update INQLOG
                        dataInqLogSave = new DataSaveToInqLog(req.query, responseData);
                        insertDataToINQLOG(dataInqLogSave).then();
                        logger.info(responseData);
                        return res.status(200).json(responseData);
                    } else if (_.isEmpty(dataFICode[0]) && utilFunction.checkStatusCodeScraping(responCode.OracleError, utilFunction.getOracleCode(dataFICode))) {
                        preResponse = new PreResponse(responCode.RESCODEEXT.ErrorDatabaseConnection.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.ErrorDatabaseConnection.code);
                        responseData = new responseContractDownloadApi(req.query, preResponse);
                        logger.info(responseData);
                        return res.status(500).json(responseData);
                    } else {
                        //    getAuthAccess
                        let bodyGetAuth = new bodyGetAuthEContract();
                        axiosPost(URI.URL_E_CONTRACT_GET_TOKEN_ACCESS_DEV, bodyGetAuth, config).then(
                            resultGetAuthAccess => {
                                if (!_.isEmpty(resultGetAuthAccess.data.access_token)) {
                                    let URlDownloadContract = URI.URL_E_CONTRACT_DOWNLOAD_API_DEV + req.query.id;
                                    let configDownloadContract = {
                                        headers: {
                                            'Authorization': `Bearer ${resultGetAuthAccess.data.access_token}`
                                        },
                                        timeout: 60 * 1000,
                                        responseType: "stream"
                                    }
                                    axiosGet(URlDownloadContract, configDownloadContract).then(
                                        resultDownload => {
                                            if (resultDownload.status === 200 && !_.isEmpty(resultDownload.data)) {
                                                preResponse = new PreResponse(responCode.RESCODEEXT.NORMAL.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                                                responseData = new responseContractDownloadApi(req.query, preResponse);
                                                logger.info(responseData);
                                                filename = fullNiceKey + '.pdf';
                                                let saveFile = resultDownload.data.pipe(fs.createWriteStream(filename));
                                                convertPdfToBase64(filename, saveFile).then(
                                                    resultConvertBase64 => {
                                                        dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                                        insertDataToINQLOG(dataInqLogSave).then();
                                                        responseData.contractContent = resultConvertBase64;
                                                        deleteFile(filename);
                                                        // fs.writeFile('result_document.pdf', resultConvertBase64, 'base64', (error) => {
                                                        //     if (error) throw error;
                                                        //     console.log("Doc saved!");
                                                        // });
                                                        return res.status(200).json(responseData);
                                                    }).catch(reason => {
                                                    console.log('errResultDownload: ', reason.toString());
                                                    preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                    responseData = new responseContractDownloadApi(req.query, preResponse);
                                                    dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                                    insertDataToINQLOG(dataInqLogSave).then();
                                                    logger.info(responseData);
                                                    logger.info(resultDownload.data);
                                                    return res.status(200).json(responseData);
                                                })
                                            } else {
                                                //    update scraplog & response F048
                                                console.log('errResultDownload: ', resultDownload);
                                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                responseData = new responseContractDownloadApi(req.query, preResponse);
                                                dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                                insertDataToINQLOG(dataInqLogSave).then();
                                                logger.info(responseData);
                                                logger.info(resultDownload.data);
                                                return res.status(200).json(responseData);
                                            }
                                        }).catch(reason => {
                                        console.log('errResultDownload: ', reason.toString());
                                        deleteFile(filename);
                                        if (reason.response && reason.response.data.message === ('Internal Server Error: Envelope is not exist: ' + req.query.id)) {
                                            console.log('errResultDownload: ', reason.response.data.message);
                                            preResponse = new PreResponse(responCode.RESCODEEXT.NoContractForInputId.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.NoContractForInputId.code);
                                            responseData = new responseContractDownloadApi(req.query, preResponse);
                                            dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                            insertDataToINQLOG(dataInqLogSave).then();
                                            logger.info(responseData);
                                            logger.info(reason.toString());
                                            return res.status(200).json(responseData);
                                        } else if (reason.message === 'timeout of 60000ms exceeded') {
                                            preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFTIMEOUTERR.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFTIMEOUTERR.code);
                                            responseData = new responseContractDownloadApi(req.query, preResponse);
                                            dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                            insertDataToINQLOG(dataInqLogSave).then();
                                            logger.info(responseData);
                                            logger.info(reason.toString());
                                            return res.status(200).json(responseData);
                                        } else if (reason.message === 'Request failed with status code 500') {
                                            preResponse = new PreResponse(responCode.RESCODEEXT.NoContractForInputId.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.NoContractForInputId.code);
                                            responseData = new responseContractDownloadApi(req.query, preResponse);
                                            dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                            insertDataToINQLOG(dataInqLogSave).then();
                                            logger.info(responseData);
                                            logger.info(reason.toString());
                                            return res.status(200).json(responseData);
                                        } else {
                                            preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                            responseData = new responseContractDownloadApi(req.query, preResponse);
                                            dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                            insertDataToINQLOG(dataInqLogSave).then();
                                            logger.info(responseData);
                                            logger.info(reason.toString());
                                            return res.status(200).json(responseData);
                                        }
                                    })
                                } else {
                                    //    update scraplog & response F048
                                    console.log('errGetAuthAccess: ', resultGetAuthAccess);
                                    preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                    responseData = new responseContractDownloadApi(req.query, preResponse);
                                    dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                    insertDataToINQLOG(dataInqLogSave).then();
                                    logger.info(responseData);
                                    logger.info(resultGetAuthAccess.data);
                                    return res.status(200).json(responseData);
                                }
                            }).catch(reason => {
                            console.log('errGetAuthAccess: ', reason.toString());
                            if (reason.message === 'timeout of 60000ms exceeded') {
                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFTIMEOUTERR.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFTIMEOUTERR.code);
                                responseData = new responseContractDownloadApi(req.query, preResponse);
                                dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                insertDataToINQLOG(dataInqLogSave).then();
                                logger.info(responseData);
                                logger.info(reason.toString());
                                return res.status(200).json(responseData);
                            } else {
                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                responseData = new responseContractDownloadApi(req.query, preResponse);
                                dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                insertDataToINQLOG(dataInqLogSave).then();
                                logger.info(responseData);
                                logger.info(reason.toString());
                                return res.status(200).json(responseData);
                            }
                        })
                    }
                }).catch(reason => {
                    deleteFile(filename);
                    logger.error(reason.toString());
                    return res.status(500).json({error: reason.toString()});
                })
            }
        }).catch(reason => {
            deleteFile(filename);
            logger.error(reason.toString());
            return res.status(500).json({error: reason.toString()});
        })
    } catch (err) {
        logger.error(err.toString());
        return res.status(500).json({error: err.toString()});
    }
}

async function convertPdfToBase64(filename, saveFile) {
    return new Promise((resolve, reject) => {
        saveFile.on('finish', function () {
            fs.readFile(filename, function read(err, data) {
                if (err) {
                    reject();
                }
                resolve(data.toString("base64"));
            });
        });
    });
}

function deleteFile(file) {
    if (!_.isEmpty(file)) {
        fs.unlink(file, function (err) {
            if (err) throw err;
            console.log('deleted fdf file')
        });
    }
}