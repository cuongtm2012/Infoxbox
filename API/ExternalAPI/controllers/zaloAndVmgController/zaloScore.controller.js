const httpClient = require('../../services/httpClient.service');
const crypto = require('crypto');
const validRequest = require('../../util/validateZaloScoreRequest');
const _ = require('lodash');
const dateutil = require('../../util/dateutil');
const util = require('../../util/dateutil');
const PreResponse = require('../../domain/preResponse.response');
const ResponseWithoutScore = require('../../domain/ZaloScore_Res_Without_Score.response');
const ResponseWithScore = require('../../domain/ZaloScore_Res_With_Score.response');
const DataZaloSaveToInqlog = require('../../domain/data_Zalo_Save_To_Inqlog.save');
const DataZaloSaveToScrapLog = require('../../domain/data_Zalo_Save_ScrapLog.save');
const DataZaloSaveToExtScore = require('../../domain/dataZalo_Save_To_ExtScore.save');
const common_service = require('../../services/common.service');
const responCode = require('../../../shared/constant/responseCodeExternal');
const cicExternalService = require('../../services/cicExternal.service');
const validS11AService = require('../../services/validS11A.service');
const utilFunction = require('../../../shared/util/util');
const URI = require('../../../shared/URI');
const configExternal = require('../../config/config')
const qs = require('qs');
const bodyZaloScore = require('../../domain/bodyPostZaloScore.body');
const SECRET = 'TEST';
const uuid = require('uuid');
const logger = require('../../config/logger');
exports.zaloScore = function (req, res) {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 60 * 1000
        }
        //checking parameter
        let rsCheck = validRequest.checkParamRequest(req.body);
        logger.info(req.body);
        let preResponse, responseData, dataInqLogSave, dataScoreEx;
        common_service.getSequence().then(resSeq => {
            let niceSessionKey = util.timeStamp2() + resSeq[0].SEQ;
            let fullNiceKey = responCode.NiceProductCode.ZALO.code + niceSessionKey;
            if (!_.isEmpty(rsCheck)) {
                preResponse = new PreResponse(rsCheck.responseMessage, fullNiceKey, dateutil.timeStamp(), rsCheck.responseCode);
                responseData = new ResponseWithoutScore(req.body, preResponse);
                //    update INQLOG
                dataInqLogSave = new DataZaloSaveToInqlog(req.body, preResponse);
                cicExternalService.insertDataZaloINQLOG(dataInqLogSave).then();
                logger.info(responseData);
                return res.status(200).json(responseData);
            }
            validS11AService.selectFiCode(req.body.fiCode, responCode.NiceProductCode.ZALO.code).then(dataFICode => {
                if (_.isEmpty(dataFICode)) {
                    preResponse = new PreResponse(responCode.RESCODEEXT.InvalidNiceProductCode.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.InvalidNiceProductCode.code);

                    responseData = new ResponseWithoutScore(req.body, preResponse);
                    // update INQLOG
                    dataInqLogSave = new DataZaloSaveToInqlog(req.body, responseData);
                    cicExternalService.insertDataZaloINQLOG(dataInqLogSave).then();
                    logger.info(responseData);
                    return res.status(200).json(responseData);
                } else if (_.isEmpty(dataFICode[0]) && utilFunction.checkStatusCodeScraping(responCode.OracleError, utilFunction.getOracleCode(dataFICode))) {
                    preResponse = new PreResponse(responCode.RESCODEEXT.ErrorDatabaseConnection.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.ErrorDatabaseConnection.code);

                    responseData = new ResponseWithoutScore(req.body, preResponse);
                    logger.info(responseData);
                    return res.status(500).json(responseData);
                }
                //    end check params
                //    Insert to Scraping log
                let dataInsertScrapLog = new DataZaloSaveToScrapLog(req.body, fullNiceKey);
                cicExternalService.insertDataZaloToSCRPLOG(dataInsertScrapLog).then(
                    result => {
                        let dataRqZalo = qs.stringify(configExternal.accountZaloDev);
                        httpClient.superagentPostZaloEncodeUrl(URI.URL_ZALO_GET_AUTH_DEV, dataRqZalo).then(
                            resultTokenAuth => {
                                logger.info(resultTokenAuth);
                                if (resultTokenAuth.data.code === 0) {
                                    // prepare call zalo score
                                    let dataZaloScoreRq = qs.stringify(new bodyZaloScore(resultTokenAuth.data.data.auth_token, req.body.mobilePhoneNumber));
                                    logger.info(dataZaloScoreRq);
                                    //    call API get zalo score
                                    httpClient.superagentPostZaloEncodeUrl(URI.URL_ZALO_GET_SCORE_DEV, dataZaloScoreRq, uuid.v4()).then(
                                        resultGetScore => {
                                            logger.info(resultGetScore);
                                            if (resultGetScore.data.code === 0) {
                                                // update when have success result P000
                                                preResponse = new PreResponse(responCode.RESCODEEXT.NORMAL.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                                                responseData = new ResponseWithScore(req.body, preResponse, resultGetScore.data.data.score, resultGetScore.data.data.request_id)
                                                dataInqLogSave = new DataZaloSaveToInqlog(req.body, preResponse);
                                                dataScoreEx = new DataZaloSaveToExtScore(req.body, fullNiceKey,resultGetScore.data.data.score,resultGetScore.data.data.request_id);
                                                cicExternalService.insertDataZaloToExtScore(dataScoreEx).then();
                                                cicExternalService.insertDataZaloINQLOG(dataInqLogSave).then();
                                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.NORMAL.code).then();
                                                logger.info(responseData);
                                                return res.status(200).json(responseData);
                                            } else {
                                                //    update scraplog & response F048
                                                console.log("errZalo:", resultGetScore.data.message);
                                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                responseData = new ResponseWithoutScore(req.body, preResponse);
                                                dataInqLogSave = new DataZaloSaveToInqlog(req.body, preResponse);
                                                cicExternalService.insertDataZaloINQLOG(dataInqLogSave).then();
                                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                                logger.info(responseData);
                                                return res.status(200).json(responseData);
                                            }
                                        }
                                    ).catch(
                                        errorGetScore => {
                                            //    update scraplog & response F048
                                            console.log("errZalo:", errorGetScore.toString());
                                            preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                            responseData = new ResponseWithoutScore(req.body, preResponse);
                                            dataInqLogSave = new DataZaloSaveToInqlog(req.body, preResponse);
                                            cicExternalService.insertDataZaloINQLOG(dataInqLogSave).then();
                                            cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFTIMEOUTERR.code).then();
                                            logger.info(responseData);
                                            logger.info(errorGetScore);
                                            return res.status(200).json(responseData);
                                        }
                                    );
                                } else {
                                    //    update scraplog & response F048
                                    preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                    responseData = new ResponseWithoutScore(req.body, preResponse);
                                    dataInqLogSave = new DataZaloSaveToInqlog(req.body, preResponse);
                                    cicExternalService.insertDataZaloINQLOG(dataInqLogSave).then();
                                    cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                    logger.info(responseData);
                                    return res.status(200).json(responseData);
                                }
                            }
                        ).catch(
                            errorGetAuth => {
                                //    update scraplog & response F048
                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                responseData = new ResponseWithoutScore(req.body, preResponse);
                                dataInqLogSave = new DataZaloSaveToInqlog(req.body, preResponse);
                                cicExternalService.insertDataZaloINQLOG(dataInqLogSave).then();
                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFTIMEOUTERR.code).then();
                                logger.info(responseData);
                                logger.info(errorGetAuth);
                                return res.status(200).json(responseData);
                            }
                        );
                    }
                ).catch(reason => {
                    return res.status(500).json({error: reason.toString()});
                })
            }).catch(reason => {
                return res.status(500).json({error: reason.toString()});
            });
        });
    } catch (err) {
        return res.status(500).json({error: err.toString()});
    }
}
