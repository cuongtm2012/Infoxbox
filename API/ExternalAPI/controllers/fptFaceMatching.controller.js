const path = require('path');
const __dad = path.join(__dirname, '..')
const pathToSaveImg = path.join(__dad, 'uploads');
const validRequest = require('../util/validateFptV02Request');
const common_service = require('../services/common.service');
const util = require('../util/dateutil');
const dateutil = require('../util/dateutil');
const responCode = require('../../shared/constant/responseCodeExternal');
const PreResponse = require('../domain/preResponse.response');
const ResponseFptFaceMatchingWithoutResult = require('../domain/fpt_FaceMatching_Res_Without_Result.response');
const ResponseFptFaceMatchingWithResult = require('../domain/fpt_FaceMatching_Res_With_Result.response');
const DataSaveToInqLog = require('../domain/data_FptId_Save_To_InqLog.save');
const DataSaveToFptFace = require('../domain/data_Fpt_FaceMatching_Save_To_FptFace.save');
const cicExternalService = require('../services/cicExternal.service');
const _ = require('lodash');
const fs = require('fs');
const validS11AService = require('../services/validS11A.service');
const DataFptFaceMatchingSaveToScapLog = require('../domain/data_Fpt_FaceMatching_Save_To_ScrapLog.save');
const configExternal = require('../config/config');
const axios = require('axios');
const urlGetAuth = 'account/unauth/v1/login';
const urlFptV02 = 'aggregator/api/v1/verification/v02_facematching';
const utilFunction = require('../../shared/util/util');
const URI = require('../../shared/URI');
const FormData = require('form-data');
exports.fptFaceMatching = function (req, res) {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 60 * 1000
        }
        //checking params
        let rsCheck = validRequest.checkParamRequest(req.body, req.files);
        let preResponse, responseData, dataInqLogSave, dataFptFaceSave;

        common_service.getSequence().then(resSeq => {
            let seqRquestId = resSeq[0].SEQ;
            let niceSessionKey = util.timeStamp2() + resSeq[0].SEQ;
            let fullNiceKey = responCode.NiceProductCode.KYC_F01_RQST.code + niceSessionKey;
            //is have invalid params
            if (!_.isEmpty(rsCheck)) {
                preResponse = new PreResponse(rsCheck.responseMessage, fullNiceKey, dateutil.timeStamp(), rsCheck.responseCode);
                responseData = new ResponseFptFaceMatchingWithoutResult(req, preResponse);
                // save Inqlog
                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                deleteFile(req);
                return res.status(200).send(responseData);
            }
            // check FI contract
            validS11AService.selectFiCode(req.body.fiCode, responCode.NiceProductCode.KYC_F02_RQST.code).then(dataFICode => {
                if (_.isEmpty(dataFICode)) {
                    preResponse = new PreResponse(responCode.RESCODEEXT.InvalidNiceProductCode.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.InvalidNiceProductCode.code);
                    responseData = new ResponseFptFaceMatchingWithoutResult(req.body, preResponse);
                    // update INQLOG
                    dataInqLogSave = new DataSaveToInqLog(req.body, responseData);
                    cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                    deleteFile(req);
                    return res.status(200).json(responseData);
                } else if (_.isEmpty(dataFICode[0]) && utilFunction.checkStatusCodeScraping(responCode.OracleError, utilFunction.getOracleCode(dataFICode))) {
                    preResponse = new PreResponse(responCode.RESCODEEXT.ErrorDatabaseConnection.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.ErrorDatabaseConnection.code);
                    responseData = new ResponseFptFaceMatchingWithoutResult(req.body, preResponse);
                    deleteFile(req);
                    return res.status(500).json(responseData);
                }
                //    end check parmas
                let dataInsertToScrapLog = new DataFptFaceMatchingSaveToScapLog(req.body, fullNiceKey);
                // insert rq to ScrapLog
                cicExternalService.insertDataFptRqToSCRPLOG(dataInsertToScrapLog).then(
                    result => {
                        let body = {
                            username: configExternal.AccountFptDev.username,
                            password: configExternal.AccountFptDev.password
                        }
                        axios.post(URI.URL_FPT_DEV + urlGetAuth, body, config).then(
                            resultGetAuth => {
                                if (resultGetAuth.data.ErrorCode === 0) {
                                    // success get auth
                                    // Prepare to call V02
                                    let bodyFormDataV02 = new FormData();
                                    let requestId = configExternal.AccountFptDev.username + '_' + dateutil.getTimeHoursNoDot() + seqRquestId;
                                    let pathToSourceImageImage = path.join(pathToSaveImg, req.files.sourceImage[0].filename);
                                    let pathToTargetImageImage = path.join(pathToSaveImg, req.files.targetImage[0].filename);
                                    bodyFormDataV02.append('requestId', requestId);
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
                                                responseData = new ResponseFptFaceMatchingWithResult(req.body, preResponse, resultV02.data.Data);
                                                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                dataFptFaceSave = new DataSaveToFptFace(req,fullNiceKey,requestId,resultV02.data);
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
                                                responseData = new ResponseFptFaceMatchingWithoutResult(req.body, preResponse);
                                                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.INVALIDINPUTIMAGE.code).then();
                                                return res.status(200).json(responseData);
                                            } else if (resultV02.data.ErrorCode === 1453 || resultV02.data.ErrorCode === 1653) {
                                                // response F065
                                                console.log('message: ', resultV02.data.Message);
                                                deleteFile(req);
                                                preResponse = new PreResponse(responCode.RESCODEEXT.UNABLETOVERIFYOCR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.UNABLETOVERIFYOCR.code);
                                                responseData = new ResponseFptFaceMatchingWithoutResult(req.body, preResponse);
                                                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.UNABLETOVERIFYOCR.code).then();
                                                return res.status(200).json(responseData);
                                            }  else if (resultV02.data.ErrorCode === 1456 || resultV02.data.ErrorCode === 1551) {
                                                // response F066
                                                console.log('message: ', resultV02.data.Message);
                                                deleteFile(req);
                                                preResponse = new PreResponse(responCode.RESCODEEXT.FACEMATCHINGFAILURE.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.FACEMATCHINGFAILURE.code);
                                                responseData = new ResponseFptFaceMatchingWithoutResult(req.body, preResponse);
                                                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.FACEMATCHINGFAILURE.code).then();
                                                return res.status(200).json(responseData);
                                            } else {
                                                //  response F048
                                                console.log('message: ', resultV02.data.Message);
                                                deleteFile(req);
                                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                responseData = new ResponseFptFaceMatchingWithoutResult(req.body, preResponse);
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
                                        responseData = new ResponseFptFaceMatchingWithoutResult(req.body, preResponse);
                                        dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                        cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                        cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                        return res.status(200).json(responseData);
                                    })
                                } else {
                                    // response F048
                                    console.log('Error when get token FPT v01: ', resultGetAuth.data.Message);
                                    deleteFile(req);
                                    preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                    responseData = new ResponseFptFaceMatchingWithoutResult(req.body, preResponse);
                                    dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                    cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                    cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                    return res.status(200).json(responseData);
                                }
                            }
                        ).catch(reason => {
                            //    get token err response F048
                            deleteFile(req);
                            preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                            responseData = new ResponseFptFaceMatchingWithoutResult(req.body, preResponse);
                            dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                            cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                            return res.status(200).json(responseData);
                        })
                    }).catch(reason => {
                    deleteFile(req);
                    return res.status(500).json({error: reason.toString()});
                })
            }).catch(reason => {
                deleteFile(req);
                return res.status(500).json({error: reason.toString()});
            });
        }).catch(reason => {
            deleteFile(req);
            return res.status(500).json({error: reason.toString()});
        });
    } catch (err) {
        deleteFile(req);
        return res.status(500).json({error: err.toString()});
    }
}

function deleteFile(req) {
    // delete file
    if (!_.isEmpty(req.files)) {
        if (!_.isEmpty(req.files.sourceImage)) {
            fs.unlink(path.join(pathToSaveImg, req.files.sourceImage[0].filename), function (err) {
                if (err) throw err;
                console.log('deleted sourceImage ')
            });
        }

        if (!_.isEmpty(req.files.targetImage)) {
            fs.unlink(path.join(pathToSaveImg, req.files.targetImage[0].filename), function (err) {
                if (err) throw err;
                console.log('deleted targetImage ')
            });
        }
    }
}