const RCS_M01_RQSTRes_Without_Result = require('../domain/RCS_M01_RQST.response');
const RCS_M01_RQSTRes_With_Result = require('../domain/MainScoreResponseWith_Result.response');
const PreResponse = require('../domain/preResponse.response');
const bodyPostRclips = require('../domain/bodyPostRclips.body');
const bodyPostVmgCAC1 = require('../domain/bodyPostVmgCAC1.body');
const dataCAC1SaveToVmgLocPct = require('../domain/dataCAC1SaveToVmgLocPct.save');
const dataCAC1SaveToVmgAddress = require('../domain/dataVmgCacSaveToVmgAddress.save');
const validRCS_M01_RQST = require('../util/validateRCSM01ParamRequest');
const _ = require('lodash');
const common_service = require('../services/common.service');
const responCode = require('../../shared/constant/responseCodeExternal');
const DataSaveToInqLog = require('../domain/data_FptId_Save_To_InqLog.save');
const cicExternalService = require('../services/cicExternal.service');
const validS11AService = require('../services/validS11A.service');
const utilFunction = require('../../shared/util/util');
const util = require('../util/dateutil');
const dateutil = require('../util/dateutil');
const dataMainScoreSaveToScrapLog = require('../domain/dataMainScoreSaveToScrapLog.save');
const URI = require('../../shared/URI');
const axios = require('axios');
exports.rcs_M01_RQST = function (req, res) {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 60 * 1000
        }
        // var a = '[{"timerange":"0h-7h","homepercent":-1,"workpercent":-1,"referpercent":-1},{"timerange":"8h-12h","homepercent":-1,"workpercent":-1,"referpercent":-1},{"timerange":"13h-18h","homepercent":-1,"workpercent":-1,"referpercent":-1},{"timerange":"19h-23h","homepercent":-1,"workpercent":-1,"referpercent":-1},{"timerange":"0h-24h","homepercent":83,"workpercent":8,"referpercent":8}]';
        // var b = JSON.parse(a);
        // var c = [];
        // c = b;
        // console.log(c[0].timerange);
        // check parameters request
        let rsCheck = validRCS_M01_RQST.checkRCSM01ParamRequest(req.body);
        let preResponse, responseData, dataInqLogSave;
        common_service.getSequence().then(resSeq => {
            let niceSessionKey = util.timeStamp2() + resSeq[0].SEQ;
            let fullNiceKey = responCode.NiceProductCode.RCS_M01_RQST.code + niceSessionKey;
            if (!_.isEmpty(rsCheck)) {
                preResponse = new PreResponse(rsCheck.responseMessage, fullNiceKey, dateutil.timeStamp(), rsCheck.responseCode);
                responseData = new RCS_M01_RQSTRes_Without_Result(req.body, preResponse);
                // update INQLOG
                dataInqLogSave = new DataSaveToInqLog(req.body, responseData);
                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                return res.status(200).json(responseData);
            }
            // check FI contract
            validS11AService.selectFiCode(req.body.fiCode, responCode.NiceProductCode.RCS_M01_RQST.code).then(dataFICode => {
                if (_.isEmpty(dataFICode)) {
                    preResponse = new PreResponse(responCode.RESCODEEXT.InvalidNiceProductCode.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.InvalidNiceProductCode.code);
                    responseData = new RCS_M01_RQSTRes_Without_Result(req.body, preResponse);
                    // update INQLOG
                    dataInqLogSave = new DataSaveToInqLog(req.body, responseData);
                    cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                    return res.status(200).json(responseData);
                } else if (_.isEmpty(dataFICode[0]) && utilFunction.checkStatusCodeScraping(responCode.OracleError, utilFunction.getOracleCode(dataFICode))) {
                    preResponse = new PreResponse(responCode.RESCODEEXT.ErrorDatabaseConnection.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.ErrorDatabaseConnection.code);
                    responseData = new RCS_M01_RQSTRes_Without_Result(req.body, preResponse);
                    return res.status(500).json(responseData);
                }
                // end check params reqest
                // checkParamRClips
                cicExternalService.selectPhoneNumberAndNatIDFromScrapLog(req.body.cicNiceSessionKey, req.body.fiCode).then(
                    ParamRClips => {
                        if (ParamRClips.NATL_ID) {
                            let dataSaveToScraplog = new dataMainScoreSaveToScrapLog(req.body, fullNiceKey);
                            // insert to ScrapLog
                            cicExternalService.insertDataReqToSCRPLOG(dataSaveToScraplog).then(
                                result => {
                                    let bodyRclipsReq = new bodyPostRclips(req.body.phoneNumber, ParamRClips.NATL_ID, '2', '1', '', '', 'RCS_M01_RQST')
                                    //    call Rclips
                                    axios.post(URI.URL_RCLIPS_DEVELOP, bodyRclipsReq, config).then(
                                        resultRclips => {
                                            if (resultRclips.data.listResult) {
                                                //    success get data Rclips
                                                let bodyCAC1 = new bodyPostVmgCAC1(req.body);
                                                //    call VMG CAC1
                                                axios.post(URI.URL_VMG_DEV, bodyCAC1, config).then(
                                                    resultCAC1 => {
                                                        if ((resultCAC1.data.error_code === 0 || resultCAC1.data.error_code === 20) && resultCAC1.data.result) {
                                                            preResponse = new PreResponse(responCode.RESCODEEXT.NORMAL.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                                                            responseData = new RCS_M01_RQSTRes_With_Result(req.body, preResponse, resultCAC1.data);
                                                            dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                            let dataSaveToVmgLocPct = new dataCAC1SaveToVmgLocPct(fullNiceKey, resultCAC1.data);
                                                            let dataSaveToVmgAddress = new dataCAC1SaveToVmgAddress(fullNiceKey, resultCAC1.data);
                                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                            cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.NORMAL.code).then();
                                                            cicExternalService.insertDataToVmgLocPct(dataSaveToVmgLocPct).then();
                                                            cicExternalService.insertDataToVmgAddress(dataSaveToVmgAddress).then();
                                                            return res.status(200).json(responseData);
                                                        } else if (resultCAC1.data.error_code === 4) {
                                                            preResponse = new PreResponse(responCode.RESCODEEXT.NODATAEXIST.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.NODATAEXIST.code);
                                                            responseData = new RCS_M01_RQSTRes_Without_Result(req.body, preResponse);
                                                            dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                            cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.NODATAEXIST.code).then();
                                                            return res.status(200).json(responseData);
                                                        } else {
                                                            preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                            responseData = new RCS_M01_RQSTRes_Without_Result(req.body, preResponse);
                                                            dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                            cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                                            return res.status(200).json(responseData);
                                                        }
                                                    }
                                                ).catch(reason => {
                                                    console.log('err: ', reason.toString());
                                                    preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                    responseData = new RCS_M01_RQSTRes_Without_Result(req.body, preResponse);
                                                    dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                    cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                    cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                                    return res.status(200).json(responseData);
                                                })
                                            } else {
                                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                responseData = new RCS_M01_RQSTRes_Without_Result(req.body, preResponse);
                                                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                                return res.status(200).json(responseData);
                                            }
                                        }).catch(reason => {
                                        console.log("err:", reason.toString());
                                        preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                        responseData = new RCS_M01_RQSTRes_Without_Result(req.body, preResponse);
                                        dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                        cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                        cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                        return res.status(200).json(responseData);
                                    })
                                }
                            ).catch(reason => {
                                return res.status(500).json({error: reason.toString()});
                            })
                        } else {
                            preResponse = new PreResponse(responCode.RESCODEEXT.NOTEXIST.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.NOTEXIST.code);
                            responseData = new RCS_M01_RQSTRes_Without_Result(req.body, preResponse);
                            // update INQLOG
                            dataInqLogSave = new DataSaveToInqLog(req.body, responseData);
                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                            return res.status(200).json(responseData);
                        }
                    }).catch(reason => {
                    return res.status(500).json({error: reason.toString()});
                })
            }).catch(reason => {
                return res.status(500).json({error: reason.toString()});
            });
        }).catch(reason => {
            return res.status(500).json({error: reason.toString()});
        });
    } catch (error) {
        return res.status(500).json({error: error.toString()});
    }
};