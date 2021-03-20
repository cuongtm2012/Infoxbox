
const logger = require('../../config/logger');

const cics11aRQSTReq = require('../../domain/CIC_S11A_RQST.request');

const cicExternalService = require('../../services/cicExternal.service');

const cics11aRQSTRes = require('../../domain/CIC_S11A_RQST.response');

const dateutil = require('../../util/dateutil');
const validRequest = require('../../util/validateParamRequest');
const encryptPassword = require('../../util/encryptPassword');

const responCode = require('../../../shared/constant/responseCodeExternal');

const util = require('../../util/dateutil');
const common_service = require('../../services/common.service');
const _ = require('lodash');
const utilFunction = require('../../../shared/util/util');

const validS11AService = require('../../services/validS11A.service');
const PreResponse = require('../../domain/preResponse.response');
const DataInqLogSave = require('../../domain/INQLOG.save');
const io = require('socket.io-client');
const URI = require('../../../shared/URI');

exports.cics11aRQST = function (req, res, next) {
	let socket;

	try {
		// encrypt password
		let password = encryptPassword.encrypt(req.body.loginPw);
		let niceSessionKey;
		/*
		* Checking parameters request
		* Request data
		*/
		let rsCheck = validRequest.checkParamRequest(req.body);
		let preResponse, responseData, dataInqLogSave;
		if (!_.isEmpty(rsCheck)) {
			preResponse = new PreResponse(rsCheck.responseMessage, '', dateutil.timeStamp(), rsCheck.responseCode);

			responseData = new cics11aRQSTRes(req.body, preResponse);

			// update INQLOG
			dataInqLogSave = new DataInqLogSave(req.body, responseData.responseCode);
			cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
				console.log('insert INQLOG:', r);
			});
			logger.info(responseData);
			return res.status(200).json(responseData);
		}
		validS11AService.selectFiCode(req.body.fiCode, responCode.NiceProductCode.S11A.code).then(dataFICode => {
			if (_.isEmpty(dataFICode)) {
				preResponse = new PreResponse(responCode.RESCODEEXT.InvalidNiceProductCode.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.InvalidNiceProductCode.code);

				responseData = new cics11aRQSTRes(req.body, preResponse);
				// update INQLOG
				dataInqLogSave = new DataInqLogSave(req.body, responseData.responseCode);
				cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
					console.log('insert INQLOG:', r);
				});
				logger.info(responseData);
				return res.status(200).json(responseData);
			}
			else if (_.isEmpty(dataFICode[0]) && utilFunction.checkStatusCodeScraping(responCode.OracleError, utilFunction.getOracleCode(dataFICode))) {
				preResponse = new PreResponse(responCode.RESCODEEXT.ErrorDatabaseConnection.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.ErrorDatabaseConnection.code);

				responseData = new cics11aRQSTRes(req.body, preResponse);
				logger.info(responseData);
				return res.status(500).json(responseData);
			}
			//End check params request
			common_service.getSequence().then(resSeq => {
				niceSessionKey = util.timeStamp2() + resSeq[0].SEQ;
				const getdataReq = new cics11aRQSTReq(req.body, password, niceSessionKey);

				console.log("getdataReq =", getdataReq);

				//Logging request
				logger.debug('Log request parameters from routes after manage request');
				logger.info(getdataReq);

				cicExternalService.insertSCRPLOG(getdataReq, res).then(niceSessionK => {
					console.log("result cics11aRQST: ", niceSessionK);
					if (!_.isEmpty(niceSessionK)) {
						let responseSuccess = new PreResponse(responCode.RESCODEEXT.NORMAL.name, niceSessionK, dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
						responseData = new cics11aRQSTRes(getdataReq, responseSuccess);
					} else {
						let responseUnknow = new PreResponse(responCode.RESCODEEXT.OtherInternalDBError.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.OtherInternalDBError.code);
						responseData = new cics11aRQSTRes(getdataReq, responseUnknow);
					}
					//TODO
					// call directly to scrapping service

					// update INQLOG
					dataInqLogSave = new DataInqLogSave(getdataReq, responseData.responseCode);
					cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
						console.log('insert INQLOG:', r);
					});
					logger.info(responseData);
					return res.status(200).json(responseData);
				}).catch(reason => {
					console.log(reason.toString());
					logger.error(reason.toString());
					return res.status(500).json({error: reason.toString()});
				});
			}).catch(reason => {
				console.log(reason.toString());
				logger.error(reason.toString());
				return res.status(500).json({error: reason.toString()});
			});
		}).catch(reason => {
			console.log(reason.toString());
			logger.error(reason.toString());
			return res.status(500).json({error: reason.toString()});
		});
	} catch (err) {
		//conneciton socket
		socket = io.connect(URI.socket_url, { secure: true, rejectUnauthorized: false });

		// emit socket
		socket.emit('External_message', { responseTime: dateutil.getTimeHours(), responseMessage: 'Error CIC_S11A_RQST' });
		// Close socket
		socket.emit('end');

		console.log(err);
		logger.error(err.toString());
		return res.status(500).json({ error: err.toString() });
	}
};

