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
                                let dataSaveToVmgLocPct, dataSaveToVmgAddress;
                                if (resultCAC1.data.error_code != undefined ) {
                                    switch (parseInt(resultCAC1.data.error_code)) {
                                        case 0:
                                            dataSaveToVmgLocPct = new dataCAC1SaveToVmgLocPct(fullNiceKey, resultCAC1.data);
                                            dataSaveToVmgAddress = new dataCAC1SaveToVmgAddress(fullNiceKey, resultCAC1.data);
                                            cicExternalService.insertDataToVmgLocPct(dataSaveToVmgLocPct).then();
                                            cicExternalService.insertDataToVmgAddress(dataSaveToVmgAddress).then();
                                            preResponse = new PreResponse(responCode.RESCODEEXT.NORMAL.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                                            responseData = new bodyResponse(req.body, preResponse);
                                            dataInqLogSave = new DataSaveToInqLog(req.body, responseData);
                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                            cicExternalService.updateRspCdAndStatusCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.NORMAL.code, responCode.ScrapingStatusCode.Complete.code).then();
                                            logger.info(resultCAC1.data);
                                            logger.info(responseData);
                                            return res.status(200).json(responseData);
                                        case 20:
                                            dataSaveToVmgLocPct = new dataCAC1SaveToVmgLocPct(fullNiceKey, resultCAC1.data);
                                            dataSaveToVmgAddress = new dataCAC1SaveToVmgAddress(fullNiceKey, resultCAC1.data);
                                            cicExternalService.insertDataToVmgLocPct(dataSaveToVmgLocPct).then();
                                            cicExternalService.insertDataToVmgAddress(dataSaveToVmgAddress).then();
                                            preResponse = new PreResponse(responCode.RESCODEEXT.NORMAL.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                                            responseData = new bodyResponse(req.body, preResponse);
                                            dataInqLogSave = new DataSaveToInqLog(req.body, responseData);
                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                            cicExternalService.updateRspCdAndStatusCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.NORMAL.code, responCode.ScrapingStatusCode.Data_Provided_Already.code).then();
                                            logger.info(resultCAC1.data);
                                            logger.info(responseData);
                                            return res.status(200).json(responseData);
                                        case 1:
                                        case 2:
                                        case 3:
                                        case 5:
                                        case 10:
                                            preResponse = new PreResponse(responCode.RESCODEEXT.NORMAL.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                                            responseData = new bodyResponse(req.body, preResponse);
                                            // update INQLOG
                                            dataInqLogSave = new DataSaveToInqLog(req.body, responseData);
                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                            cicExternalService.updateRspCdAndStatusCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.NORMAL.code, responCode.ScrapingStatusCode.Application_Error.code).then();
                                            logger.info(resultCAC1.data);
                                            logger.info(responseData);
                                            return res.status(200).json(responseData);
                                        case 4:
                                            preResponse = new PreResponse(responCode.RESCODEEXT.NORMAL.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                                            responseData = new bodyResponse(req.body, preResponse);
                                            // update INQLOG
                                            dataInqLogSave = new DataSaveToInqLog(req.body, responseData);
                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                            cicExternalService.updateRspCdAndStatusCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.NORMAL.code, responCode.ScrapingStatusCode.No_Data_Provide.code).then();
                                            logger.info(resultCAC1.data);
                                            logger.info(responseData);
                                            return res.status(200).json(responseData);
                                        case 6:
                                        case 7:
                                        case 8:
                                        case 9:
                                        case 11:
                                        case 12:
                                        case 13:
                                        case 14:
                                        case 15:
                                            preResponse = new PreResponse(responCode.RESCODEEXT.NORMAL.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                                            responseData = new bodyResponse(req.body, preResponse);
                                            // update INQLOG
                                            dataInqLogSave = new DataSaveToInqLog(req.body, responseData);
                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                            cicExternalService.updateRspCdAndStatusCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.NORMAL.code, responCode.ScrapingStatusCode.Other_Error.code).then();
                                            logger.info(resultCAC1.data);
                                            logger.info(responseData);
                                            return res.status(200).json(responseData);
                                        case 81:
                                            preResponse = new PreResponse(responCode.RESCODEEXT.NORMAL.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                                            responseData = new bodyResponse(req.body, preResponse);
                                            // update INQLOG
                                            dataInqLogSave = new DataSaveToInqLog(req.body, responseData);
                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                            cicExternalService.updateRspCdAndStatusCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.NORMAL.code, responCode.ScrapingStatusCode.VMG_InProcessing.code).then();
                                            logger.info(resultCAC1.data);
                                            logger.info(responseData);
                                            return res.status(200).json(responseData);
                                        case 82:
                                        case 83:
                                        case 91:
                                        case 92:
                                            preResponse = new PreResponse(responCode.RESCODEEXT.NORMAL.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                                            responseData = new bodyResponse(req.body, preResponse);
                                            // update INQLOG
                                            dataInqLogSave = new DataSaveToInqLog(req.body, responseData);
                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                            cicExternalService.updateRspCdAndStatusCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.NORMAL.code, responCode.ScrapingStatusCode.Telco_Interface_Error.code).then();
                                            logger.info(resultCAC1.data);
                                            logger.info(responseData);
                                            return res.status(200).json(responseData);
                                        default:
                                            preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                            responseData = new bodyResponse(req.body, preResponse);
                                            // update INQLOG
                                            dataInqLogSave = new DataSaveToInqLog(req.body, responseData);
                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                            cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                            logger.info(resultCAC1.data);
                                            logger.info(responseData);
                                            return res.status(200).json(responseData);
                                    }
                                } else {
                                    preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                    responseData = new bodyResponse(req.body, preResponse);
                                    // update INQLOG
                                    dataInqLogSave = new DataSaveToInqLog(req.body, responseData);
                                    cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                    cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                    logger.info(resultCAC1.data);
                                    logger.info(responseData);
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


const validateKYC_VC1_RSLTRequest = require('../util/validateKYC_VC1_RSLT_Request');
const KYC_VC1_RSLTResponseWithoutResult = require('../domain/KYC_VC1_RSLT_without_result.response');
const KYC_VC1_RSLTResponseWithResult = require('../domain/KYC_VC1_RSLT_with_result.response');

exports.KYC_VC1_RSLT = function (req, res) {
    try {
        let rsCheck = validateKYC_VC1_RSLTRequest.checkParamRequest(req.body);
        let preResponse, responseData, dataInqLogSave;
        let fullNiceKey = req.body.niceSessionKey;
        if (!_.isEmpty(rsCheck)) {
            preResponse = new PreResponse(rsCheck.responseMessage, fullNiceKey, dateutil.timeStamp(), rsCheck.responseCode);
            responseData = new KYC_VC1_RSLTResponseWithoutResult(req.body, preResponse);
            // save Inqlog
            dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
            logger.info(responseData);
            return res.status(200).send(responseData);
        }
        // check FI contract
        validS11AService.selectFiCode(req.body.fiCode, responCode.NiceProductCode.KYC_VC1_RSLT.code).then(dataFICode => {
            if (_.isEmpty(dataFICode)) {
                preResponse = new PreResponse(responCode.RESCODEEXT.InvalidNiceProductCode.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.InvalidNiceProductCode.code);
                responseData = new KYC_VC1_RSLTResponseWithoutResult(req.body, preResponse);
                // update INQLOG
                dataInqLogSave = new DataSaveToInqLog(req.body, responseData);
                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                logger.info(responseData);
                return res.status(200).json(responseData);
            } else if (_.isEmpty(dataFICode[0]) && utilFunction.checkStatusCodeScraping(responCode.OracleError, utilFunction.getOracleCode(dataFICode))) {
                preResponse = new PreResponse(responCode.RESCODEEXT.ErrorDatabaseConnection.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.ErrorDatabaseConnection.code);
                responseData = new KYC_VC1_RSLTResponseWithoutResult(req.body, preResponse);
                logger.info(responseData);
                return res.status(500).json(responseData);
            }
            //    end check params
            // Select Data
            cicExternalService.selectDataKYC_VC1_RSLT(fullNiceKey).then(
                result => {
                    if (result.SCRP_STAT_CD) {
                        switch (result.SCRP_STAT_CD) {
                            case responCode.ScrapingStatusCode.Data_Provided_Already.code:
                                preResponse = new PreResponse(responCode.RESCODEEXT.NORMAL.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                                responseData =
                                    new KYC_VC1_RSLTResponseWithResult(req.body, preResponse, responCode.ScrapingStatusCode.Data_Provided_Already.code, responCode.ScrapingStatusCode.Data_Provided_Already.message, result.RESULT_7D, result.RESULT_30D, result.RESULT_90D,
                                        result.ADDR_HOME, result.LAT_HOME, result.LONG_HOME, result.ADDR_WORK, result.LAT_WORK, result.LONG_WORK,
                                        result.ADDR_REFER, result.LAT_REFER, result.LONG_REFER, result.TEL_COMPANY);
                                // update INQLOG
                                dataInqLogSave = new DataSaveToInqLog(req.body, responseData);
                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                logger.info(responseData);
                                return res.status(200).json(responseData);
                            case responCode.ScrapingStatusCode.Complete.code:
                                preResponse = new PreResponse(responCode.RESCODEEXT.NORMAL.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                                responseData =
                                    new KYC_VC1_RSLTResponseWithResult(req.body, preResponse, responCode.ScrapingStatusCode.Complete.code, responCode.ScrapingStatusCode.Complete.message, result.RESULT_7D, result.RESULT_30D, result.RESULT_90D,
                                        result.ADDR_HOME, result.LAT_HOME, result.LONG_HOME, result.ADDR_WORK, result.LAT_WORK, result.LONG_WORK,
                                        result.ADDR_REFER, result.LAT_REFER, result.LONG_REFER, result.TEL_COMPANY);
                                // update INQLOG
                                dataInqLogSave = new DataSaveToInqLog(req.body, responseData);
                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                logger.info(responseData);
                                return res.status(200).json(responseData);
                            case responCode.ScrapingStatusCode.VMG_InProcessing.code:
                                preResponse = new PreResponse(responCode.RESCODEEXT.NORMAL.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                                responseData = new KYC_VC1_RSLTResponseWithoutResult(req.body, preResponse);
                                responseData.processStatusCode = responCode.ScrapingStatusCode.VMG_InProcessing.code;
                                // responseData.processStatusMessage = responCode.ScrapingStatusCode.VMG_InProcessing.message;
                                // update INQLOG
                                dataInqLogSave = new DataSaveToInqLog(req.body, responseData);
                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                logger.info(responseData);
                                return res.status(200).json(responseData);
                            case responCode.ScrapingStatusCode.Application_Error.code:
                                preResponse = new PreResponse(responCode.RESCODEEXT.NORMAL.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                                responseData = new KYC_VC1_RSLTResponseWithoutResult(req.body, preResponse);
                                responseData.processStatusCode = responCode.ScrapingStatusCode.Application_Error.code;
                                // responseData.processStatusMessage = responCode.ScrapingStatusCode.Application_Error.message;
                                // update INQLOG
                                dataInqLogSave = new DataSaveToInqLog(req.body, responseData);
                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                logger.info(responseData);
                                return res.status(200).json(responseData);
                            case responCode.ScrapingStatusCode.Telco_Interface_Error.code:
                                preResponse = new PreResponse(responCode.RESCODEEXT.NORMAL.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                                responseData = new KYC_VC1_RSLTResponseWithoutResult(req.body, preResponse);
                                responseData.processStatusCode = responCode.ScrapingStatusCode.Telco_Interface_Error.code;
                                // responseData.processStatusMessage = responCode.ScrapingStatusCode.Telco_Interface_Error.message;
                                // update INQLOG
                                dataInqLogSave = new DataSaveToInqLog(req.body, responseData);
                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                logger.info(responseData);
                                return res.status(200).json(responseData);
                            default:
                                preResponse = new PreResponse(responCode.RESCODEEXT.NORMAL.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                                responseData = new KYC_VC1_RSLTResponseWithoutResult(req.body, preResponse);
                                responseData.processStatusCode = responCode.ScrapingStatusCode.Other_Error.code;
                                // responseData.processStatusMessage = responCode.ScrapingStatusCode.Other_Error.message;
                                // update INQLOG
                                dataInqLogSave = new DataSaveToInqLog(req.body, responseData);
                                cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                logger.info(responseData);
                                return res.status(200).json(responseData);
                        }
                    } else if(_.isEmpty(result)) {
                        preResponse = new PreResponse(responCode.RESCODEEXT.NOTEXIST.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.NOTEXIST.code);
                        responseData = new KYC_VC1_RSLTResponseWithoutResult(req.body, preResponse);
                        // update INQLOG
                        dataInqLogSave = new DataSaveToInqLog(req.body, responseData);
                        cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                        logger.info(responseData);
                        return res.status(200).json(responseData);
                    } else {
                        preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                        responseData = new KYC_VC1_RSLTResponseWithoutResult(req.body, preResponse);
                        // update INQLOG
                        dataInqLogSave = new DataSaveToInqLog(req.body, responseData);
                        cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                        logger.info(responseData);
                        return res.status(200).json(responseData);
                    }
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
