const logger = require('../config/logger');

const OKF_SPL_RQSTReq = require('../domain/OKF_SPL_RQST.request');
const OKF_SPL_RQSTRes = require('../domain/OKF_SPL_RQST.response');
const okFVNService = require('../services/okFVN.service');

const validation = require('../../shared/util/validation');

const validRequest = require('../util/validateOKVNParamRequest');

const util = require('../util/dateutil');

const common_service = require('../services/common.service');

const responCode = require('../../shared/constant/responseCodeExternal');
const _ = require('lodash');

const validS11AService = require('../services/validS11A.service');
const PreResponse = require('../domain/preResponse.response');
const dateutil = require('../util/dateutil');
const DataInqLogSave = require('../domain/INQLOG.save');
const cicExternalService = require('../services/cicExternal.service');
const utilFunction = require('../../shared/util/util');
const io = require('socket.io-client');
const URI = require('../../shared/URI');

exports.okf_SPL_RQST = function (req, res, next) {
    let socket;

    try {
        let niceSessionKey;
        let preResponse, responseData, dataInqLogSave;

        /*
        Checking parameters request
        Request data
        */
        let rsCheck = validRequest.checkOKVNParamRequest(req.body);

        if (!_.isEmpty(rsCheck)) {
            preResponse = new PreResponse(rsCheck.responseMessage, '', dateutil.timeStamp(), rsCheck.responseCode);

            responseData = new OKF_SPL_RQSTRes(req.body, preResponse);
            // update INQLOG
            dataInqLogSave = new DataInqLogSave(req.body, responseData.responseCode);
            cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                console.log('insert INQLOG:', r);
            });
            return res.status(200).json(responseData);
        }
        validS11AService.selectFiCode(req.body.fiCode, responCode.NiceProductCode.OKF_SPL_RQST.code).then(dataFICode => {
			console.log('selectFiCode:');
            if (_.isEmpty(dataFICode)) {
                preResponse = new PreResponse(responCode.RESCODEEXT.InvalidNiceProductCode.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.InvalidNiceProductCode.code);

                responseData = new OKF_SPL_RQSTRes(req.body, preResponse);
                // update INQLOG
                dataInqLogSave = new DataInqLogSave(req.body, responseData.responseCode);
                cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                    console.log('insert INQLOG:', r);
                });
                return res.status(200).json(responseData);
            }
            else if (_.isEmpty(dataFICode[0]) && utilFunction.checkStatusCodeScraping(responCode.OracleError, utilFunction.getOracleCode(dataFICode))) {
                preResponse = new PreResponse(responCode.RESCODEEXT.ErrorDatabaseConnection.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.ErrorDatabaseConnection.code);

                responseData = new OKF_SPL_RQSTRes(req.body, preResponse);

                return res.status(500).json(responseData);
            }
            //End check params request

            common_service.getSequence().then(resSeq => {
                niceSessionKey = util.timeStamp2() + resSeq[0].SEQ;

                const getdataReq = new OKF_SPL_RQSTReq(req.body, niceSessionKey);
                //JSON.stringify(getdataReq);
                console.log("getdataReq = ", getdataReq);

                //logging request
                logger.debug('log request parameters from routes after manage request');
                logger.info(req.body);

				//calculated simple limit
                okFVNService.getSimpleLimit(getdataReq, res).then(data => {
                    console.log("result OKF_SPL_RQST: ", data);

                    let responseSuccess = new PreResponse(responCode.RESCODEEXT.NORMAL.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                    responseData = new OKF_SPL_RQSTRes(getdataReq, responseSuccess);
					responseData.simpleLimit = data
                    // update INQLOG
                    dataInqLogSave = new DataInqLogSave(getdataReq, responseData.responseCode);
                    cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                        console.log('insert INQLOG:', r);
                    });
					//console.log("responseData = ", responseData);
                    return res.status(200).json(responseData);
                });

            });
        });

    } catch (err) {
        //conneciton socket
        socket = io.connect(URI.socket_url, { secure: true, rejectUnauthorized: false, multiplex: true });

        // emit socket
        socket.emit('External_message', { responseTime: dateutil.getTimeHours(), responseMessage: 'Error OKF_SPL_RQST' });
        // Close socket
        socket.emit('end');

        return res.status(500).json({ error: err.toString() });
    }
};

const RCS_M01_RQSTReq = require('../domain/RCS_M01_RQST.request');
const RCS_M01_RQSTRes = require('../domain/RCS_M01_RQST.response');
const validRCS_M01_RQST = require('../util/validateRCSM01ParamRequest');

