const validRequest = require('../util/validateFptV01Request');
const axios = require('axios');
const common_service = require('../services/common.service');
const responCode = require('../../shared/constant/responseCodeExternal');
const _ = require('lodash');
const PreResponse = require('../domain/preResponse.response');
const dateutil = require('../util/dateutil');
const ResponseFptIdWithoutResult = require('../domain/FptId_Res_Without_Result.response');
const ResponseFptWithResult = require('../domain/FptId_Rs_With_Result.response');
const DataFptIdSaveToInqLog = require('../domain/data_FptId_Save_To_InqLog.save');
const DataFptIdSaveToScapLog = require('../domain/data_FptId_Save_To_ScapLog.save');
const DataFptIdSaveToFptID = require('../domain/data_FptId_Save_To_FptId.save');
const util = require('../util/dateutil');
const cicExternalService = require('../services/cicExternal.service');
const fs = require('fs');
const pathToFile = './uploads/'
const validS11AService = require('../services/validS11A.service');
const utilFunction = require('../../shared/util/util');
const configExternal = require('../config/config')
const urlGetAuth = 'account/unauth/v1/login';
const urlFptV01 = 'aggregator/api/v1/verification/v01_id';
const URI = require('../../shared/URI');
const FormData = require('form-data');
const path = require('path');
const __dad = path.join(__dirname, '..')
const pathToSaveImg = path.join(__dad, 'uploads');
exports.fptFaceMatch = function (req, res) {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 60 * 1000
        }
        //checking params
        let rsCheck = validRequest.checkParamRequest(req.body, req.files);
        let preResponse, responseData, dataInqLogSave, dataScoreFptId;

        common_service.getSequence().then(resSeq => {
            let seqRquestId = resSeq[0].SEQ;
            let niceSessionKey = util.timeStamp2() + resSeq[0].SEQ;
            let fullNiceKey = responCode.NiceProductCode.KYC_F01_RQST.code + niceSessionKey;
            //is have invalid params
            if (!_.isEmpty(rsCheck)) {
                preResponse = new PreResponse(rsCheck.responseMessage, fullNiceKey, dateutil.timeStamp(), rsCheck.responseCode);
                responseData = new ResponseFptIdWithoutResult(req, preResponse);
                // save Inqlog
                dataInqLogSave = new DataFptIdSaveToInqLog(req.body, preResponse);
                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                deleteFileApiFptId(req);
                return res.status(200).send(responseData);
            }
            // check FI contract
            validS11AService.selectFiCode(req.body.fiCode, responCode.NiceProductCode.VMG_RISK_SCORE.code).then(dataFICode => {
                if (_.isEmpty(dataFICode)) {
                    preResponse = new PreResponse(responCode.RESCODEEXT.InvalidNiceProductCode.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.InvalidNiceProductCode.code);
                    responseData = new ResponseFptIdWithoutResult(req.body, preResponse);
                    // update INQLOG
                    dataInqLogSave = new DataFptIdSaveToInqLog(req.body, responseData);
                    cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                    deleteFileApiFptId(req);
                    return res.status(200).json(responseData);
                } else if (_.isEmpty(dataFICode[0]) && utilFunction.checkStatusCodeScraping(responCode.OracleError, utilFunction.getOracleCode(dataFICode))) {
                    preResponse = new PreResponse(responCode.RESCODEEXT.ErrorDatabaseConnection.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.ErrorDatabaseConnection.code);
                    responseData = new ResponseFptIdWithoutResult(req.body, preResponse);
                    deleteFileApiFptId(req);
                    return res.status(500).json(responseData);
                }
                //    end check parmas
                let dataInsertToScrapLog = new DataFptIdSaveToScapLog(req.body, fullNiceKey);
                // insert rq to ScrapLog
                cicExternalService.insertDataFptIdToSCRPLOG(dataInsertToScrapLog).then(
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
                                    let requestId = configExternal.AccountFptDev.username + '_' + dateutil.getTimeHoursNoDot() + seqRquestId;
                                    let pathToFrontImage = path.join(pathToSaveImg,req.files.frontImage[0].filename);
                                    let pathToRearImage = path.join(pathToSaveImg, req.files.rearImage[0].filename);
                                    bodyFormDataV01.append('requestId', requestId);
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
                                                //    success get data v01 response p000
                                                preResponse = new PreResponse(responCode.RESCODEEXT.NORMAL.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                                                responseData = new ResponseFptWithResult(req.body, preResponse, responseV01.data.Data.frontImage, responseV01.data.Data.backImage);
                                                dataInqLogSave = new DataFptIdSaveToInqLog(req.body, preResponse);
                                                let dataSaveToFptId = new DataFptIdSaveToFptID(req, fullNiceKey, responseV01.data.Data, responseV01.data.ErrorCode, requestId)
                                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.NORMAL.code).then();
                                                cicExternalService.insertDataFptIdToFptId(dataSaveToFptId).then(
                                                    result => {
                                                        deleteFileApiFptId(req);
                                                    }
                                                ).catch(reason => {
                                                    deleteFileApiFptId(req);
                                                    console.log(reason);
                                                })
                                                return res.status(200).json(responseData);
                                            } else if (responseV01.data.ErrorCode === 1451 || responseV01.data.ErrorCode === 1455) {
                                                // response F064
                                                console.log('message: ', responseV01.data.Message);
                                                deleteFileApiFptId(req);
                                                preResponse = new PreResponse(responCode.RESCODEEXT.INVALIDINPUTIMAGE.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.INVALIDINPUTIMAGE.code);
                                                responseData = new ResponseFptIdWithoutResult(req.body, preResponse);
                                                dataInqLogSave = new DataFptIdSaveToInqLog(req.body, preResponse);
                                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.INVALIDINPUTIMAGE.code).then();
                                                return res.status(200).json(responseData);
                                            } else if (responseV01.data.ErrorCode === 1453 || responseV01.data.ErrorCode === 1653) {
                                                // response F065
                                                console.log('message: ', responseV01.data.Message);
                                                deleteFileApiFptId(req);
                                                preResponse = new PreResponse(responCode.RESCODEEXT.UNABLETOVERIFYOCR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.UNABLETOVERIFYOCR.code);
                                                responseData = new ResponseFptIdWithoutResult(req.body, preResponse);
                                                dataInqLogSave = new DataFptIdSaveToInqLog(req.body, preResponse);
                                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.UNABLETOVERIFYOCR.code).then();
                                                return res.status(200).json(responseData);
                                            } else {
                                                //  response F048
                                                console.log('message: ', responseV01.data.Message);
                                                deleteFileApiFptId(req);
                                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                responseData = new ResponseFptIdWithoutResult(req.body, preResponse);
                                                dataInqLogSave = new DataFptIdSaveToInqLog(req.body, preResponse);
                                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                                return res.status(200).json(responseData);
                                            }
                                        }
                                    ).catch(errV01 => {
                                        // response F048
                                        deleteFileApiFptId(req);
                                        preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                        responseData = new ResponseFptIdWithoutResult(req.body, preResponse);
                                        dataInqLogSave = new DataFptIdSaveToInqLog(req.body, preResponse);
                                        cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                        cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                        return res.status(200).json(responseData);
                                    })
                                } else {
                                    // response F048
                                    console.log('Error when get token FPT v01: ', responseV01.data.Message);
                                    deleteFileApiFptId(req);
                                    preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                    responseData = new ResponseFptIdWithoutResult(req.body, preResponse);
                                    dataInqLogSave = new DataFptIdSaveToInqLog(req.body, preResponse);
                                    cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                    cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                    return res.status(200).json(responseData);
                                }
                            }
                        ).catch(reason => {
                            //    get token err response F048
                            deleteFileApiFptId(req);
                            preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                            responseData = new ResponseFptIdWithoutResult(req.body, preResponse);
                            dataInqLogSave = new DataFptIdSaveToInqLog(req.body, preResponse);
                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                            cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                            return res.status(200).json(responseData);
                        })
                    }
                ).catch(reason => {
                    deleteFileApiFptId(req);
                    return res.status(500).json({error: reason.toString()});
                })
            }).catch(reason => {
                deleteFileApiFptId(req);
                return res.status(500).json({error: reason.toString()});
            });
        }).catch(reason => {
            deleteFileApiFptId(req);
            return res.status(500).json({error: reason.toString()});
        });
        ;
    } catch (err) {
        deleteFileApiFptId(req);
        return res.status(500).json({error: err.toString()});
    }
}

function deleteFileApiFptId(req) {
    // delete file
    if (!_.isEmpty(req.files)) {
        if (!_.isEmpty(req.files.frontImage)) {
            fs.unlink(path.join(pathToSaveImg,req.files.frontImage[0].filename), function (err) {
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
    }
}
