const axios = require('axios');
const crypto = require('crypto');
const validRequest = require('../util/validateZaloScoreRequest');
const _ = require('lodash');
const dateutil = require('../util/dateutil');
const util = require('../util/dateutil');
const PreResponse = require('../domain/preResponse.response');
const ResponseWithoutScore = require('../domain/ZaloScore_Res_Without_Score.response');
const ResponseWithScore = require('../domain/ZaloScore_Res_With_Score.response');
const DataZaloSaveToInqlog = require('../domain/data_Zalo_Save_To_Inqlog.save');
const DataZaloSaveToScrapLog = require('../domain/data_Zalo_Save_ScrapLog.save');
const common_service = require('../services/common.service');
const responCode = require('../../shared/constant/responseCodeExternal');
const cicExternalService = require('../services/cicExternal.service');
const validS11AService = require('../services/validS11A.service');
const utilFunction = require('../../shared/util/util');
const URI = require('../../shared/URI');

const SECRET = 'TEST';
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
        let preResponse, responseData, dataInqLogSave;
        console.log(rsCheck);
        common_service.getSequence().then(resSeq => {
            let niceSessionKey = util.timeStamp2() + resSeq[0].SEQ;
            let fullNiceKey = responCode.NiceProductCode.ZALO.code + niceSessionKey;
            if (!_.isEmpty(rsCheck)) {
                preResponse = new PreResponse(rsCheck.responseMessage, fullNiceKey, dateutil.timeStamp(), rsCheck.responseCode);
                responseData = new ResponseWithoutScore(req.body, preResponse);
                //    update INQLOG
                dataInqLogSave = new DataZaloSaveToInqlog(req.body, preResponse);
                cicExternalService.insertDataZaloINQLOG(dataInqLogSave).then();
                return res.status(200).json(responseData);
            }
            validS11AService.selectFiCode(req.body.fiCode, responCode.NiceProductCode.ZALO.code).then(dataFICode => {
                if (_.isEmpty(dataFICode)) {
                    preResponse = new PreResponse(responCode.RESCODEEXT.InvalidNiceProductCode.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.InvalidNiceProductCode.code);

                    responseData = new ResponseWithoutScore(req.body, preResponse);
                    // update INQLOG
                    dataInqLogSave = new DataZaloSaveToInqlog(req.body, responseData);
                    cicExternalService.insertDataZaloINQLOG(dataInqLogSave).then(
                        result => {
                            return res.status(200).json(responseData);
                        }
                    ).catch(error => {
                        return res.status(200).json(responseData);
                    })
                } else if (_.isEmpty(dataFICode[0]) && utilFunction.checkStatusCodeScraping(responCode.OracleError, utilFunction.getOracleCode(dataFICode))) {
                    preResponse = new PreResponse(responCode.RESCODEEXT.ErrorDatabaseConnection.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.ErrorDatabaseConnection.code);

                    responseData = new ResponseWithoutScore(req.body, preResponse);

                    return res.status(500).json(responseData);
                }
                //    end check params
                //    Insert to Scraping log
                let dataInsertScrapLog = new DataZaloSaveToScrapLog(req.body, fullNiceKey);
                cicExternalService.insertDataZaloToSCRPLOG(dataInsertScrapLog).then(
                    result => {
                        axios.get(URI.URL_GET_AUTH_DEV, config).then(
                            resultTokenAuth => {
                                console.log(resultTokenAuth.data);
                                if (resultTokenAuth.data.code === 0) {
                                    //    do API get score
                                    let auth_token = resultTokenAuth.data.data.auth_token;
                                    let mobileNumberHmac = crypto.createHmac('sha256', SECRET).update(req.body.mobilePhoneNumber).digest('hex');
                                    let paramUrl = `auth_token=${auth_token}&customer_phone=${mobileNumberHmac}`;
                                    let fullUrlGetScore = URI.URL_GET_SCORE_DEV + paramUrl;
                                    axios.get(fullUrlGetScore, config).then(
                                        resultGetScore => {
                                            if (resultGetScore.data.code === 0) {
                                                console.log(resultGetScore);
                                                preResponse = new PreResponse(responCode.RESCODEEXT.NORMAL.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                                                responseData = new ResponseWithScore(req.body, preResponse, resultGetScore.data.data.score, resultGetScore.data.data.request_id)
                                                return res.status(200).json(responseData);
                                            } else {
                                                //    update scraplog & response F048
                                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                responseData = new ResponseWithoutScore(req.body, preResponse);
                                                dataInqLogSave = new DataZaloSaveToInqlog(req.body, preResponse);
                                                cicExternalService.insertDataZaloINQLOG(dataInqLogSave).then();
                                                cicExternalService.updateRspCdScrapLogWhenGetResultFromZalo(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                                return res.status(200).json(responseData);
                                            }
                                        }
                                    ).catch(
                                        errorGetScore => {
                                            //    update scraplog & response F049
                                            preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFTIMEOUTERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFTIMEOUTERR.code);
                                            responseData = new ResponseWithoutScore(req.body, preResponse);
                                            dataInqLogSave = new DataZaloSaveToInqlog(req.body, preResponse);
                                            cicExternalService.insertDataZaloINQLOG(dataInqLogSave).then();
                                            cicExternalService.updateRspCdScrapLogWhenGetResultFromZalo(fullNiceKey, responCode.RESCODEEXT.EXTITFTIMEOUTERR.code).then();
                                            return res.status(200).json(responseData);
                                        }
                                    );
                                } else {
                                    //    update scraplog & response F049
                                    preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                    responseData = new ResponseWithoutScore(req.body, preResponse);
                                    dataInqLogSave = new DataZaloSaveToInqlog(req.body, preResponse);
                                    cicExternalService.insertDataZaloINQLOG(dataInqLogSave).then();
                                    cicExternalService.updateRspCdScrapLogWhenGetResultFromZalo(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                    return res.status(200).json(responseData);
                                }
                            }
                        ).catch(
                            errorGetAuth => {
                                //    update scraplog & response F048
                                preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFTIMEOUTERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFTIMEOUTERR.code);
                                responseData = new ResponseWithoutScore(req.body, preResponse);
                                dataInqLogSave = new DataZaloSaveToInqlog(req.body, preResponse);
                                cicExternalService.insertDataZaloINQLOG(dataInqLogSave).then();
                                cicExternalService.updateRspCdScrapLogWhenGetResultFromZalo(fullNiceKey, responCode.RESCODEEXT.EXTITFTIMEOUTERR.code).then();
                                return res.status(200).json(responseData);
                            }
                        );
                    }
                )
            });
        });
    } catch (err) {
        return res.status(500).json({error: err.toString()});
    }
}
