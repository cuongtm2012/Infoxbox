const logger = require('../../config/logger');
const validRequest = require('../../util/validateNonFinanacialScoreOkRequest');
const common_service = require('../../services/common.service');
const responCode = require('../../../shared/constant/responseCodeExternal');
const util = require('../../util/dateutil');
const _ = require('lodash');
const PreResponse = require('../../domain/preResponse.response');
const DataSaveToInqLog = require('../../domain/data_FptId_Save_To_InqLog.save');
const cicExternalService = require('../../services/cicExternal.service');
const dateutil = require('../../util/dateutil');
const NFScoreResponseWithoutResult = require('../../domain/NF_Score_OK_Res_Without_Result.response');
const NFScoreResponseWithResult = require('../../domain/NF_Score_OK_Res_With_Result.response');
const dataNFScoreSaveToScrapLog = require('../../domain/data_NF_Score_OK_Save_To_ScrapLog.save');
const bodyPostNfScore = require('../../domain/nfScorePost.Body');
const validS11AService = require('../../services/validS11A.service');
const utilFunction = require('../../../shared/util/util');
const httpClient = require('../../services/httpClient.service');
const URI = require('../../../shared/URI');
const configExternal = require('../../config/config')
const crypto = require('crypto');
const DataZaloSaveToExtScore = require('../../domain/dataZalo_Save_To_ExtScore.save');
const BodyPostRiskScore = require('../../domain/body_Post_RiskScore.body');
const DataRiskScoreSaveToExtScore = require('../../domain/Data_RiskScore_Save_To_ExtScore.save');
const DEFAULT_SCORE = -99;
const dataNfScoreRclipsSaveToExtScore = require('../../domain/dataNfScoreSaveToExtScore.save');
const qs = require('qs');
const bodyZaloScore = require('../../domain/bodyPostZaloScore.body');
const uuid = require('uuid');
exports.nonFinancialScoreOk = function (req, res) {
    try {
        //checking parameter
        let rsCheck = validRequest.checkParamRequest(req.body);
        let preResponse, responseData, dataInqLogSave, dataScoreEx;
        common_service.getSequence().then(resSeq => {
            let niceSessionKey = util.timeStamp2() + resSeq[0].SEQ;
            let fullNiceKey = responCode.NiceProductCode.OKF_SCO_RQST.code + niceSessionKey;
            if (!_.isEmpty(rsCheck)) {
                preResponse = new PreResponse(rsCheck.responseMessage, fullNiceKey, dateutil.timeStamp(), rsCheck.responseCode);
                responseData = new NFScoreResponseWithoutResult(req.body, preResponse);
                // save Inqlog
                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                logger.info(responseData);
                return res.status(200).send(responseData);
            }
            //Check duplicate
            cicExternalService.selectRecordDuplicateIn24h(req.body.mobilePhoneNumber, req.body.natId).then(
                rsCheckDuplicate => {
                    if (!_.isEmpty(rsCheckDuplicate)) {
                        // response P000
                        logger.info(rsCheckDuplicate);
                        preResponse = new PreResponse(responCode.RESCODEEXT.NORMAL.name, rsCheckDuplicate.niceSessionKey , dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                        responseData = new NFScoreResponseWithoutResult(req.body, preResponse);
                        responseData.nfGrade = rsCheckDuplicate.nfGrade;
                        responseData.cutoffResult = rsCheckDuplicate.cutoffResult;
                        dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                        cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                        logger.info(responseData);
                        return res.status(200).json(responseData);
                    } else {
                        // check FI contract
                        validS11AService.selectFiCode(req.body.fiCode, responCode.NiceProductCode.OKF_SCO_RQST.code).then(dataFICode => {
                            if (_.isEmpty(dataFICode)) {
                                preResponse = new PreResponse(responCode.RESCODEEXT.InvalidNiceProductCode.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.InvalidNiceProductCode.code);
                                responseData = new NFScoreResponseWithoutResult(req.body, preResponse);
                                // update INQLOG
                                dataInqLogSave = new DataSaveToInqLog(req.body, responseData);
                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                logger.info(responseData);
                                return res.status(200).json(responseData);
                            } else if (_.isEmpty(dataFICode[0]) && utilFunction.checkStatusCodeScraping(responCode.OracleError, utilFunction.getOracleCode(dataFICode))) {
                                preResponse = new PreResponse(responCode.RESCODEEXT.ErrorDatabaseConnection.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.ErrorDatabaseConnection.code);
                                responseData = new NFScoreResponseWithoutResult(req.body, preResponse);
                                logger.info(responseData);
                                return res.status(500).json(responseData);
                            }
                            //    end check parmas
                            let dataInsertToScrapLog = new dataNFScoreSaveToScrapLog(req.body, fullNiceKey);
                            // insert rq to ScrapLog
                            cicExternalService.insertDataNFScoreOKToSCRPLOG(dataInsertToScrapLog).then(
                                result => {
                                    let dataRqZalo = qs.stringify(configExternal.accountZaloDev)
                                    //    get token Zalo
                                    httpClient.superagentPostZaloEncodeUrl(URI.URL_ZALO_GET_AUTH_DEV, dataRqZalo).then(
                                        resultTokenAuth => {
                                            if (resultTokenAuth.data.code === 0) {
                                                // prepare call zalo score
                                                let dataZaloScoreRq = qs.stringify(new bodyZaloScore(resultTokenAuth.data.data.auth_token, req.body.mobilePhoneNumber));
                                                logger.info(dataZaloScoreRq);
                                                //    call API get zalo score
                                                httpClient.superagentPostZaloEncodeUrl(URI.URL_ZALO_GET_SCORE_DEV, dataZaloScoreRq, uuid.v4()).then(
                                                    resultGetZaloScore => {
                                                        if (resultGetZaloScore.data.code !== undefined) {
                                                            //    success get zalo score
                                                            //    save score to EXT_SCORE
                                                            logger.info(resultGetZaloScore.data);
                                                            let ZaloScore;
                                                            if (resultGetZaloScore.data.code === 0) {
                                                                ZaloScore = resultGetZaloScore.data.data.score;
                                                                dataScoreEx = new DataZaloSaveToExtScore(req.body, fullNiceKey, resultGetZaloScore.data.data.score, resultGetZaloScore.data.data.request_id);
                                                                cicExternalService.insertDataZaloToExtScore(dataScoreEx).then().catch();
                                                            } else {
                                                                logger.info(resultGetZaloScore.data);
                                                                ZaloScore = DEFAULT_SCORE;
                                                                dataScoreEx = new DataZaloSaveToExtScore(req.body, fullNiceKey, DEFAULT_SCORE, resultGetZaloScore.data.data.request_id);
                                                                cicExternalService.insertDataZaloToExtScore(dataScoreEx).then().catch();
                                                            }
                                                            //    prepare call VMG Risk Score
                                                            let bodyGetRiskScore = new BodyPostRiskScore(req.body);
                                                            logger.info(bodyGetRiskScore);
                                                            //    get RiskScore
                                                            httpClient.superagentPost(URI.URL_VMG_DEV, bodyGetRiskScore).then(
                                                                resultGetRiskScore => {
                                                                    if (resultGetRiskScore.data.error_code !== undefined) {
                                                                        //    success get Risk Score
                                                                        //    update To EXT_SCORE
                                                                        logger.info(resultGetRiskScore.data);
                                                                        let VmgScore, VmgGrade;
                                                                        if(resultGetRiskScore.data.error_code === 0) {
                                                                            VmgScore = resultGetRiskScore.data.result.nice_score.RSK_SCORE;
                                                                            VmgGrade = resultGetRiskScore.data.result.nice_score.RSK_GRADE;
                                                                            let dataRiskSaveToScoreEx = new DataRiskScoreSaveToExtScore(fullNiceKey, resultGetRiskScore.data.requestid, resultGetRiskScore.data.result.nice_score, req.body.mobilePhoneNumber);
                                                                            cicExternalService.insertDataRiskScoreToExtScore(dataRiskSaveToScoreEx).then().catch();
                                                                        } else {
                                                                            VmgScore = DEFAULT_SCORE;
                                                                            VmgGrade = DEFAULT_SCORE;
                                                                            let dataRiskSaveToScoreEx = new DataRiskScoreSaveToExtScore(fullNiceKey, resultGetRiskScore.data.requestid, {}, req.body.mobilePhoneNumber);
                                                                            cicExternalService.insertDataRiskScoreToExtScore(dataRiskSaveToScoreEx).then().catch();
                                                                        }
                                                                        //    Call Rclips
                                                                        let bodyRclispNfScore = new bodyPostNfScore(req.body.natId, fullNiceKey, req.body.mobilePhoneNumber, req.body.natId, VmgScore, VmgGrade, ZaloScore);
                                                                        logger.info(bodyRclispNfScore);
                                                                        httpClient.superagentPost(URI.URL_RCLIPS_DEVELOP, bodyRclispNfScore).then(
                                                                            resultRclipsNF => {
                                                                                if (resultRclipsNF.data.listResult !== undefined) {
                                                                                    // response P000
                                                                                    logger.info(resultRclipsNF.data);
                                                                                    preResponse = new PreResponse(responCode.RESCODEEXT.NORMAL.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                                                                                    responseData = new NFScoreResponseWithResult(req.body, preResponse, resultRclipsNF.data);
                                                                                    dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                                                    let dataSaveToExtScore = new dataNfScoreRclipsSaveToExtScore(fullNiceKey, resultRclipsNF.data.listResult, req.body.mobilePhoneNumber);
                                                                                    cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                                                                    cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.NORMAL.code).then().catch();
                                                                                    cicExternalService.insertDataToExtScore(dataSaveToExtScore).then().catch();
                                                                                    logger.info(resultRclipsNF.data.listResult);
                                                                                    logger.info(responseData);
                                                                                    return res.status(200).json(responseData);
                                                                                } else {
                                                                                    //    update scraplog & response F048
                                                                                    console.log('errRclips', resultRclipsNF.data);
                                                                                    logger.info(resultRclipsNF.data);
                                                                                    preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                                                    responseData = new NFScoreResponseWithoutResult(req.body, preResponse);
                                                                                    dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                                                    cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                                                                    cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then().catch();
                                                                                    logger.info(responseData);
                                                                                    logger.info(resultRclipsNF.data);
                                                                                    return res.status(200).json(responseData);
                                                                                }
                                                                            }
                                                                        ).catch(reason => {
                                                                            if (reason.code === 'ETIMEDOUT' || reason.errno === 'ETIMEDOUT') {
                                                                                console.log('errRclips', reason.toString());
                                                                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFTIMEOUTERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFTIMEOUTERR.code);
                                                                                responseData = new NFScoreResponseWithoutResult(req.body, preResponse);
                                                                                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                                                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFTIMEOUTERR.code).then().catch();
                                                                                logger.info(responseData);
                                                                                logger.info(reason.toString());
                                                                                return res.status(200).json(responseData);
                                                                            } else {
                                                                                //    update scraplog & response F048
                                                                                console.log('errRclips', reason.toString());
                                                                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                                                responseData = new NFScoreResponseWithoutResult(req.body, preResponse);
                                                                                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                                                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then().catch();
                                                                                logger.info(responseData);
                                                                                logger.info(reason.toString());
                                                                                return res.status(200).json(responseData);
                                                                            }
                                                                        })
                                                                    }  else if (resultGetRiskScore.data.error_code === 4) {
                                                                        //    update scraplog & response F052
                                                                        console.log('errRiskscore:',resultGetRiskScore.data.error_msg);
                                                                        preResponse = new PreResponse(responCode.RESCODEEXT.NODATAEXIST.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.NODATAEXIST.code);
                                                                        responseData = new NFScoreResponseWithoutResult(req.body, preResponse);
                                                                        dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                                        cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                                                        cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.NODATAEXIST.code).then().catch();
                                                                        logger.info(responseData);
                                                                        logger.info(resultGetRiskScore.data.error_msg);
                                                                        return res.status(200).json(responseData);
                                                                    } else if (resultGetRiskScore.data.error_code === 11) {
                                                                        //    update scraplog & response F049
                                                                        console.log('errRiskscore:',resultGetRiskScore.data.error_msg);
                                                                        preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFTIMEOUTERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFTIMEOUTERR.code);
                                                                        responseData = new NFScoreResponseWithoutResult(req.body, preResponse);
                                                                        dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                                        cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                                                        cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFTIMEOUTERR.code).then().catch();
                                                                        logger.info(responseData);
                                                                        logger.info(resultGetRiskScore.data.error_msg);
                                                                        return res.status(200).json(responseData);
                                                                    } else {
                                                                        //    update scraplog & response F048
                                                                        console.log('errRiskscore:',resultGetRiskScore.data.error_msg);
                                                                        preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                                        responseData = new NFScoreResponseWithoutResult(req.body, preResponse);
                                                                        dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                                        cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                                                        cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then().catch();
                                                                        logger.info(responseData);
                                                                        logger.info(resultGetRiskScore.data.error_msg);
                                                                        return res.status(200).json(responseData);
                                                                    }
                                                                }
                                                            ).catch(
                                                                errGetRiskScore => {
                                                                    if (errGetRiskScore.code === 'ETIMEDOUT' || errGetRiskScore.errno === 'ETIMEDOUT') {
                                                                        console.log('errRclips', errGetRiskScore.toString());
                                                                        preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFTIMEOUTERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFTIMEOUTERR.code);
                                                                        responseData = new NFScoreResponseWithoutResult(req.body, preResponse);
                                                                        dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                                        cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                                                        cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFTIMEOUTERR.code).then().catch();
                                                                        logger.info(responseData);
                                                                        logger.info(errGetRiskScore.toString());
                                                                        return res.status(200).json(responseData);
                                                                    } else {
                                                                        //    update scraplog & response F048
                                                                        console.log("errGetRiskScore:", errGetRiskScore.toString());
                                                                        preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                                        responseData = new NFScoreResponseWithoutResult(req.body, preResponse);
                                                                        dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                                        cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                                                        cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then().catch();
                                                                        logger.info(responseData);
                                                                        logger.info(errGetRiskScore.toString());
                                                                        return res.status(200).json(responseData);
                                                                    }
                                                                }
                                                            );
                                                        }  else {
                                                            //    update scraplog & response F048
                                                            console.log("errZalo:", resultGetZaloScore.data.message);
                                                            preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                            responseData = new NFScoreResponseWithoutResult(req.body, preResponse);
                                                            dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                                            cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then().catch();
                                                            logger.info(responseData);
                                                            logger.info(resultGetZaloScore.data.message);
                                                            return res.status(200).json(responseData);
                                                        }
                                                    }
                                                ).catch(reason => {
                                                    if (reason.code === 'ETIMEDOUT' || reason.errno === 'ETIMEDOUT') {
                                                        console.log('errZalo', reason.toString());
                                                        preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFTIMEOUTERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFTIMEOUTERR.code);
                                                        responseData = new NFScoreResponseWithoutResult(req.body, preResponse);
                                                        dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                        cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                                        cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFTIMEOUTERR.code).then().catch();
                                                        logger.info(responseData);
                                                        logger.info(reason.toString());
                                                        return res.status(200).json(responseData);
                                                    } else {
                                                        //    update scraplog & response F048
                                                        console.log("errZalo:", reason.toString())
                                                        preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                        responseData = new NFScoreResponseWithoutResult(req.body, preResponse);
                                                        dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                        cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                                        cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then().catch();
                                                        logger.info(responseData);
                                                        logger.info(reason.toString());
                                                        return res.status(200).json(responseData);
                                                    }
                                                })
                                            } else {
                                                //    update scraplog & response F048
                                                console.log("err:", resultTokenAuth.data)
                                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                responseData = new NFScoreResponseWithoutResult(req.body, preResponse);
                                                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then().catch();
                                                logger.info(responseData);
                                                logger.info(resultTokenAuth.data);
                                                return res.status(200).json(responseData);
                                            }
                                        }
                                    ).catch(
                                        errorGetAuth => {
                                            console.log("errorGetAuth:", errorGetAuth.toString());
                                            if (errorGetAuth.code === 'ETIMEDOUT' || errorGetAuth.errno === 'ETIMEDOUT') {
                                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFTIMEOUTERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFTIMEOUTERR.code);
                                                responseData = new NFScoreResponseWithoutResult(req.body, preResponse);
                                                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFTIMEOUTERR.code).then().catch();
                                                logger.info(responseData);
                                                logger.info(errorGetAuth.toString());
                                                return res.status(200).json(responseData);
                                            } else {
                                                //    update scraplog & response F048
                                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                responseData = new NFScoreResponseWithoutResult(req.body, preResponse);
                                                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then().catch();
                                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then().catch();
                                                logger.info(responseData);
                                                logger.info(errorGetAuth.toString());
                                                return res.status(200).json(responseData);
                                            }
                                        })
                                }
                            ).catch(reason => {
                                logger.error(reason.toString());
                                return res.status(500).json({error: reason.toString()});
                            })
                        }).catch(reason => {
                            logger.error(reason.toString());
                            return res.status(500).json({error: reason.toString()});
                        })
                    }
                }
            ).catch(reason => {
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