const cics11aRSLTReq = require('../../domain/CIC_S11A_RSLT.request');
const cics11aRSLTRes = require('../../domain/CIC_S11A_RSLT.response');
const validS11ARQLT = require('../../util/validRequestS11AResponse');

const loanDetailNode = require('../../domain/loan/loanDetailNode');
const disposalLoanNode = require('../../domain/loan/disposalVAMCLoan');
const loan12MInfor = require('../../domain/loan/loan12MInfo');
const npl5YLoan = require('../../domain/loan/nplLoan5year');
const loan12MCat = require('../../domain/loan/loan12MCautious');
const financialContract = require('../../domain/loan/financialContract');
const cusLookup = require('../../domain/loan/customerLookupInfo');

const convertMilionUnit = require('../../../shared/util/convertUnit');
const cics11aRSLTResLength = require('../../domain/CIC_S11A_RSLT.responseLegnth');

exports.cics11aRSLT = function (req, res) {
	try {
		const getdataReq = new cics11aRSLTReq(req.body);

		/*
		* Checking parameters request
		* Request data
		*/
		let rsCheck = validS11ARQLT.checkParamRequestForResponse(getdataReq);
		let preResponse, responseData, dataInqLogSave;

		if (!_.isEmpty(rsCheck)) {
			preResponse = {
				fiSessionKey: getdataReq.fiSessionKey,
				fiCode: getdataReq.fiCode,
				taskCode: getdataReq.taskCode,
				niceSessionKey: getdataReq.niceSessionKey,
				inquiryDate: getdataReq.inquiryDate,
				responseTime: dateutil.timeStamp(),
				responseCode: rsCheck.responseCode,
				responseMessage: rsCheck.responseMessage

			}
			// update INQLOG
			dataInqLogSave = new DataInqLogSave(getdataReq, preResponse.responseCode);
			cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
				console.log('insert INQLOG:', r);
			});
			logger.info(preResponse);
			return res.status(200).json(preResponse);
		}
		validS11AService.selectFiCode(req.body.fiCode, responCode.NiceProductCode.S11A.code).then(dataFICode => {
			if (_.isEmpty(dataFICode)) {
				preResponse = new PreResponse(responCode.RESCODEEXT.InvalidNiceProductCode.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.InvalidNiceProductCode.code);

				responseData = new cics11aRQSTRes(getdataReq, preResponse);
				// update INQLOG
				dataInqLogSave = new DataInqLogSave(getdataReq, responseData.responseCode);
				cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
					console.log('insert INQLOG:', r);
				});
				logger.info(responseData);
				return res.status(200).json(responseData);
			}
			else if (_.isEmpty(dataFICode[0]) && utilFunction.checkStatusCodeScraping(responCode.OracleError, utilFunction.getOracleCode(dataFICode))) {
				preResponse = new PreResponse(responCode.RESCODEEXT.ErrorDatabaseConnection.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.ErrorDatabaseConnection.code);

				responseData = new cics11aRQSTRes(req.body, preResponse);
				logger.info(responseData);
				return res.status(500).json(responseData);
			}
			//End check params request

			cicExternalService.selectCICS11aRSLT(getdataReq, res).then(reslt => {
				console.log("result selectCICS11aRSLT: ", reslt);

				if (!_.isEmpty(reslt)) {
					let responseData;
					const arrloanDetailNode = [];
					const arrVamcLoanInfo = [];
					const arrLoan12MInfo = [];
					const arrNPL5YLoan = [];
					const arrLoan12MonCat = [];
					const arrFinancialContract = [];
					const arrCusLookup = [];
					var totalFiLoanVND, totalFiLoanUSD;
					var cmtLoanDetaiInfo, cmtCreditCard, cmtVmacDisposalLoan, cmtLoan12MInfo, cmtNPL5YearLoan, cmtLoan12MCat, cmtFinancialContract, cmtCard3Year;
					var creditCardTotalLimit, creditCardTotalBalance, creditCardTotalArrears, numberOfCreditCard, creditCardIssueCompany;
					var gurAmountOfAssetBackedLoan, numberOfCollateral, numberOfFiWithCollateral;
					var borrowCreditCardArrear, creditCardLongestArrearDays, creditCardArrearCount;


					// 2.1 Loan detail infor
					if (!_.isEmpty(reslt.outputLoanDetailinfo) && _.isEmpty(cmtLoanDetaiInfo)) {
						reslt.outputLoanDetailinfo.forEach(em => {
							arrloanDetailNode.push(new loanDetailNode(em));
							totalFiLoanVND = convertMilionUnit.milionUnit(em.SUM_TOT_OGZ_VND);
							totalFiLoanUSD = convertMilionUnit.milionUnit(em.SUM_TOT_OGZ_USD);
						});
					} else {
						if (_.includes(reslt.cmtLoanDetailInfo, '.'))
							cmtLoanDetaiInfo = reslt.cmtLoanDetailInfo.split('.')[0];
						else
							cmtLoanDetaiInfo = reslt.cmtLoanDetailInfo;
					}

					// 2.2 Credit card infor
					if (!_.isEmpty(reslt.outputCreditCardInfo) && _.isEmpty(cmtCreditCard)) {
						creditCardTotalLimit = convertMilionUnit.milionUnit(reslt.outputCreditCardInfo[0].CARD_TOT_LMT);
						creditCardTotalBalance = convertMilionUnit.milionUnit(reslt.outputCreditCardInfo[0].CARD_TOT_SETL_AMT);
						creditCardTotalArrears = convertMilionUnit.milionUnit(reslt.outputCreditCardInfo[0].CARD_TOT_ARR_AMT);
						numberOfCreditCard = convertMilionUnit.convertNumber(reslt.outputCreditCardInfo[0].CARD_CNT);
						creditCardIssueCompany = reslt.outputCreditCardInfo[0].CARD_ISU_OGZ;

					}
					else {
						if (_.includes(reslt.cmtCreditCard, '.'))
							cmtCreditCard = reslt.cmtCreditCard.split('.')[0];
						else
							cmtCreditCard = reslt.cmtCreditCard;
					}

					// 2.3 VAMC Loan infor
					if (!_.isEmpty(reslt.outputVamcLoan) && _.isEmpty(reslt.cmtVamcLoan)) {
						reslt.outputVamcLoan.forEach(el => {
							arrVamcLoanInfo.push(new disposalLoanNode(el));
						});
					}
					else {
						if (_.includes(reslt.cmtVamcLoan, '.'))
							cmtVmacDisposalLoan = reslt.cmtVamcLoan.split('.')[0];
						else
							cmtVmacDisposalLoan = reslt.cmtVamcLoan;
					}

					// 2.4 Loan 12Month infor
					if (!_.isEmpty(reslt.outputLoan12MInfo) && _.isEmpty(reslt.cmtLoan12MInfo)) {
						reslt.outputLoan12MInfo.forEach(el => {
							arrLoan12MInfo.push(new loan12MInfor(el));
						});
					}
					else {
						if (_.includes(reslt.cmtLoan12MInfo, '.'))
							cmtLoan12MInfo = reslt.cmtLoan12MInfo.split('.')[0];
						else
							cmtLoan12MInfo = reslt.cmtLoan12MInfo;
					}

					// 2.5 NPL Loan 5 Year infor
					if (!_.isEmpty(reslt.outputNPL5YLoan) && _.isEmpty(reslt.cmtNPL5YearLoan)) {
						reslt.outputNPL5YLoan.forEach(el => {
							arrNPL5YLoan.push(new npl5YLoan(el));
						});
					}
					else {
						if (_.includes(reslt.cmtNPL5YearLoan, '.'))
							cmtNPL5YearLoan = reslt.cmtNPL5YearLoan.split('.')[0];
						else
							cmtNPL5YearLoan = reslt.cmtNPL5YearLoan;
					}

					// 2.6 Card 3 year infor
					if (!_.isEmpty(reslt.outputCard3year) && _.isEmpty(reslt.cmtCard3Year)) {
						borrowCreditCardArrear = convertBorrowCreditCard3Years(reslt.outputCard3year[0].CARD_ARR_PSN_YN);
						creditCardLongestArrearDays = reslt.outputCard3year[0].CARD_ARR_LGST_DAYS;
						creditCardArrearCount = reslt.outputCard3year[0].CARD_ARR_CNT;

					}
					else {
						if (_.includes(reslt.cmtCard3Year, '.'))
							cmtCard3Year = reslt.cmtCard3Year.split('.')[0];
						else
							cmtCard3Year = reslt.cmtCard3Year;
					}

					// 2.7 Loan 12M Cautios infor
					if (!_.isEmpty(reslt.outputloan12MCat) && _.isEmpty(reslt.cmtLoan12MCat)) {
						reslt.outputloan12MCat.forEach(el => {
							arrLoan12MonCat.push(new loan12MCat(el));
						});
					}
					else {
						if (_.includes(reslt.cmtLoan12MCat, '.'))
							cmtLoan12MCat = reslt.cmtLoan12MCat.split('.')[0];
						else
							cmtLoan12MCat = reslt.cmtLoan12MCat;
					}

					// 3.1 Collateral infor
					if (!_.isEmpty(reslt.outputCollateral)) {
						gurAmountOfAssetBackedLoan = reslt.outputCollateral[0].AST_SCRT_LOAN_GURT_AMT;
						numberOfCollateral = reslt.outputCollateral[0].SCRT_AST_CNT;
						numberOfFiWithCollateral = reslt.outputCollateral[0].SCRT_AST_OGZ_CNT;

					}

					// 3.2 Financial contract
					if (!_.isEmpty(reslt.outputFinanCialContract) && _.isEmpty(reslt.cmtFinancialContract)) {
						reslt.outputFinanCialContract.forEach(el => {
							arrFinancialContract.push(new financialContract(el));
						});
					}
					else {
						if (_.includes(reslt.cmtFinancialContract, '.'))
							cmtFinancialContract = reslt.cmtFinancialContract.split('.')[0];
						else
							cmtFinancialContract = reslt.cmtFinancialContract;
					}

					// 3.3 Customer lookup info
					if (!_.isEmpty(reslt.outputCusLookup)) {
						reslt.outputCusLookup.forEach(el => {
							arrCusLookup.push(new cusLookup(el));
						});
					}
					let response = new PreResponse(responCode.RESCODEEXT.NORMAL.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);

					responseData = new cics11aRSLTRes(getdataReq, response, reslt.outputScrpTranlog[0], reslt.outputCicrptMain[0], arrloanDetailNode, totalFiLoanVND, totalFiLoanUSD, cmtLoanDetaiInfo
						, creditCardTotalLimit, creditCardTotalBalance, creditCardTotalArrears, numberOfCreditCard, creditCardIssueCompany, cmtCreditCard
						, arrVamcLoanInfo, cmtVmacDisposalLoan
						, arrLoan12MInfo, cmtLoan12MInfo
						, arrNPL5YLoan, cmtNPL5YearLoan
						, arrLoan12MonCat, cmtLoan12MCat
						, gurAmountOfAssetBackedLoan, numberOfCollateral, numberOfFiWithCollateral
						, arrFinancialContract, cmtFinancialContract
						, arrCusLookup
						, borrowCreditCardArrear, creditCardLongestArrearDays, creditCardArrearCount, cmtCard3Year);

					// add length response mesaage
					let lenghResMessage = JSON.stringify({
						responseData
					}).length;

					responseData = new cics11aRSLTResLength(getdataReq, response, reslt.outputScrpTranlog[0], reslt.outputCicrptMain[0], arrloanDetailNode, totalFiLoanVND, totalFiLoanUSD, cmtLoanDetaiInfo
						, creditCardTotalLimit, creditCardTotalBalance, creditCardTotalArrears, numberOfCreditCard, creditCardIssueCompany, cmtCreditCard
						, arrVamcLoanInfo, cmtVmacDisposalLoan
						, arrLoan12MInfo, cmtLoan12MInfo
						, arrNPL5YLoan, cmtNPL5YearLoan
						, arrLoan12MonCat, cmtLoan12MCat
						, gurAmountOfAssetBackedLoan, numberOfCollateral, numberOfFiWithCollateral
						, arrFinancialContract, cmtFinancialContract
						, arrCusLookup
						, borrowCreditCardArrear, creditCardLongestArrearDays, creditCardArrearCount, cmtCard3Year
						, lenghResMessage, responseData.tnlv000001, responseData.tclv000001, responseData.tflv000001, responseData.tdlv000001, responseData.telv000001, responseData.tlv0000001, responseData.tblv000001);

					// update INQLOG
					dataInqLogSave = new DataInqLogSave(getdataReq, response.responseCode);
					cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
						console.log('insert INQLOG:', r);
					});
					//Logging response
					logger.info(responseData);

					return res.status(200).json(responseData);
				} else {
					// select in SCRPLOG check SCRP_STAT_CD
					cicExternalService.selectScrapingStatusCodeSCRPLOG(getdataReq).then(rslt => {

						if (_.isEmpty(rslt)) {
							let responseUnknow = {

								fiSessionKey: getdataReq.fiSessionKey,
								fiCode: getdataReq.fiCode,
								taskCode: getdataReq.taskCode,
								niceSessionKey: getdataReq.niceSessionKey,
								inquiryDate: getdataReq.inquiryDate,
								responseTime: dateutil.timeStamp(),
								responseCode: responCode.RESCODEEXT.NOTEXIST.code,
								responseMessage: responCode.RESCODEEXT.NOTEXIST.name
							}
							//update INQLog
							dataInqLogSave = new DataInqLogSave(getdataReq, responseUnknow.responseCode);
							cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
								console.log('insert INQLOG:', r);
							});
							logger.info(responseUnknow);
							return res.status(200).json(responseUnknow);
						}
						else {
							const result = rslt[0].SCRP_STAT_CD;
							let rsp_cd = rslt[0].RSP_CD;
							let responseMessage, responseCode;

							if (!_.isEmpty(rsp_cd)) {
								_.forEach(responCode.RESCODEEXT, res => {
									_.forEach(res, (val, key) => {
										if (_.isEqual(val, rsp_cd)) {
											console.log('response nice code:', res.code + '-' + res.name);
											responseMessage = res.name;
											responseCode = res.code;
										}
									});
								});
							} else {

								if (_.isEqual(parseInt(result), 20)) {
									responseMessage = responCode.RESCODEEXT.CICSiteLoginFailure.name;
									responseCode = responCode.RESCODEEXT.CICSiteLoginFailure.code;
								} else if (_.isEqual(parseInt(result), 21) || _.isEqual(parseInt(result), 22)) {
									responseMessage = responCode.RESCODEEXT.CICReportInqFailure.name;
									responseCode = responCode.RESCODEEXT.CICReportInqFailure.code;
								} else if (_.isEqual(parseInt(result), 23) || _.isEqual(parseInt(result), 24)) {
									responseMessage = responCode.RESCODEEXT.CICReportInqFailureTimeout.name;
									responseCode = responCode.RESCODEEXT.CICReportInqFailureTimeout.code;
								}
								else if (_.isEqual(parseInt(result), 1) || _.isEqual(parseInt(result), 4)) {
									responseMessage = responCode.RESCODEEXT.INPROCESS.name;
									responseCode = responCode.RESCODEEXT.INPROCESS.code;
								}
								else {
									responseMessage = responCode.RESCODEEXT.ETCError.name;
									responseCode = responCode.RESCODEEXT.ETCError.code;
								}
							}

							let responseSrapingStatus = {
								fiSessionKey: getdataReq.fiSessionKey,
								fiCode: getdataReq.fiCode,
								taskCode: getdataReq.taskCode,
								niceSessionKey: getdataReq.niceSessionKey,
								inquiryDate: getdataReq.inquiryDate,
								responseTime: dateutil.timeStamp(),
								responseCode: responseCode,
								responseMessage: responseMessage,
								scrapingStatusCode: result
							}
							//update INQLog
							dataInqLogSave = new DataInqLogSave(getdataReq, responseSrapingStatus.responseCode);
							cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
								console.log('insert INQLOG:', r);
							});
							//Logging response
							logger.info(responseSrapingStatus);

							return res.status(200).json(responseSrapingStatus);
						}
					}).catch(reason => {
						console.log(reason.toString());
						logger.error(reason.toString());
						return res.status(500).json({error: reason.toString()});
					});
				}
			}).catch(reason => {
				console.log(reason.toString());
				logger.error(reason.toString());
				return res.status(500).json({error: reason.toString()});
			});
		}).catch(reason => {
			console.log(reason.toString());
			logger.error(reason.toString());
			return res.status(500).json({error: reason.toString()});
		});

	} catch (error) {
		console.log(error);
		logger.error(error.toString());
		return res.status(500).json({ error: error.toString() });
	}

};

function convertBorrowCreditCard3Years(value) {
	if (!_.isEmpty(value) && 0 <= _.indexOf(['checked', 'check'], value.toLowerCase())) {
		return "Y";
	} else {
		return value;
	}
}