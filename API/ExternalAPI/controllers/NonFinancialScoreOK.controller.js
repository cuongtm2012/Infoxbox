const logger = require('../config/logger');
const validRequest = require('../util/validateNonFinanacialScoreOkRequest');
const common_service = require('../services/common.service');
const responCode = require('../../shared/constant/responseCodeExternal');
const util = require('../util/dateutil');
const _ = require('lodash');
const PreResponse = require('../domain/preResponse.response');
const DataSaveToInqLog = require('../domain/data_FptId_Save_To_InqLog.save');
const cicExternalService = require('../services/cicExternal.service');
const dateutil = require('../util/dateutil');
const NFScoreResponseWithoutResult = require('../domain/NF_Score_OK_Res_Without_Result.response');
const NFScoreResponseWithResult = require('../domain/NF_Score_OK_Res_With_Result.response');
const dataNFScoreSaveToScrapLog = require('../domain/data_NF_Score_OK_Save_To_ScrapLog.save');
const bodyPostNfScore = require('../domain/nfScorePost.Body');
const validS11AService = require('../services/validS11A.service');
const utilFunction = require('../../shared/util/util');
const axios = require('axios');
const URI = require('../../shared/URI');
const configExternal = require('../config/config')
const crypto = require('crypto');
const DataZaloSaveToExtScore = require('../domain/dataZalo_Save_To_ExtScore.save');
const BodyPostRiskScore = require('../domain/body_Post_RiskScore.body');
const DataRiskScoreSaveToExtScore = require('../domain/Data_RiskScore_Save_To_ExtScore.save');
exports.nonFinancialScoreOk = function (req, res) {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 60 * 1000
        }
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
                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                logger.error(responseData);
                return res.status(200).send(responseData);
            }
            // check FI contract
            validS11AService.selectFiCode(req.body.fiCode, responCode.NiceProductCode.OKF_SCO_RQST.code).then(dataFICode => {
                if (_.isEmpty(dataFICode)) {
                    preResponse = new PreResponse(responCode.RESCODEEXT.InvalidNiceProductCode.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.InvalidNiceProductCode.code);
                    responseData = new NFScoreResponseWithoutResult(req.body, preResponse);
                    // update INQLOG
                    dataInqLogSave = new DataSaveToInqLog(req.body, responseData);
                    cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                    logger.error(responseData);
                    return res.status(200).json(responseData);
                } else if (_.isEmpty(dataFICode[0]) && utilFunction.checkStatusCodeScraping(responCode.OracleError, utilFunction.getOracleCode(dataFICode))) {
                    preResponse = new PreResponse(responCode.RESCODEEXT.ErrorDatabaseConnection.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.ErrorDatabaseConnection.code);
                    responseData = new NFScoreResponseWithoutResult(req.body, preResponse);
                    logger.error(responseData);
                    return res.status(500).json(responseData);
                }
                //    end check parmas
                let dataInsertToScrapLog = new dataNFScoreSaveToScrapLog(req.body, fullNiceKey);
                // insert rq to ScrapLog
                cicExternalService.insertDataNFScoreOKToSCRPLOG(dataInsertToScrapLog).then(
                    result => {
                        //    get token Zalo
                        axios.get(URI.URL_ZALO_GET_AUTH_DEV, config).then(
                            resultTokenAuth => {
                                if (resultTokenAuth.data.code === 0) {
                                    // prepare call zalo score
                                    let auth_token = resultTokenAuth.data.data.auth_token;
                                    let mobileNumberHmac = crypto.createHmac('sha256', configExternal.SECRET_ZALO_DEV).update(req.body.mobilePhoneNumber).digest('hex');
                                    let paramUrl = `auth_token=${auth_token}&customer_phone=${mobileNumberHmac}&score_version=1`;
                                    let fullUrlGetScore = URI.URL_ZALO_GET_SCORE_DEV + paramUrl;
                                    //    call API get zalo score
                                    axios.get(fullUrlGetScore, config).then(
                                        resultGetZaloScore => {
                                            if (resultGetZaloScore.data.code === 0) {
                                            //    success get zalo score
                                            //    save score to EXT_SCORE
                                                dataScoreEx = new DataZaloSaveToExtScore(req.body, fullNiceKey,resultGetZaloScore.data.data.score,resultGetZaloScore.data.data.request_id);
                                                cicExternalService.insertDataZaloToExtScore(dataScoreEx).then();
                                            //    prepare call VMG Risk Score
                                                let bodyGetRiskScore = new BodyPostRiskScore(req.body);
                                                //    get RiskScore
                                                axios.post(URI.URL_VMG_DEV, bodyGetRiskScore, config).then(
                                                    resultGetRiskScore => {
                                                        if (resultGetRiskScore.data.error_code === 0) {
                                                        //    success get Risk Score
                                                        //    update To EXT_SCORE
                                                            let dataRiskSaveToScoreEx = new DataRiskScoreSaveToExtScore(fullNiceKey, resultGetRiskScore.data.requestid, resultGetRiskScore.data.result.nice_score);
                                                            cicExternalService.insertDataRiskScoreToExtScore(dataRiskSaveToScoreEx).then();
                                                        //    Call Rclips
                                                            let bodyRclispNfScore = new bodyPostNfScore(req.body.mobilePhoneNumber, req.body.natId, resultGetRiskScore.data.result.nice_score.RSK_SCORE, resultGetRiskScore.data.result.nice_score.RSK_GRADE, resultGetZaloScore.data.data.score);
                                                            axios.post(URI.URL_RCLIPS_DEVELOP, bodyRclispNfScore, config).then(
                                                                resultRclipsNF => {
                                                                    if (!_.isEmpty(resultRclipsNF.data.listResult)) {
                                                                        // response P000
                                                                        preResponse = new PreResponse(responCode.RESCODEEXT.NORMAL.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                                                                        responseData = new NFScoreResponseWithResult(req.body, preResponse, resultRclipsNF.data);
                                                                        dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                                        cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                                        cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.NORMAL.code).then();
                                                                        logger.info(responseData);
                                                                        return res.status(200).json(responseData);
                                                                    } else {
                                                                        //    update scraplog & response F048
                                                                        console.log('errRclips', resultRclipsNF.data);
                                                                        preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                                        responseData = new NFScoreResponseWithoutResult(req.body, preResponse);
                                                                        dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                                        cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                                        cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                                                        logger.error(responseData);
                                                                        logger.error(resultRclipsNF.data);
                                                                        return res.status(200).json(responseData);
                                                                    }
                                                                }
                                                            ).catch(reason => {
                                                                //    update scraplog & response F048
                                                                console.log('errRclips', reason.toString());
                                                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                                responseData = new NFScoreResponseWithoutResult(req.body, preResponse);
                                                                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                                                logger.error(responseData);
                                                                logger.error(reason.toString());
                                                                return res.status(200).json(responseData);
                                                            })
                                                        }  else if (resultGetRiskScore.data.error_code === 4) {
                                                            //    update scraplog & response F052
                                                            console.log('errRiskscore:',resultGetRiskScore.data.error_msg);
                                                            preResponse = new PreResponse(responCode.RESCODEEXT.NODATAEXIST.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.NODATAEXIST.code);
                                                            responseData = new NFScoreResponseWithoutResult(req.body, preResponse);
                                                            dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                            cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.NODATAEXIST.code).then();
                                                            logger.error(responseData);
                                                            logger.error(resultGetRiskScore.data.error_msg);
                                                            return res.status(200).json(responseData);
                                                        } else if (resultGetRiskScore.data.error_code === 11) {
                                                            //    update scraplog & response F049
                                                            console.log('errRiskscore:',resultGetRiskScore.data.error_msg);
                                                            preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFTIMEOUTERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFTIMEOUTERR.code);
                                                            responseData = new NFScoreResponseWithoutResult(req.body, preResponse);
                                                            dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                            cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFTIMEOUTERR.code).then();
                                                            logger.error(responseData);
                                                            logger.error(resultGetRiskScore.data.error_msg);
                                                            return res.status(200).json(responseData);
                                                        } else {
                                                            //    update scraplog & response F048
                                                            console.log('errRiskscore:',resultGetRiskScore.data.error_msg);
                                                            preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                            responseData = new NFScoreResponseWithoutResult(req.body, preResponse);
                                                            dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                            cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                                            logger.error(responseData);
                                                            logger.error(resultGetRiskScore.data.error_msg);
                                                            return res.status(200).json(responseData);
                                                        }
                                                    }
                                                ).catch(
                                                    errGetRiskScore => {
                                                        //    update scraplog & response F048
                                                        console.log("errGetRiskScore:", errGetRiskScore.toString());
                                                        preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                        responseData = new NFScoreResponseWithoutResult(req.body, preResponse);
                                                        dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                        cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                        cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                                        logger.error(responseData);
                                                        logger.error(errGetRiskScore.toString());
                                                        return res.status(200).json(responseData);
                                                    }
                                                );
                                            }  else {
                                                //    update scraplog & response F048
                                                console.log("errZalo:", resultGetZaloScore.data.message);
                                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                responseData = new NFScoreResponseWithoutResult(req.body, preResponse);
                                                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                                logger.error(responseData);
                                                logger.error(resultGetZaloScore.data.message);
                                                return res.status(200).json(responseData);
                                            }
                                        }
                                    ).catch(reason => {
                                        //    update scraplog & response F048
                                        console.log("errZalo:", reason.toString())
                                        preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                        responseData = new NFScoreResponseWithoutResult(req.body, preResponse);
                                        dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                        cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                        cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                        logger.error(responseData);
                                        logger.error(reason.toString());
                                        return res.status(200).json(responseData);
                                    })
                                } else {
                                    //    update scraplog & response F048
                                    console.log("err:", resultTokenAuth.data)
                                    preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                    responseData = new NFScoreResponseWithoutResult(req.body, preResponse);
                                    dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                    cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                    cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                    logger.error(responseData);
                                    logger.error(resultTokenAuth.data);
                                    return res.status(200).json(responseData);
                                }
                            }
                        ).catch(
                            errorGetAuth => {
                                //    update scraplog & response F048
                                console.log("err:", errorGetAuth.toString());
                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                responseData = new NFScoreResponseWithoutResult(req.body, preResponse);
                                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                logger.error(responseData);
                                logger.error(errorGetAuth.toString());
                                return res.status(200).json(responseData);
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
        }).catch(reason => {
            logger.error(reason.toString());
            return res.status(500).json({error: reason.toString()});
        })
    } catch (err) {
        logger.error(err.toString());
        return res.status(500).json({error: err.toString()});
    }
}