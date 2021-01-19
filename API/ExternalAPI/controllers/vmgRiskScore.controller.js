const validRequest = require('../util/validateVmgRiskScoreRequest');
const common_service = require('../services/common.service');
const responCode = require('../../shared/constant/responseCodeExternal');
const PreResponse = require('../domain/preResponse.response');
const util = require('../util/dateutil');
const dateutil = require('../util/dateutil');
const ResponseRiskScoreWithoutScore = require('../domain/Risk_Score_Res_Without_Score.response');
const ResponseRiskScoreWithScore = require('../domain/Risk_Score_Res_With_Score.response');
const _ = require('lodash');
const DataRiskScoreSaveToInqlog = require('../domain/data_Risk_Score_Save_To_InqLog.save');
const DataRiskScoreSaveToScrapLog = require('../domain/data_RisckScore_Save_To_ScrapLog.save');
const DataRiskScoreSaveToExtScore = require('../domain/Data_RiskScore_Save_To_ExtScore.save');
const BodyPostRiskScore = require('../domain/body_Post_RiskScore.body');
const cicExternalService = require('../services/cicExternal.service');
const validS11AService = require('../services/validS11A.service');
const utilFunction = require('../../shared/util/util');
const axios = require('axios');
const URI = require('../../shared/URI');
exports.vmgRiskScore = function (req, res) {
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
            let fullNiceKey = responCode.NiceProductCode.VMG_RISK_SCORE.code + niceSessionKey;
            if (!_.isEmpty(rsCheck)) {
                preResponse = new PreResponse(rsCheck.responseMessage, fullNiceKey, dateutil.timeStamp(), rsCheck.responseCode);
                responseData = new ResponseRiskScoreWithoutScore(req.body, preResponse);
                //    update INQLOG
                dataInqLogSave = new DataRiskScoreSaveToInqlog(req.body, preResponse);
                cicExternalService.insertDataRiskScoreToINQLOG(dataInqLogSave).then();
                return res.status(200).json(responseData);
            }
            validS11AService.selectFiCode(req.body.fiCode, responCode.NiceProductCode.VMG_RISK_SCORE.code).then(dataFICode => {
                if (_.isEmpty(dataFICode)) {
                    preResponse = new PreResponse(responCode.RESCODEEXT.InvalidNiceProductCode.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.InvalidNiceProductCode.code);
                    responseData = new ResponseRiskScoreWithoutScore(req.body, preResponse);
                    // update INQLOG
                    dataInqLogSave = new DataRiskScoreSaveToInqlog(req.body, responseData);
                    cicExternalService.insertDataRiskScoreToINQLOG(dataInqLogSave).then();
                    return res.status(200).json(responseData);
                } else if (_.isEmpty(dataFICode[0]) && utilFunction.checkStatusCodeScraping(responCode.OracleError, utilFunction.getOracleCode(dataFICode))) {
                    preResponse = new PreResponse(responCode.RESCODEEXT.ErrorDatabaseConnection.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.ErrorDatabaseConnection.code);
                    responseData = new ResponseRiskScoreWithoutScore(req.body, preResponse);
                    return res.status(500).json(responseData);
                }
                //    end check params
                //    Insert data RiskScore To Scraping Log
                let dataInsertScrapLog = new DataRiskScoreSaveToScrapLog(req.body, fullNiceKey);
                cicExternalService.insertDataRiskScoreToSCRPLOG(dataInsertScrapLog).then(
                    result => {
                        let bodyGetRiskScore = new BodyPostRiskScore(req.body);
                    //    get RiskScore
                        axios.post(URI.URL_VMG_DEV, bodyGetRiskScore, config).then(
                            resultGetRiskScore => {
                                if (resultGetRiskScore.data.error_code === 0) {
                                //    update when have success result P000
                                    preResponse = new PreResponse(responCode.RESCODEEXT.NORMAL.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                                    responseData = new ResponseRiskScoreWithScore(req.body, preResponse, resultGetRiskScore.data.result.nice_score);
                                    dataInqLogSave = new DataRiskScoreSaveToInqlog(req.body, preResponse);
                                    dataScoreEx = new DataRiskScoreSaveToExtScore(fullNiceKey, resultGetRiskScore.data.requestid, resultGetRiskScore.data.result.nice_score);
                                    cicExternalService.insertDataRiskScoreToExtScore(dataScoreEx).then();
                                    cicExternalService.insertDataRiskScoreToINQLOG(dataInqLogSave).then();
                                    cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.NORMAL.code).then();
                                    return res.status(200).json(responseData);
                                } else if (resultGetRiskScore.data.error_code === 4) {
                                    //    update scraplog & response F052
                                    preResponse = new PreResponse(responCode.RESCODEEXT.NODATAEXIST.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.NODATAEXIST.code);
                                    responseData = new ResponseRiskScoreWithoutScore(req.body, preResponse);
                                    dataInqLogSave = new DataRiskScoreSaveToInqlog(req.body, preResponse);
                                    cicExternalService.insertDataRiskScoreToINQLOG(dataInqLogSave).then();
                                    cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.NODATAEXIST.code).then();
                                    return res.status(200).json(responseData);
                                } else if (resultGetRiskScore.data.error_code === 11) {
                                    //    update scraplog & response F049
                                    preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFTIMEOUTERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFTIMEOUTERR.code);
                                    responseData = new ResponseRiskScoreWithoutScore(req.body, preResponse);
                                    dataInqLogSave = new DataRiskScoreSaveToInqlog(req.body, preResponse);
                                    cicExternalService.insertDataRiskScoreToINQLOG(dataInqLogSave).then();
                                    cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFTIMEOUTERR.code).then();
                                    return res.status(200).json(responseData);
                                } else {
                                    //    update scraplog & response F048
                                    preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                    responseData = new ResponseRiskScoreWithoutScore(req.body, preResponse);
                                    dataInqLogSave = new DataRiskScoreSaveToInqlog(req.body, preResponse);
                                    cicExternalService.insertDataRiskScoreToINQLOG(dataInqLogSave).then();
                                    cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                    return res.status(200).json(responseData);
                                }
                            }
                        ).catch(
                            errGetRiskScore => {
                                //    update scraplog & response F049
                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFTIMEOUTERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFTIMEOUTERR.code);
                                responseData = new ResponseRiskScoreWithoutScore(req.body, preResponse);
                                dataInqLogSave = new DataRiskScoreSaveToInqlog(req.body, preResponse);
                                cicExternalService.insertDataRiskScoreToINQLOG(dataInqLogSave).then();
                                cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFTIMEOUTERR.code).then();
                                return res.status(200).json(responseData);
                            }
                        );
                    }
                )
            }).catch(reason => {
                return res.status(500).json({error: reason.toString()});
            });
        }).catch(reason => {
            return res.status(500).json({error: reason.toString()});
        });
    } catch (err) {
        return res.status(500).json({error: err.toString()});
    }
}
