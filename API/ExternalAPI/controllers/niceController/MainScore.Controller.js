const RCS_M01_RQSTRes_Without_Result = require('../../domain/RCS_M01_RQST.response');
const RCS_M01_RQSTRes_With_Result = require('../../domain/MainScoreResponseWith_Result.response');
const PreResponse = require('../../domain/preResponse.response');
const bodyPostRclips = require('../../domain/bodyPostRclips.body');
const bodyPostVmgCAC1 = require('../../domain/bodyPostVmgCAC1.body');
const bodyVmg_KYC_2 = require('../../domain/bodyVmg_KYC_2.body');
const dataCAC1SaveToVmgLocPct = require('../../domain/dataCAC1SaveToVmgLocPct.save');
const dataCAC1SaveToVmgAddress = require('../../domain/dataVmgCacSaveToVmgAddress.save');
const validRCS_M01_RQST = require('../../util/validateRCSM01ParamRequest');
const _ = require('lodash');
const common_service = require('../../services/common.service');
const responCode = require('../../../shared/constant/responseCodeExternal');
const DataSaveToInqLog = require('../../domain/data_FptId_Save_To_InqLog.save');
const cicExternalService = require('../../services/cicExternal.service');
const validS11AService = require('../../services/validS11A.service');
const utilFunction = require('../../../shared/util/util');
const util = require('../../util/dateutil');
const dateutil = require('../../util/dateutil');
const dataMainScoreSaveToScrapLog = require('../../domain/dataMainScoreSaveToScrapLog.save');
const dataVmgKyc2SaveToVmgIncome = require('../../domain/dataVmgKyc2SaveToVmgIncome.save');
const URI = require('../../../shared/URI');
const axios = require('axios');
const logger = require('../../config/logger');
const dataMainScoreRclipsSaveToExtScore = require('../../domain/dataMainScoreRclipsSaveToExtScore.save')
const dns = require('dns');
const https = require('https');
const http = require('http');
const querystring = require('querystring');
exports.rcs_M01_RQST = function (req, res) {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 60 * 1000
        }
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
                logger.info(responseData);
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
                    logger.info(responseData);
                    return res.status(200).json(responseData);
                } else if (_.isEmpty(dataFICode[0]) && utilFunction.checkStatusCodeScraping(responCode.OracleError, utilFunction.getOracleCode(dataFICode))) {
                    preResponse = new PreResponse(responCode.RESCODEEXT.ErrorDatabaseConnection.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.ErrorDatabaseConnection.code);
                    responseData = new RCS_M01_RQSTRes_Without_Result(req.body, preResponse);
                    logger.info(responseData);
                    return res.status(500).json(responseData);
                }
                // check CIC score
                cicExternalService.selectCICScoreAndGrade(req.body.cicNiceSessionKey).then(
                    resultCICScore => {
                        if (resultCICScore.SCORE) {
                            // check Zalo&vmg score
                            cicExternalService.selectZaloAndVMGRiskScoreByNiceSsKyAandCustCd(req.body.nfNiceSessionKey, req.body.fiCode).then(
                                resultZaloVmg => {
                                    if (resultZaloVmg.zaloScore && resultZaloVmg.vmgScore && resultZaloVmg.natID) {
                                        let dataSaveToScraplog = new dataMainScoreSaveToScrapLog(req.body, fullNiceKey);
                                        // insert to ScrapLog
                                        cicExternalService.insertDataReqToSCRPLOG(dataSaveToScraplog).then(
                                            result => {
                                                //
                                                // call VMG KYC 2
                                                console.log("dns.lookup api2-test.infosky.vn checking...");
                                                dns.lookup('api2-test.infosky.vn', (err, address, family) => {
                                                    console.log('address: %j family: IPv%s', address, family);
                                                    console.log(err);
                                                });
                                                let bodyVmgKyc2 = new bodyVmg_KYC_2(req.body.natId);
                                                const dataVmgKyc2 = JSON.stringify(bodyVmgKyc2);
                                                const options = {
                                                    hostname: 'api2-test.infosky.vn',
                                                    port: 443,
                                                    path: '/app/info_sky_v2/api/request',
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                        'Content-Length': dataVmgKyc2.length
                                                    }
                                                };
                                                console.log(options);
                                                const request = https.request(options, response => {
                                                    console.log(`statusCode: ${response.statusCode}`)
                                                    let resultKYC2 = '';
                                                    response.on('data', d => {
                                                         resultKYC2 += d;
                                                        resultKYC2 = JSON.parse(resultKYC2);
                                                        console.log('dataResponse: ', resultKYC2);
                                                        if (resultKYC2.error_code.toString()) {
                                                            let bodyRclipsReq;
                                                            let totalInComeMonth;
                                                            if ((resultKYC2.error_code === 0 || resultKYC2.error_code === 20) && resultKYC2.result) {
                                                                // store data KYC2 to DB
                                                                let dataSaveToVmgIncome = new dataVmgKyc2SaveToVmgIncome(fullNiceKey, resultKYC2);
                                                                cicExternalService.insertDataToVmgIncome(dataSaveToVmgIncome).then();
                                                                //
                                                                if (resultKYC2.result.totalIncome_3) {
                                                                    totalInComeMonth = parseFloat(resultKYC2.result.totalIncome_3) / 12;
                                                                } else if (resultKYC2.result.totalIncome_2) {
                                                                    totalInComeMonth = parseFloat(resultKYC2.result.totalIncome_2) / 12;
                                                                } else if (resultKYC2.result.totalIncome_1) {
                                                                    totalInComeMonth = parseFloat(resultKYC2.result.totalIncome_1) / 12;
                                                                } else {
                                                                    totalInComeMonth = "";
                                                                }
                                                            }
                                                            bodyRclipsReq = new bodyPostRclips(responCode.TaskCode.RCS_M01_RQST.code, req.body.mobilePhoneNumber, req.body.natId, '3', '1', resultZaloVmg.vmgScore, resultZaloVmg.vmgGrade, resultZaloVmg.zaloScore, parseFloat(resultCICScore.SCORE), parseFloat(resultCICScore.GRADE), totalInComeMonth);
                                                            logger.info(bodyRclipsReq);
                                                            const dataRclip = JSON.stringify(bodyRclipsReq);
                                                            const optionsdataRclip = {
                                                                hostname: '103.112.124.153',
                                                                port: '18082',
                                                                path: '/online/rclips/json',
                                                                method: 'POST',
                                                                headers: {
                                                                    'Content-Type': 'application/json',
                                                                    'Content-Length': Buffer.byteLength(dataRclip)
                                                                }
                                                            }

                                                            http
                                                                .request(optionsdataRclip, resdataRclip => {
                                                                    let data = ""
                                                                    resdataRclip.on("data", d => {
                                                                        data += d
                                                                    })
                                                                    resdataRclip.on("end", () => {
                                                                        console.log(data)
                                                                        return res.status(200).json(data);
                                                                    })
                                                                })
                                                                .on("error", err => {
                                                                    return res.status(200).json(err);
                                                                })
                                                                .end(dataRclip)
                                                        } else {
                                                            console.log('errKYC2: ', resultKYC2.error_msg);
                                                            preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
                                                            responseData = new RCS_M01_RQSTRes_Without_Result(req.body, preResponse);
                                                            dataInqLogSave = new DataSaveToInqLog(req.body, preResponse);
                                                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                                            cicExternalService.updateRspCdScrapLogAfterGetResult(fullNiceKey, responCode.RESCODEEXT.EXTITFERR.code).then();
                                                            logger.info(responseData);
                                                            logger.info(resultKYC2);
                                                            return res.status(200).json(responseData);
                                                        }
                                                    })
                                                    response.on('error', e => {
                                                        let errKYC2 = JSON.parse(e.toString());
                                                        console.log('errKYC2: ', errKYC2);
                                                    })
                                                })
                                                req.on('error', error => {
                                                    console.error(error)
                                                })

                                                request.write(dataVmgKyc2)
                                                request.end()
                                            }
                                        ).catch(reason => {
                                            logger.error("reason 111...");
                                            console.log(reason);
                                            logger.error(reason.toString());
                                            return res.status(500).json({error: reason.toString()});
                                        })
                                    } else {
                                        preResponse = new PreResponse(responCode.RESCODEEXT.NODATAEXISTFORPHONENFICODE.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.NODATAEXISTFORPHONENFICODE.code);
                                        responseData = new RCS_M01_RQSTRes_Without_Result(req.body, preResponse);
                                        // update INQLOG
                                        dataInqLogSave = new DataSaveToInqLog(req.body, responseData);
                                        cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                                        logger.info(responseData);
                                        return res.status(200).json(responseData);
                                    }
                                }).catch(reason => {
                                logger.error("reason 222...");
                                console.log(reason);
                                logger.error(reason.toString());
                                return res.status(500).json({error: reason.toString()});
                            })
                        } else {
                            preResponse = new PreResponse(responCode.RESCODEEXT.NOTEXIST.name, fullNiceKey, dateutil.timeStamp(), responCode.RESCODEEXT.NOTEXIST.code);
                            responseData = new RCS_M01_RQSTRes_Without_Result(req.body, preResponse);
                            // update INQLOG
                            dataInqLogSave = new DataSaveToInqLog(req.body, responseData);
                            cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
                            logger.info(responseData);
                            return res.status(200).json(responseData);
                        }
                    }).catch(reason => {
                    logger.error("reason 333...");
                    console.log(reason);
                    logger.error(reason.toString());
                    return res.status(500).json({error: reason.toString()});
                })
            }).catch(reason => {
                logger.error("reason 444...");
                console.log(reason);
                logger.error(reason.toString());
                return res.status(500).json({error: reason.toString()});
            });
        }).catch(reason => {
            logger.error("reason 555...");
            console.log(reason);
            logger.error(reason.toString());
            return res.status(500).json({error: reason.toString()});
        });
    } catch (error) {
        logger.error("reason 5555...");
        console.log(reason);
        logger.error(error.toString());
        return res.status(500).json({error: error.toString()});
    }
};
