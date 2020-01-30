
const logger = require('../config/logger');

const cics11aRQSTReq = require('../domain/CIC_S11A_RQST.request');

const cicExternalService = require('../services/cicExternal.service');

const cics11aRQSTRes = require('../domain/CIC_S11A_RQST.response');

const validation = require('../../shared/util/validation');
const dateutil = require('../util/dateutil');
const validRequest = require('../util/validateParamRequest');
const encryptPassword = require('../util/encryptPassword');

const responcodeEXT = require('../../shared/constant/responseCodeExternal');

const util = require('../util/dateutil');
const common_service = require('../services/common.service');
const _ = require('lodash');

exports.cics11aRQST = function (req, res, next) {
	try {
		var start = new Date();

		// encrypt password
		let password = encryptPassword.encrypt(req.body.loginPw);
		// let niceSessionKey = nicekey.makeNiceSessionKey();
		let niceSessionKey;
		common_service.getSequence().then(resSeq => {
			niceSessionKey = util.timeStamp2() + resSeq[0].SEQ;

			const getdataReq = new cics11aRQSTReq(req.body, password, niceSessionKey);
			// JSON.stringify(getdataReq);
			console.log("getdataReq =", getdataReq);

			//Logging request
			logger.debug('Log request parameters from routes after manage request');
			logger.info(getdataReq);

			/*
			* Checking parameters request
			* Request data
			*/
			let rsCheck = validRequest.checkParamRequest(getdataReq);

			if (!validation.isEmptyJson(rsCheck)) {
				let preResponse = {
					responseMessage: rsCheck.responseMessage,
					niceSessionKey: "",
					responseTime: dateutil.getSeconds(start),
					responseCode: rsCheck.responseCode
				}

				let responseData = new cics11aRQSTRes(getdataReq, preResponse);
				return res.status(200).json(responseData);
			}
			//End check params request

			cicExternalService.insertINQLOG(getdataReq, res).then(res1 => {
				console.log('insertINQLOG::', res1);
				cicExternalService.insertSCRPLOG(getdataReq, res).then(result => {
					console.log("result cics11aRQST: ", result);

					let response = {
						responseMessage: responcodeEXT.RESCODEEXT.INPROCESS.name,
						niceSessionKey: result,
						responseTime: dateutil.getSeconds(start),
						responseCode: responcodeEXT.RESCODEEXT.INPROCESS.code
					}

					let responseUnknow = {
						responseMessage: responcodeEXT.RESCODEEXT.UNKNOW.name,
						niceSessionKey: result,
						responseTime: dateutil.getSeconds(start),
						responseCode: responcodeEXT.RESCODEEXT.UNKNOW.code
					}

					if (!validation.isEmptyStr(result)) {
						let responseData = new cics11aRQSTRes(getdataReq, response);
						return res.status(200).json(responseData);
					} else {
						let responseData = new cics11aRQSTRes(getdataReq, responseUnknow);
						return res.status(400).json(responseData);
					}
				});
			});
		});

	} catch (err) {
		return next(err)
	}
};

const cics11aRSLTReq = require('../domain/CIC_S11A_RSLT.request');
const cics11aRSLTRes = require('../domain/CIC_S11A_RSLT.response');
const validS11ARQLT = require('../util/validRequestS11AResponse');

const loanDetailNode = require('../domain/loan/loanDetailNode');

exports.cics11aRSLT = function (req, res) {
	try {
		var start = new Date();

		const getdataReq = new cics11aRSLTReq(req.body);

		/*
		* Checking parameters request
		* Request data
		*/
		let rsCheck = validS11ARQLT.checkParamRequestForResponse(getdataReq);

		if (!validation.isEmptyJson(rsCheck)) {
			let preResponse = {
				responseMessage: rsCheck.responseMessage,
				responseTime: dateutil.getSeconds(start),
				responseCode: rsCheck.responseCode

			}

			let responseData = new cics11aRSLTRes(preResponse, {});
			return res.status(200).json(responseData);
		}
		//End check params request

		cicExternalService.selectCICS11aRSLT(getdataReq, res).then(reslt => {
			console.log("result selectCICS11aRSLT: ", reslt);

			let response = {
				responseMessage: responcodeEXT.RESCODEEXT.NORMAL.name,
				responseTime: dateutil.getSeconds(start),
				responseCode: responcodeEXT.RESCODEEXT.NORMAL.code
			}

			let responseUnknow = {
				responseMessage: responcodeEXT.RESCODEEXT.NOTEXIST.name,
				responseTime: dateutil.getSeconds(start),
				responseCode: responcodeEXT.RESCODEEXT.NOTEXIST.code
			}

			if (!validation.isEmptyStr(reslt)) {
				const arrloanDetailNode = [];
				var totalFiLoanVND, totalFiLoanUSD;
				var cmtLoanDetaiInfo, cmtCreditCard;
				var creditCardTotalLimit, creditCardTotalBalance, creditCardTotalArrears, numberOfCreditCard, creditCardIssueCompany;

				// 2.1 Loan detail infor
				if (!_.isEmpty(reslt.outputLoanDetailinfo)) {
					reslt.outputLoanDetailinfo.forEach(em => {
						arrloanDetailNode.push(new loanDetailNode(em));
						totalFiLoanVND = em.SUM_TOT_OGZ_VND;
						totalFiLoanUSD = em.SUM_TOT_OGZ_USD;
					});
				} else {
					cmtLoanDetaiInfo = reslt.cmtLoanDetailInfo;
				}

				// 2.2 Credit card infor
				if (!_.isEmpty(reslt.outputCreditCardInfo)) {
					creditCardTotalLimit = reslt.outputCreditCardInfo.CARD_TOT_LMT;
					creditCardTotalBalance = reslt.outputCreditCardInfo.CARD_TOT_SETL_AMT;
					creditCardTotalArrears = reslt.outputCreditCardInfo.CARD_TOT_ARR_AMT;
					numberOfCreditCard = reslt.outputCreditCardInfo.CARD_CNT;
					creditCardIssueCompany = reslt.outputCreditCardInfo.CARD_ISU_OGZ;

				}
				else {
					cmtCreditCard = reslt.cmtCreditCard.split('.')[0];
				}

				let responseData = new cics11aRSLTRes(response, reslt.outputScrpTranlog[0], reslt.outputCicrptMain[0], arrloanDetailNode, totalFiLoanVND, totalFiLoanUSD, cmtLoanDetaiInfo
					, creditCardTotalLimit, creditCardTotalBalance, creditCardTotalArrears, numberOfCreditCard, creditCardIssueCompany, cmtCreditCard);
				return res.status(200).json(responseData);
			} else {
				let responseData = new cics11aRSLTRes(responseUnknow, {}, {}, {});
				return res.status(400).json(responseData);
			}
		});

	} catch (error) {
		console.log(error);
	}

};

