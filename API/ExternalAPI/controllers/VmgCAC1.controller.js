const logger = require('../config/logger');
const validRequest = require('../util/validateKYC_VC1_RQST_Request');
const common_service = require('../services/common.service');
const responCode = require('../../shared/constant/responseCodeExternal');
const PreResponse = require('../domain/preResponse.response');
const DataSaveToInqLog = require('../domain/data_FptId_Save_To_InqLog.save');
const cicExternalService = require('../services/cicExternal.service');
const dateutil = require('../util/dateutil');
const util = require('../util/dateutil');
const _ = require('lodash');
const bodyResponse = require('../domain/KYC_VC1_RQST.response');
const validS11AService = require('../services/validS11A.service');
const utilFunction = require('../../shared/util/util');
const axios = require('axios');
const URI = require('../../shared/URI');
const dataCAC1SaveToScrapLog = require('../domain/dataCAC1SaveToScrapLog.save');
const bodyPostCAC1 = require('../domain/bodyPostVmgCAC1.body');
const dataCAC1SaveToVmgLocPct = require('../domain/dataCAC1SaveToVmgLocPct.save');
const dataCAC1SaveToVmgAddress = require('../domain/dataVmgCacSaveToVmgAddress.save');
const bodyPostWhiteList = require('../domain/bodyVmgWhiteList.body');

exports.KYC_VC1_RQST = function (req, res) {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json',
            },
            timeout: 60 * 1000
        };
        let rsCheck = validRequest.checkParamRequest(req.body);
        let preResponse, responseData, dataInqLogSave;

        common_service.getSequence().then(resSeq => {
            let niceSessionKey = util.timeStamp2() + resSeq[0].SEQ;
            let fullNiceKey = responCode.NiceProductCode.KYC_VC1_RQST.code + niceSessionKey;
            if (!_.isEmpty(rsCheck)) {
                preResponse = new PreResponse(rsCheck.responseMessage, fullNiceKey, dateutil.timeStamp(), rsCheck.responseCode);
                responseData = new bodyResponse(req.body, preResponse);
                // save Inqlog
                dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                logger.info(responseData);
                return res.status(200).send(responseData);
            }
            // check FI contract
            validS11AService.selectFiCode(req.body.fiCode, responCode.NiceProductCode.KYC_VC1_RQST.code).then(dataFICode => {
                if (_.isEmpty(dataFICode)) {
                    preResponse = new PreResponse(responCode.RESCODEEXT.InvalidNiceProductCode.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.InvalidNiceProductCode.code);
                    responseData = new bodyResponse(req.body, preResponse);
                    // update INQLOG
                    dataInqLogSave = new DataSaveToInqLog(req.body, responseData);
                    cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                    logger.info(responseData);
                    return res.status(200).json(responseData);
                } else if (_.isEmpty(dataFICode[0]) && utilFunction.checkStatusCodeScraping(responCode.OracleError, utilFunction.getOracleCode(dataFICode))) {
                    preResponse = new PreResponse(responCode.RESCODEEXT.ErrorDatabaseConnection.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.ErrorDatabaseConnection.code);
                    responseData = new bodyResponse(req.body, preResponse);
                    logger.info(responseData);
                    return res.status(500).json(responseData);
                }
                //    end check parmas
                let dataInsertToScrapLog = new dataCAC1SaveToScrapLog(req.body, fullNiceKey);
                cicExternalService.insertDataCAC1ToSCRPLOG(dataInsertToScrapLog).then(
                    result => {
                    // call VMG CAC1
                        let bodyCac1 = new bodyPostCAC1(req.body);
                        axios.post(URI.URL_VMG_DEV, bodyCac1, config).then(
                            resultCAC1 => {
                                console.log(resultCAC1)
                                if (resultCAC1.data.error_code === 81 || resultCAC1.data.error_code === 0 || resultCAC1.data.error_code === 20) {
                                //    do save data if 20, 0.
                                    if (!_.isEmpty(resultCAC1.data.result)) {
                                        let dataSaveToVmgLocPct = new dataCAC1SaveToVmgLocPct(fullNiceKey, resultCAC1.data);
                                        let dataSaveToVmgAddress = new dataCAC1SaveToVmgAddress(fullNiceKey, resultCAC1.data);
                                        cicExternalService.insertDataToVmgLocPct(dataSaveToVmgLocPct).then();
                                        cicExternalService.insertDataToVmgAddress(dataSaveToVmgAddress).then();
                                    }
                                //     Call VMG  Whitelist
                                    let bodyWhiteList = new bodyPostWhiteList(req.body.mobilePhoneNumber);
                                    axios.post(URI.URL_VMG_DEV, bodyWhiteList, config).then(
                                        resultWhiteList => {

                                        }).catch(reason => {
                                        preResponse = new PreResponse(responCode.RESCODEEXT.TimeoutError.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.TimeoutError.code);
                                        responseData = new bodyResponse(req.body, preResponse);
                                        // update INQLOG
                                        dataInqLogSave = new DataSaveToInqLog(req.body, responseData);
                                        cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                        cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.TimeoutError.code).then();
                                        logger.info(responseData);
                                        logger.info(reason.toString());
                                        return res.status(200).json(responseData);
                                    })
                                } else if(resultCAC1.data.error_code === 4) {
                                    preResponse = new PreResponse(responCode.RESCODEEXT.NODATAEXIST.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.NODATAEXIST.code);
                                    responseData = new bodyResponse(req.body, preResponse);
                                    // update INQLOG
                                    dataInqLogSave = new DataSaveToInqLog(req.body, responseData);
                                    cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                    cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.NODATAEXIST.code).then();
                                    logger.info(responseData);
                                    logger.info(resultCAC1.data);
                                    return res.status(200).json(responseData);
                                } else if(esultCAC1.data.error_code === 11) {
                                    preResponse = new PreResponse(responCode.RESCODEEXT.TimeoutError.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.TimeoutError.code);
                                    responseData = new bodyResponse(req.body, preResponse);
                                    // update INQLOG
                                    dataInqLogSave = new DataSaveToInqLog(req.body, responseData);
                                    cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                    cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.TimeoutError.code).then();
                                    logger.info(responseData);
                                    logger.info(resultCAC1.data);
                                    return res.status(200).json(responseData);
                                } else {
                                    preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                    responseData = new bodyResponse(req.body, preResponse);
                                    // update INQLOG
                                    dataInqLogSave = new DataSaveToInqLog(req.body, responseData);
                                    cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                    cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                    logger.info(responseData);
                                    logger.info(resultCAC1.data);
                                    return res.status(200).json(responseData);
                                }
                            }).catch(reason => {
                            preResponse = new PreResponse(responCode.RESCODEEXT.TimeoutError.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.TimeoutError.code);
                            responseData = new bodyResponse(req.body, preResponse);
                            // update INQLOG
                            dataInqLogSave = new DataSaveToInqLog(req.body, responseData);
                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                            cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.TimeoutError.code).then();
                            logger.info(responseData);
                            logger.info(reason.toString());
                            return res.status(200).json(responseData);
                        })
                    }).catch(reason => {
                    logger.error(reason.toString());
                    return res.status(500).json({error: reason.toString()});
                });
            }).catch(reason => {
                logger.error(reason.toString());
                return res.status(500).json({error: reason.toString()});
            });
        }).catch(reason => {
            logger.error(reason.toString());
            return res.status(500).json({error: reason.toString()});
        });
    } catch (err) {
        logger.error(err.toString());
        return res.status(500).json({error: err.toString()});
    }
};
