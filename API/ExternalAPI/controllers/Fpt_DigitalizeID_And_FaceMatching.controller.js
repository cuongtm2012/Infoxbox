const validRequest = require('../util/validateFptV01andV02request');
const axios = require('axios');
const common_service = require('../services/common.service');
const _ = require('lodash');
const PreResponse = require('../domain/preResponse.response');
const responCode = require('../../shared/constant/responseCodeExternal');
const cicExternalService = require('../services/cicExternal.service');
const path = require('path');
const __dad = path.join(__dirname, '..')
const pathToSaveImg = path.join(__dad, 'uploads');
const DataSaveToInqLog = require('../domain/data_FptId_Save_To_InqLog.save');
const responseFptDigitalizeIdAndFaceMatchingResponseWithoutResult = require('../domain/fpt_DigitalizeId_and_FaceMatching_Res_WithoutResult.response');
const responseFptDigitalizeIdAndFaceMatchingResponseWithResult = require('../domain/fpt_DigitalizeId_and_FaceMatching_Res_With_Result.response');
const util = require('../util/dateutil');
const dateutil = require('../util/dateutil');
const fs = require('fs');
const validS11AService = require('../services/validS11A.service');
const utilFunction = require('../../shared/util/util');
const DataFptIdAndFaceMatchingSaveToScapLog = require('../domain/data_Fpt_Id_and_FaceMatching_Save_To_ScrapLog.save');
const configExternal = require('../config/config')
const URI = require('../../shared/URI');
const FormData = require('form-data');
const urlGetAuth = 'account/unauth/v1/login';
const urlFptV01 = 'aggregator/api/v1/verification/v01_id';
const urlFptV02 = 'aggregator/api/v1/verification/v02_facematching';
const DataFptIdSaveToFptID = require('../domain/data_FptId_Save_To_FptId.save');
const DataSaveToFptFace = require('../domain/data_Fpt_Digital_And_FaceMatching_SaveTo_FptFace.save');
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
                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
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
                    cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                    deleteFile(req);
                    return res.status(200).json(responseData);
                } else if (_.isEmpty(dataFICode[0]) && utilFunction.checkStatusCodeScraping(responCode.OracleError, utilFunction.getOracleCode(dataFICode))) {
                    preResponse = new PreResponse(responCode.RESCODEEXT.ErrorDatabaseConnection.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.ErrorDatabaseConnection.code);
                    responseData = new responseFptDigitalizeIdAndFaceMatchingResponseWithoutResult(req.body, preResponse);
                    deleteFile(req);
                    return res.status(500).json(responseData);
                }
                //    end check parmas
                let dataInsertToScrapLog = new DataFptIdAndFaceMatchingSaveToScapLog(req.body, fullNiceKey);
                // insert rq to ScrapLog
                cicExternalService.insertDataFptRqToSCRPLOG(dataInsertToScrapLog).then(
                    result => {
                        let body = {
                            username: configExternal.AccountFptDev.username,
                            password: configExternal.AccountFptDev.password
                        }
                        // get token
                        axios.post(URI.URL_FPT_DEV + urlGetAuth, body, config).then(
                            resultGetAuth => {
                                if (resultGetAuth.data.ErrorCode === 0) {
                                    // success get auth
                                    // Prepare to call V01
                                    let bodyFormDataV01 = new FormData();
                                    let requestIdV01 = configExternal.AccountFptDev.username + '_' + dateutil.getTimeHoursNoDot() + seqRquestId;
                                    let pathToFrontImage = path.join(pathToSaveImg, req.files.frontImage[0].filename);
                                    let pathToRearImage = path.join(pathToSaveImg, req.files.rearImage[0].filename);
                                    bodyFormDataV01.append('requestId', requestIdV01);
                                    bodyFormDataV01.append('type', req.body.idType);
                                    bodyFormDataV01.append('frontImage ', fs.createReadStream(pathToFrontImage));
                                    bodyFormDataV01.append('backImage ', fs.createReadStream(pathToRearImage));
                                    let configWithAuth = {
                                        method: 'post',
                                        url: URI.URL_FPT_DEV + urlFptV01,
                                        headers: {
                                            'Content-Type': 'multipart/json',
                                            'Authorization': `Bearer ${resultGetAuth.data.Data.sessionToken}`, ...bodyFormDataV01.getHeaders()
                                        },
                                        data: bodyFormDataV01,
                                        timeout: 100 * 1000,
                                    };
                                    // call to fpt V01
                                    axios(configWithAuth).then(
                                        responseV01 => {
                                            if (responseV01.data.ErrorCode === 0) {
                                                //    success get data v01
                                                // save data to  TB_FPT_ID
                                                let dataSaveToFptId = new DataFptIdSaveToFptID(req, fullNiceKey, responseV01.data.Data, responseV01.data.ErrorCode, requestIdV01)
                                                cicExternalService.insertDataFptIdToFptId(dataSaveToFptId).then();
                                                //     prepare to call V02
                                                let bodyFormDataV02 = new FormData();
                                                let requestIdV02 = configExternal.AccountFptDev.username + '_' + dateutil.getTimeHoursNoDot() + seqRquestId;
                                                let pathToSourceImageImage = path.join(pathToSaveImg, req.files.selfieImage[0].filename);
                                                let pathToTargetImageImage = path.join(pathToSaveImg, req.files.frontImage[0].filename);
                                                bodyFormDataV02.append('requestId', requestIdV02);
                                                bodyFormDataV02.append('sourceImage', fs.createReadStream(pathToSourceImageImage));
                                                bodyFormDataV02.append('targetImage', fs.createReadStream(pathToTargetImageImage));
                                                let configWithAuth = {
                                                    method: 'post',
                                                    url: URI.URL_FPT_DEV + urlFptV02,
                                                    headers: {
                                                        'Content-Type': 'multipart/json',
                                                        'Authorization': `Bearer ${resultGetAuth.data.Data.sessionToken}`, ...bodyFormDataV02.getHeaders()
                                                    },
                                                    data: bodyFormDataV02,
                                                    timeout: 100 * 1000,
                                                };
                                                // call to fpt V02
                                                axios(configWithAuth).then(
                                                    resultV02 => {
                                                        if (resultV02.data.ErrorCode === 0) {
                                                            //    success get data v02 response p000
                                                            preResponse = new PreResponse(responCode.RESCODEEXT.NORMAL.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                                                            responseData = new responseFptDigitalizeIdAndFaceMatchingResponseWithResult(req.body, preResponse, responseV01.data.Data.frontImage, responseV01.data.Data.backImage, resultV02.data.Data);
                                                            dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                            let dataFptFaceSave = new DataSaveToFptFace(req, fullNiceKey, requestIdV02, resultV02.data);
                                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                            cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.NORMAL.code).then();
                                                            cicExternalService.insertDataToFptFace(dataFptFaceSave).then(
                                                                rs => {
                                                                    deleteFile(req);
                                                                }
                                                            ).catch(reason => {
                                                                deleteFile(req);
                                                            });
                                                            return res.status(200).json(responseData);
                                                        }  else if (resultV02.data.ErrorCode === 1451 || resultV02.data.ErrorCode === 1455) {
                                                            // response F064
                                                            console.log('message: ', resultV02.data.Message);
                                                            deleteFile(req);
                                                            preResponse = new PreResponse(responCode.RESCODEEXT.INVALIDINPUTIMAGE.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.INVALIDINPUTIMAGE.code);
                                                            responseData = new responseFptDigitalizeIdAndFaceMatchingResponseWithoutResult(req.body, preResponse);
                                                            dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                            cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.INVALIDINPUTIMAGE.code).then();
                                                            return res.status(200).json(responseData);
                                                        } else if (resultV02.data.ErrorCode === 1453 || resultV02.data.ErrorCode === 1653) {
                                                            // response F065
                                                            console.log('message: ', resultV02.data.Message);
                                                            deleteFile(req);
                                                            preResponse = new PreResponse(responCode.RESCODEEXT.UNABLETOVERIFYOCR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.UNABLETOVERIFYOCR.code);
                                                            responseData = new responseFptDigitalizeIdAndFaceMatchingResponseWithoutResult(req.body, preResponse);
                                                            dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                            cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.UNABLETOVERIFYOCR.code).then();
                                                            return res.status(200).json(responseData);
                                                        }  else if (resultV02.data.ErrorCode === 1456 || resultV02.data.ErrorCode === 1551) {
                                                            // response F066
                                                            console.log('message: ', resultV02.data.Message);
                                                            deleteFile(req);
                                                            preResponse = new PreResponse(responCode.RESCODEEXT.FACEMATCHINGFAILURE.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.FACEMATCHINGFAILURE.code);
                                                            responseData = new responseFptDigitalizeIdAndFaceMatchingResponseWithoutResult(req.body, preResponse);
                                                            dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                            cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.FACEMATCHINGFAILURE.code).then();
                                                            return res.status(200).json(responseData);
                                                        } else {
                                                            //  response F048
                                                            console.log('message: ', resultV02.data.Message);
                                                            deleteFile(req);
                                                            preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                            responseData = new responseFptDigitalizeIdAndFaceMatchingResponseWithoutResult(req.body, preResponse);
                                                            dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                            cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                                            return res.status(200).json(responseData);
                                                        }
                                                    }
                                                ).catch(reason => {
                                                    // response F048
                                                    console.log('Error when call FPT v02: ', reason);
                                                    deleteFile(req);
                                                    preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                    responseData = new responseFptDigitalizeIdAndFaceMatchingResponseWithoutResult(req.body, preResponse);
                                                    dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                    cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                    cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                                    return res.status(200).json(responseData);
                                                })
                                            } else if (responseV01.data.ErrorCode === 1451 || responseV01.data.ErrorCode === 1455) {
                                                // response F064
                                                console.log('message: ', responseV01.data.Message);
                                                deleteFile(req);
                                                preResponse = new PreResponse(responCode.RESCODEEXT.INVALIDINPUTIMAGE.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.INVALIDINPUTIMAGE.code);
                                                responseData = new responseFptDigitalizeIdAndFaceMatchingResponseWithoutResult(req.body, preResponse);
                                                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.INVALIDINPUTIMAGE.code).then();
                                                return res.status(200).json(responseData);
                                            } else if (responseV01.data.ErrorCode === 1453 || responseV01.data.ErrorCode === 1653) {
                                                // response F065
                                                console.log('message: ', responseV01.data.Message);
                                                deleteFile(req);
                                                preResponse = new PreResponse(responCode.RESCODEEXT.UNABLETOVERIFYOCR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.UNABLETOVERIFYOCR.code);
                                                responseData = new responseFptDigitalizeIdAndFaceMatchingResponseWithoutResult(req.body, preResponse);
                                                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.UNABLETOVERIFYOCR.code).then();
                                                return res.status(200).json(responseData);
                                            } else {
                                                console.log('errV01: ', responseV01.data.Message)
                                                deleteFile(req);
                                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                responseData = new responseFptDigitalizeIdAndFaceMatchingResponseWithoutResult(req.body, preResponse);
                                                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                                return res.status(200).json(responseData);
                                            }
                                        }
                                    ).catch(errV01 => {
                                        // response F048
                                        console.log('errV01: ', errV01)
                                        deleteFile(req);
                                        preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                        responseData = new responseFptDigitalizeIdAndFaceMatchingResponseWithoutResult(req.body, preResponse);
                                        dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                        cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                        cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                        return res.status(200).json(responseData);
                                    })
                                } else {
                                    deleteFile(req);
                                    //    get token err response F048
                                    console.log('Error when get token FPT v01: ', resultGetAuth.data.Message);
                                    preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                    responseData = new responseFptDigitalizeIdAndFaceMatchingResponseWithoutResult(req.body, preResponse);
                                    dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                    cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                    cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                    return res.status(200).json(responseData);
                                }
                            }
                        ).catch(reason => {
                            //    get token err response F048
                            deleteFile(req);
                            console.log('Error when get token FPT v01: ', reason);
                            preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                            responseData = new responseFptDigitalizeIdAndFaceMatchingResponseWithoutResult(req.body, preResponse);
                            dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                            cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                            return res.status(200).json(responseData);
                        })
                    }
                ).catch(reason => {
                    deleteFile(req);
                    return res.status(500).json({error: reason.toString()});
                })
            }).catch(reason => {
                deleteFile(req);
                return res.status(500).json({error: reason.toString()});
            })
        }).catch(reason => {
            deleteFile(req);
            return res.status(500).json({error: reason.toString()});
        })
    } catch (err) {
        deleteFile(req);
        return res.status(500).json({error: err.toString()});
    }
}


function deleteFile(req) {
    // delete file
    if (!_.isEmpty(req.files)) {
        if (!_.isEmpty(req.files.frontImage)) {
            fs.unlink(path.join(pathToSaveImg, req.files.frontImage[0].filename), function (err) {
                if (err) throw err;
                console.log('deleted frontImage ')
            });
        }

        if (!_.isEmpty(req.files.rearImage)) {
            fs.unlink(path.join(pathToSaveImg, req.files.rearImage[0].filename), function (err) {
                if (err) throw err;
                console.log('deleted rearImage ')
            });
        }
        if (!_.isEmpty(req.files.selfieImage)) {
            fs.unlink(path.join(pathToSaveImg, req.files.selfieImage[0].filename), function (err) {
                if (err) throw err;
                console.log('deleted selfieImage ')
            });
        }
    }
}