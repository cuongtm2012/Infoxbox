const validRequest = require('../../util/validateFTN_GCT_RQST_TMP.request');
const responCode = require('../../../shared/constant/responseCodeExternal');
const PreResponse = require('../../domain/preResponse.response');
const DataSaveToInqLog = require('../../domain/data_FptId_Save_To_InqLog.save');
const cicExternalService = require('../../services/cicExternal.service');
const dateutil = require('../../util/dateutil');
const util = require('../../util/dateutil');
const _ = require('lodash');
const common_service = require('../../services/common.service');
const logger = require('../../config/logger');
const responseContractDownloadApi = require('../../domain/responseContractDownloadAPI_TMP.response')
const validS11AService = require('../../services/validS11A.service');
const utilFunction = require('../../../shared/util/util');
const httpClient = require('../../services/httpClient.service');
const URI = require('../../../shared/URI');
const bodyGetAuthEContract = require('../../domain/bodyGetTokenEcontract.body');
const fs = require('fs');
const convertBase64 = require('../../../shared/util/convertBase64ToText');
exports.contractDownloadApi_TMP = function (req, res) {
    try {
        let rsCheck = validRequest.checkParamRequest(req.query);
        logger.info(req.query);
        let preResponse, responseData, dataInqLogSave, filename;
        common_service.getSequence().then(resSeq => {
            let niceSessionKey = util.timeStamp2() + resSeq[0].SEQ;
            let fullNiceKey = responCode.NiceProductCode.FTN_GCT_RQST.code + niceSessionKey;
            if (!_.isEmpty(rsCheck)) {
                preResponse = new PreResponse(rsCheck.responseMessage, '', dateutil.timeStamp(), rsCheck.responseCode);
                responseData = new responseContractDownloadApi(req.query, preResponse);
                // save Inqlog
                dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                logger.info(responseData);
                return res.status(200).send(responseData);
            } else {
                validS11AService.selectFiCode(req.query.fiCode, responCode.NiceProductCode.FTN_GCT_RQST.code).then(dataFICode => {
                    if (_.isEmpty(dataFICode)) {
                        preResponse = new PreResponse(responCode.RESCODEEXT.InvalidNiceProductCode.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.InvalidNiceProductCode.code);
                        responseData = new responseContractDownloadApi(req.query, preResponse);
                        // update INQLOG
                        dataInqLogSave = new DataSaveToInqLog(req.query, responseData);
                        cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                        logger.info(responseData);
                        return res.status(200).json(responseData);
                    } else if (_.isEmpty(dataFICode[0]) && utilFunction.checkStatusCodeScraping(responCode.OracleError, utilFunction.getOracleCode(dataFICode))) {
                        preResponse = new PreResponse(responCode.RESCODEEXT.ErrorDatabaseConnection.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.ErrorDatabaseConnection.code);
                        responseData = new responseContractDownloadApi(req.query, preResponse);
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
                                    let URlDownloadContract = URI.URL_E_CONTRACT_DOWNLOAD_API_DEV + req.query.id;
                                    let token = `Bearer ${resultGetAuthAccess.data.access_token}`;
                                    httpClient.superagentGetStreamType(URlDownloadContract, '', token).then(
                                        resultDownload => {
                                            if (resultDownload.status === 200 && !_.isEmpty(resultDownload.data)) {
                                                preResponse = new PreResponse(responCode.RESCODEEXT.NORMAL.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                                                responseData = new responseContractDownloadApi(req.query, preResponse);
                                                logger.info(responseData);
                                                filename = fullNiceKey + '.pdf';
                                                fs.writeFile(filename, resultDownload.data, 'binary', (error) => {
                                                    if (error) throw error;
                                                    console.log("Doc saved!");
                                                    convertPdfToBase64(filename).then(
                                                        resultConvertBase64 => {
                                                            dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                                            logger.info(responseData);
                                                            responseData.contractContent = resultConvertBase64;
                                                            deleteFile(filename);
                                                            // fs.writeFile('result_document.pdf', resultConvertBase64, 'base64', (error) => {
                                                            //     if (error) throw error;
                                                            //     console.log("Doc saved!");
                                                            // });
                                                            return res.status(200).json(responseData);
                                                        }).catch(reason => {
                                                        console.log('errResultDownload: ', reason.res.statusMessage);
                                                        preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                        responseData = new responseContractDownloadApi(req.query, preResponse);
                                                        dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                                        cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                                        logger.info(responseData);
                                                        logger.info(resultDownload.data);
                                                        return res.status(200).json(responseData);
                                                    })
                                                });
                                            } else {
                                                //    update scraplog & response F048
                                                console.log('errResultDownload: ', resultDownload);
                                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                responseData = new responseContractDownloadApi(req.query, preResponse);
                                                dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                                logger.info(responseData);
                                                logger.info(resultDownload.data);
                                                return res.status(200).json(responseData);
                                            }
                                        }).catch(reason => {
                                        console.log('errResultDownload: ', reason.toString());
                                        deleteFile(filename);
                                        if (reason && reason.status=== 500) {
                                            preResponse = new PreResponse(responCode.RESCODEEXT.NoContractForInputId.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.NoContractForInputId.code);
                                            responseData = new responseContractDownloadApi(req.query, preResponse);
                                            dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                            logger.info(responseData);
                                            return res.status(200).json(responseData);
                                        } else if (reason.code === 'ETIMEDOUT' || reason.errno === 'ETIMEDOUT') {
                                            preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFTIMEOUTERR.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFTIMEOUTERR.code);
                                            responseData = new responseContractDownloadApi(req.query, preResponse);
                                            dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                            logger.info(responseData);
                                            logger.info(reason.toString());
                                            return res.status(200).json(responseData);
                                        } else {
                                            preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                            responseData = new responseContractDownloadApi(req.query, preResponse);
                                            dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
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
                                    cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                    logger.info(responseData);
                                    logger.info(resultGetAuthAccess.data);
                                    return res.status(200).json(responseData);
                                }
                            }).catch(reason => {
                            console.log('errGetAuthAccess: ', reason.toString());
                            if (reason && reason.status === 401) {
                                preResponse = new PreResponse(responCode.RESCODEEXT.LoginFailure.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.LoginFailure.code);
                                responseData = new responseContractDownloadApi(req.query, preResponse);
                                dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                logger.info(responseData);
                                return res.status(200).json(responseData);
                            } if (reason && reason.status=== 500) {
                                preResponse = new PreResponse(responCode.RESCODEEXT.NoContractForInputId.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.NoContractForInputId.code);
                                responseData = new responseContractDownloadApi(req.query, preResponse);
                                dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                logger.info(responseData);
                                return res.status(200).json(responseData);
                            } else if (reason.code === 'ETIMEDOUT' || reason.errno === 'ETIMEDOUT') {
                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFTIMEOUTERR.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFTIMEOUTERR.code);
                                responseData = new responseContractDownloadApi(req.query, preResponse);
                                dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                logger.info(responseData);
                                logger.info(reason.toString());
                                return res.status(200).json(responseData);
                            } else {
                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                responseData = new responseContractDownloadApi(req.query, preResponse);
                                dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
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

async function convertPdfToBase64(filename) {
    try {
        return new Promise((resolve, reject) => {
            fs.readFile(filename, function read(err, data) {
                if (err) {
                    reject(err);
                }
                resolve(data.toString("base64"));
            });
        });
    } catch (e) {
        logger.error(e);
        return e;
    }
}

function deleteFile(file) {
    try {
        if (!_.isEmpty(file)) {
            fs.unlink(file, function (err) {
                if (err) throw err;
                console.log('deleted fdf file')
            });
        }
    } catch (e) {
        console.log(e)
    }
}