exports.rcs_M01_RQST = function (req, res) {

    try {
        const getdataReq = new RCS_M01_RQSTReq(req.body);

        // check parameters request
        // request data
        let rsCheck = validRCS_M01_RQST.checkRCSM01ParamRequest(getdataReq);
        let preResponse, responseData, dataInqLogSave;

        if (!validation.isEmptyJson(rsCheck)) {
            preResponse = new PreResponse(rsCheck.responseMessage, '', dateutil.timeStamp(), rsCheck.responseCode);

            responseData = new RCS_M01_RQSTRes(getdataReq, preResponse, {}, {}, {},{},{});
            // update INQLOG
            dataInqLogSave = new DataInqLogSave(getdataReq, responseData.responseCode);
            cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                console.log('insert INQLOG:', r);
            });
            return res.status(200).json(responseData);
        }
		//TODO RCS_OK1_RQST not yet define NiceProductCode
        validS11AService.selectFiCode(req.body.fiCode, responCode.NiceProductCode.OKF_SPL_RQST.code).then(dataFICode => {
            if (_.isEmpty(dataFICode)) {
                preResponse = new PreResponse(responCode.RESCODEEXT.InvalidNiceProductCode.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.InvalidNiceProductCode.code);

                responseData = new RCS_M01_RQSTRes(req.body, preResponse, {}, {}, {},{},{});
                // update INQLOG
                dataInqLogSave = new DataInqLogSave(getdataReq, responseData.responseCode);
                cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                    console.log('insert INQLOG:', r);
                });
                return res.status(200).json(responseData);
            }
            else if (_.isEmpty(dataFICode[0]) && utilFunction.checkStatusCodeScraping(responCode.OracleError, utilFunction.getOracleCode(dataFICode))) {
                preResponse = new PreResponse(responCode.RESCODEEXT.ErrorDatabaseConnection.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.ErrorDatabaseConnection.code);

                responseData = new RCS_M01_RQSTRes(req.body, preResponse, {}, {}, {},{},{});

                return res.status(500).json(responseData);
            }
            // end check params reqest

			common_service.getSequence().then(resSeq => {
                niceSessionKey = util.timeStamp2() + resSeq[0].SEQ;

                const getdataReq = new RCS_M01_RQSTReq(req.body, niceSessionKey);
                //JSON.stringify(getdataReq);
                console.log("getdataReq = ", getdataReq);

                //logging request
                logger.debug('log request parameters from routes after manage request');
                logger.info(req.body);

				//TODO return result, no logic
				var reviewResult = { 
					finalGrade: "finalGradeValue", 
					finalLoanApproval: "finalLoanApprovalValue", 
					loanLimit: "loanLimitValue"
					};
					
					//0h-7h, 8h-12h, 13h-18h, 19h-23h

				var result7Day1 = { 
					homePercent: 40, 
					workPercent: 50, 
					referPercent: 10, 
					timeRange: "0h-7h"
					};
				var result7Day2 = { 
					homePercent: 35, 
					workPercent: 60, 
					referPercent: 5, 
					timeRange: "8h-12h"
					};
				var result7Day3 = { 
					homePercent: 33, 
					workPercent: 66, 
					referPercent: 1, 
					timeRange: "13h-18h"
					};
				var result7Day4 = { 
					homePercent: 80, 
					workPercent: 0, 
					referPercent: 20, 
					timeRange: "19h-23h"
					};
					
				var result30Day1 = { 
					homePercent: 40, 
					workPercent: 50, 
					referPercent: 10, 
					timeRange: "0h-7h"
					};
				var result30Day2 = { 
					homePercent: 35, 
					workPercent: 60, 
					referPercent: 5, 
					timeRange: "8h-12h"
					};
				var result30Day3 = { 
					homePercent: 35, 
					workPercent: 60, 
					referPercent: 5, 
					timeRange: "13h-18h"
					};
				var result30Day4 = { 
					homePercent: 35, 
					workPercent: 60, 
					referPercent: 5, 
					timeRange: "19h-23h"
					};	
				
				var result90Day1 = { 
					homePercent: 40, 
					workPercent: 50, 
					referPercent: 10, 
					timeRange: "0h-7h"
					};
				var result90Day2 = { 
					homePercent: 35, 
					workPercent: 60, 
					referPercent: 5, 
					timeRange: "8h-12h"
					};
				var result90Day3 = { 
					homePercent: 35, 
					workPercent: 60, 
					referPercent: 5, 
					timeRange: "13h-18h"
					};
				var result90Day4 = { 
					homePercent: 35, 
					workPercent: 60, 
					referPercent: 5, 
					timeRange: "19h-23h"
					};	
				
				var coordinates = {//Coordinates
			        homeAddressRv: "homeAddressRv value",
					homeLatitude: "homeLatitude value",
					homeLongtitude: "homeLongtitude value",
					workAddressRv: "workAddressRv value",
					workLatitude: "workLatitude value",
					workLongtitude: "workLongtitude value",
					referAddressRv: "referAddressRv value",
					referLatitude: "referLatitude value",
					referLongtitude: "referLongtitude value",
					telcoCompany: "telcoCompany value"
			    };
					
				var result7DayArrayTest=[];
				result7DayArrayTest.push(result7Day1);
				result7DayArrayTest.push(result7Day2);
				result7DayArrayTest.push(result7Day3);
				result7DayArrayTest.push(result7Day4);
				var result30DayArrayTest=[];
				result30DayArrayTest.push(result30Day1);
				result30DayArrayTest.push(result30Day2);
				result30DayArrayTest.push(result30Day3);
				result30DayArrayTest.push(result30Day4);
				var result90DayArrayTest=[];
				result90DayArrayTest.push(result90Day1);
				result90DayArrayTest.push(result90Day2);
				result90DayArrayTest.push(result90Day3);
				result90DayArrayTest.push(result90Day4);
				
				console.log('result7DayArrayTest:', result7DayArrayTest);
				
				let responseSuccess = new PreResponse(responCode.RESCODEEXT.NORMAL.name, niceSessionKey, dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
                responseData = new RCS_M01_RQSTRes(req.body, responseSuccess, reviewResult, result7DayArrayTest, result30DayArrayTest, result90DayArrayTest, coordinates);
				
                // update INQLOG
                dataInqLogSave = new DataInqLogSave(getdataReq, responseData.responseCode);
                cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                    console.log('insert INQLOG:', r);
                });
				//console.log("responseData = ", responseData);
                return res.status(200).json(responseData);

            });            

        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.toString() });
    }
};