const logger = require('../../config/logger');
const validRequest = require('../../util/validateFptV01andV02request');
const httpClient = require('../../services/httpClient.service');
const common_service = require('../../services/common.service');
const _ = require('lodash');
const PreResponse = require('../../domain/preResponse.response');
const responCode = require('../../../shared/constant/responseCodeExternal');
const cicExternalService = require('../../services/cicExternal.service');
const path = require('path');
const __dad = path.join(__dirname, '..')
const pathToSaveImg = path.join(__dad, 'uploads');
const DataSaveToInqLog = require('../../domain/data_FptId_Save_To_InqLog.save');
const responseFptDigitalizeIdAndFaceMatchingResponseWithoutResult = require('../../domain/fpt_DigitalizeId_and_FaceMatching_Res_WithoutResult.response');
const responseFptDigitalizeIdAndFaceMatchingResponseWithResult = require('../../domain/fpt_DigitalizeId_and_FaceMatching_Res_With_Result.response');
const util = require('../../util/dateutil');
const dateutil = require('../../util/dateutil');
const fs = require('fs');
const validS11AService = require('../../services/validS11A.service');
const utilFunction = require('../../../shared/util/util');
const DataFptIdAndFaceMatchingSaveToScapLog = require('../../domain/data_Fpt_Id_and_FaceMatching_Save_To_ScrapLog.save');
const configExternal = require('../../config/config')
const URI = require('../../../shared/URI');
const FormData = require('form-data');
const DataFptIdSaveToFptID = require('../../domain/data_FptId_Save_To_FptId.save');
const DataSaveToFptFace = require('../../domain/data_Fpt_Digital_And_FaceMatching_SaveTo_FptFace.save');
const DEFAULT_VALUE1 = 0.75;
exports.fptDigitalizeIdAndFaceMatching = function (req, res) {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 60 * 1000
        }
        let rsCheck = validRequest.checkParamRequest(req.body, req.files);
        let preResponse, responseData, dataInqLogSave;

        common_service.getSequence().then(resSeq => {
            let seqRquestId = resSeq[0].SEQ;
            let niceSessionKey = util.timeStamp2() + resSeq[0].SEQ;
            let fullNiceKey = responCode.NiceProductCode.KYC_FI1_RQST.code + niceSessionKey;
            //is have invalid params
            if (!_.isEmpty(rsCheck)) {
                preResponse = new PreResponse(rsCheck.responseMessage, fullNiceKey, dateutil.timeStamp(), rsCheck.responseCode);
                responseData = new responseFptDigitalizeIdAndFaceMatchingResponseWithoutResult(req.body, preResponse);
                // save Inqlog
                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                logger.info(responseData);
                deleteFile(req);
                return res.status(200).send(responseData);
            }
            // check FI contract
            validS11AService.selectFiCode(req.body.fiCode, responCode.NiceProductCode.KYC_FI1_RQST.code).then(dataFICode => {
                if (_.isEmpty(dataFICode)) {
                    preResponse = new PreResponse(responCode.RESCODEEXT.InvalidNiceProductCode.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.InvalidNiceProductCode.code);
                    responseData = new responseFptDigitalizeIdAndFaceMatchingResponseWithoutResult(req.body, preResponse);
                    // update INQLOG
                    dataInqLogSave = new DataSaveToInqLog(req.body, responseData);
                    cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                    logger.info(responseData);
                    deleteFile(req);
                    return res.status(200).json(responseData);
                } else if (_.isEmpty(dataFICode[0]) && utilFunction.checkStatusCodeScraping(responCode.OracleError, utilFunction.getOracleCode(dataFICode))) {
                    preResponse = new PreResponse(responCode.RESCODEEXT.ErrorDatabaseConnection.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.ErrorDatabaseConnection.code);
                    responseData = new responseFptDigitalizeIdAndFaceMatchingResponseWithoutResult(req.body, preResponse);
                    logger.info(responseData);
                    deleteFile(req);
                    return res.status(500).json(responseData);
                }
                //    end check parmas
                // get value1
                cicExternalService.selectValue1InFiCriManage(req.body.fiCode, 300).then(
                    resultValue1 => {
                        let value1 = resultValue1.VALUE1 ? resultValue1.VALUE1 : DEFAULT_VALUE1;
                        //
                        let dataInsertToScrapLog = new DataFptIdAndFaceMatchingSaveToScapLog(req.body, fullNiceKey);
                        // insert rq to ScrapLog
                        cicExternalService.insertDataReqToSCRPLOG(dataInsertToScrapLog).then(
                            result => {
                                let body = {
                                    username: configExternal.AccountFptDev.username,
                                    password: configExternal.AccountFptDev.password
                                }
                                // get token
                                httpClient.superagentPost(URI.URL_FPT_DEV_GetAuth, body).then(
                                    resultGetAuth => {
                                        if (resultGetAuth.data.ErrorCode === 0) {
                                            // success get auth
                                            // Prepare to call V01
                                            let token = `Bearer ${resultGetAuth.data.Data.sessionToken}`;
                                            let requestIdV01 = configExternal.AccountFptDev.username + '_' + dateutil.getTimeHoursNoDot() + seqRquestId;
                                            // call to fpt V01
                                            httpClient.superagentPostMultipartV01(URI.URL_FPT_DEV_V01, token, requestIdV01, req.body.idType, req.body.frontImage, req.body.idType.toUpperCase() === 'ID' ? req.body.rearImage : '').then(
                                                responseV01 => {
                                                    if (responseV01.data.ErrorCode === 0) {
                                                        //    success get data v01
                                                        // save data to  TB_FPT_ID
                                                        let dataSaveToFptId = new DataFptIdSaveToFptID(req, fullNiceKey, responseV01.data.Data, responseV01.data.ErrorCode, requestIdV01)
                                                        cicExternalService.insertDataFptIdToFptId(dataSaveToFptId).then().catch();
                                                        //     prepare to call V02
                                                        let requestIdV02 = configExternal.AccountFptDev.username + '_' + dateutil.getTimeHoursNoDot() + seqRquestId;
                                                        // call to fpt V02
                                                        httpClient.superagentPostMultipartV02(URI.URL_FPT_DEV_V02, token, requestIdV02, req.body.frontImage, req.body.selfieImage).then(
                                                            resultV02 => {
                                                                if (resultV02.data.ErrorCode === 0) {
                                                                    //    success get data v02 response p000
                                                                    preResponse = new PreResponse(responCode.RESCODEEXT.NORMAL.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                                                                    responseData = new responseFptDigitalizeIdAndFaceMatchingResponseWithResult(req.body, preResponse, responseV01.data.Data.frontImage, responseV01.data.Data.backImage, resultV02.data.Data, value1);
                                                                    dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                                    let dataFptFaceSave = new DataSaveToFptFace(req, fullNiceKey, requestIdV02, resultV02.data);
                                                                    cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                                                    cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.NORMAL.code).then().catch();
                                                                    cicExternalService.insertDataToFptFace(dataFptFaceSave).then(
                                                                        rs => {
                                                                            deleteFile(req);
                                                                        }
                                                                    ).catch(reason => {
                                                                        deleteFile(req);
                                                                    });
                                                                    logger.info(responseData);
                                                                    return res.status(200).json(responseData);
                                                                } else if (resultV02.data.ErrorCode === 1451 || resultV02.data.ErrorCode === 1455) {
                                                                    // response F064
                                                                    console.log('message: ', resultV02.data.Message);
                                                                    deleteFile(req);
                                                                    preResponse = new PreResponse(responCode.RESCODEEXT.INVALIDINPUTIMAGE.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.INVALIDINPUTIMAGE.code);
                                                                    responseData = new responseFptDigitalizeIdAndFaceMatchingResponseWithoutResult(req.body, preResponse);
                                                                    dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                                    cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                                                    cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.INVALIDINPUTIMAGE.code).then().catch();
                                                                    logger.info(responseData);
                                                                    logger.info(resultV02.data.Message);
                                                                    return res.status(200).json(responseData);
                                                                } else if (resultV02.data.ErrorCode === 1453 || resultV02.data.ErrorCode === 1653) {
                                                                    // response F065
                                                                    console.log('message: ', resultV02.data.Message);
                                                                    deleteFile(req);
                                                                    preResponse = new PreResponse(responCode.RESCODEEXT.UNABLETOVERIFYOCR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.UNABLETOVERIFYOCR.code);
                                                                    responseData = new responseFptDigitalizeIdAndFaceMatchingResponseWithoutResult(req.body, preResponse);
                                                                    dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                                    cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                                                    cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.UNABLETOVERIFYOCR.code).then().catch();
                                                                    logger.info(responseData);
                                                                    logger.info(resultV02.data.Message);
                                                                    return res.status(200).json(responseData);
                                                                } else if (resultV02.data.ErrorCode === 1456 || resultV02.data.ErrorCode === 1551) {
                                                                    // response F066
                                                                    console.log('message: ', resultV02.data.Message);
                                                                    deleteFile(req);
                                                                    preResponse = new PreResponse(responCode.RESCODEEXT.FACEMATCHINGFAILURE.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.FACEMATCHINGFAILURE.code);
                                                                    responseData = new responseFptDigitalizeIdAndFaceMatchingResponseWithoutResult(req.body, preResponse);
                                                                    dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                                    cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                                                    cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.FACEMATCHINGFAILURE.code).then().catch();
                                                                    logger.info(responseData);
                                                                    logger.info(resultV02.data.Message);
                                                                    return res.status(200).json(responseData);
                                                                } else {
                                                                    //  response F048
                                                                    console.log('message: ', resultV02.data.Message);
                                                                    deleteFile(req);
                                                                    preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                                    responseData = new responseFptDigitalizeIdAndFaceMatchingResponseWithoutResult(req.body, preResponse);
                                                                    dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                                    cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                                                    cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then().catch();
                                                                    logger.info(responseData);
                                                                    logger.info(resultV02.data.Message);
                                                                    return res.status(200).json(responseData);
                                                                }
                                                            }
                                                        ).catch(reason => {
                                                            console.log('Error when call FPT v02: ', reason.toString());
                                                            if (reason.code === 'ETIMEDOUT' || reason.errno === 'ETIMEDOUT') {
                                                                deleteFile(req);
                                                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFTIMEOUTERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFTIMEOUTERR.code);
                                                                responseData = new responseFptDigitalizeIdAndFaceMatchingResponseWithoutResult(req.body, preResponse);
                                                                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFTIMEOUTERR.code).then().catch();
                                                                logger.info(responseData);
                                                                logger.info(reason.toString());
                                                                return res.status(200).json(responseData);
                                                            } else {
                                                                deleteFile(req);
                                                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                                responseData = new responseFptDigitalizeIdAndFaceMatchingResponseWithoutResult(req.body, preResponse);
                                                                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then().catch()
                                                                logger.info(responseData);
                                                                logger.info(reason.toString());
                                                                return res.status(200).json(responseData);
                                                            }
                                                        })
                                                    } else if (responseV01.data.ErrorCode === 1451 || responseV01.data.ErrorCode === 1455) {
                                                        // response F064
                                                        console.log('messageV01: ', responseV01.data.Message);
                                                        deleteFile(req);
                                                        preResponse = new PreResponse(responCode.RESCODEEXT.INVALIDINPUTIMAGE.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.INVALIDINPUTIMAGE.code);
                                                        responseData = new responseFptDigitalizeIdAndFaceMatchingResponseWithoutResult(req.body, preResponse);
                                                        dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                        cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                                        cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.INVALIDINPUTIMAGE.code).then().catch();
                                                        logger.info(responseData);
                                                        logger.info(responseV01.data.Message);
                                                        return res.status(200).json(responseData);
                                                    } else if (responseV01.data.ErrorCode === 1453 || responseV01.data.ErrorCode === 1653) {
                                                        // response F065
                                                        console.log('messageV01: ', responseV01.data.Message);
                                                        deleteFile(req);
                                                        preResponse = new PreResponse(responCode.RESCODEEXT.UNABLETOVERIFYOCR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.UNABLETOVERIFYOCR.code);
                                                        responseData = new responseFptDigitalizeIdAndFaceMatchingResponseWithoutResult(req.body, preResponse);
                                                        dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                        cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                                        cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.UNABLETOVERIFYOCR.code).then().catch();
                                                        logger.info(responseData);
                                                        logger.info(responseV01.data.Message);
                                                        return res.status(200).json(responseData);
                                                    } else {
                                                        console.log('messageV01: ', responseV01.data.Message)
                                                        deleteFile(req);
                                                        preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                        responseData = new responseFptDigitalizeIdAndFaceMatchingResponseWithoutResult(req.body, preResponse);
                                                        dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                        cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                                        cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then().catch();
                                                        logger.info(responseData);
                                                        logger.info(responseV01.data.Message);
                                                        return res.status(200).json(responseData);
                                                    }
                                                }
                                            ).catch(errV01 => {
                                                console.log('errV01: ', errV01.toString())
                                                if (errV01.code === 'ETIMEDOUT' || errV01.errno === 'ETIMEDOUT') {
                                                    deleteFile(req);
                                                    preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFTIMEOUTERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFTIMEOUTERR.code);
                                                    responseData = new responseFptDigitalizeIdAndFaceMatchingResponseWithoutResult(req.body, preResponse);
                                                    dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                    cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                                    cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFTIMEOUTERR.code).then().catch();
                                                    logger.info(responseData);
                                                    logger.info(errV01.toString());
                                                    return res.status(200).json(responseData);
                                                } else {
                                                    deleteFile(req);
                                                    preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                    responseData = new responseFptDigitalizeIdAndFaceMatchingResponseWithoutResult(req.body, preResponse);
                                                    dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                    cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                                    cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then().catch();
                                                    logger.info(responseData);
                                                    logger.info(errV01.toString());
                                                    return res.status(200).json(responseData);
                                                }
                                            })
                                        } else {
                                            deleteFile(req);
                                            //    get token err response F048
                                            console.log('Error when get token FPT v01: ', resultGetAuth.data.Message);
                                            preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                            responseData = new responseFptDigitalizeIdAndFaceMatchingResponseWithoutResult(req.body, preResponse);
                                            dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                            cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then().catch();
                                            logger.info(responseData);
                                            logger.info(resultGetAuth.data.Message);
                                            return res.status(200).json(responseData);
                                        }
                                    }
                                ).catch(reason => {
                                    console.log('Error when get token FPT v01: ', reason.toString());
                                    if (reason.code === 'ETIMEDOUT' || reason.errno === 'ETIMEDOUT') {
                                        deleteFile(req);
                                        preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFTIMEOUTERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFTIMEOUTERR.code);
                                        responseData = new responseFptDigitalizeIdAndFaceMatchingResponseWithoutResult(req.body, preResponse);
                                        dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                        cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                        cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFTIMEOUTERR.code).then().catch();
                                        logger.info(responseData);
                                        logger.info(reason.toString());
                                        return res.status(200).json(responseData);
                                    } else {
                                        //    get token err response F048
                                        deleteFile(req);
                                        preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                        responseData = new responseFptDigitalizeIdAndFaceMatchingResponseWithoutResult(req.body, preResponse);
                                        dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                        cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                        cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then().catch();
                                        logger.info(responseData);
                                        logger.info(reason.toString());
                                        return res.status(200).json(responseData);
                                    }
                                })
                            }
                        ).catch(reason => {
                            logger.error(reason.toString());
                            deleteFile(req);
                            return res.status(500).json({error: reason.toString()});
                        })
                    }
                ).catch(reason => {
                    logger.error(reason.toString());
                    deleteFile(req);
                    return res.status(500).json({error: reason.toString()});
                });
            }).catch(reason => {
                logger.error(reason.toString());
                deleteFile(req);
                return res.status(500).json({error: reason.toString()});
            })
        }).catch(reason => {
            logger.error(reason.toString());
            deleteFile(req);
            return res.status(500).json({error: reason.toString()});
        })
    } catch (err) {
        logger.error(err.toString());
        deleteFile(req);
        return res.status(500).json({error: err.toString()});
    }
}


function deleteFile(req) {
    // delete file
    if (!_.isEmpty(req.files)) {
        if (!_.isEmpty(req.files.frontImage)) {
            fs.unlink(req.files.frontImage.path, function (err) {
                if (err) throw err;
                console.log('deleted frontImage ')
            });
        }

        if (!_.isEmpty(req.files.rearImage)) {
            fs.unlink(req.files.rearImage.path, function (err) {
                if (err) throw err;
                console.log('deleted rearImage ')
            });
        }
        if (!_.isEmpty(req.files.selfieImage)) {
            fs.unlink(req.files.selfieImage.path, function (err) {
                if (err) throw err;
                console.log('deleted selfieImage ')
            });
        }
    }
}
