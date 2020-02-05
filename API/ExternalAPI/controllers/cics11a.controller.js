
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
					responseTime: dateutil.timeStamp(),
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
						responseTime: dateutil.timeStamp(),
						responseCode: responcodeEXT.RESCODEEXT.INPROCESS.code
					}

					let responseUnknow = {
						responseMessage: responcodeEXT.RESCODEEXT.UNKNOW.name,
						niceSessionKey: result,
						responseTime: dateutil.timeStamp(),
						responseCode: responcodeEXT.RESCODEEXT.UNKNOW.code
					}

					if (!_.isEmpty(result)) {
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
const disposalLoanNode = require('../domain/loan/disposalVAMCLoan');
const loan12MInfor = require('../domain/loan/loan12MInfo');
const npl5YLoan = require('../domain/loan/nplLoan5year');
const loan12MCat = require('../domain/loan/loan12MCautious');
const financialContract = require('../domain/loan/financialContract');
const cusLookup = require('../domain/loan/customerLookupInfo');

const convertMilionUnit = require('../../shared/util/convertUnit');

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
				responseTime: dateutil.timeStamp(),
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
				responseTime: dateutil.timeStamp(),
				responseCode: responcodeEXT.RESCODEEXT.NORMAL.code
			}

			let responseUnknow = {
				getdataReq,
				responseMessage: responcodeEXT.RESCODEEXT.NOTEXIST.name,
				responseTime: dateutil.timeStamp(),
				responseCode: responcodeEXT.RESCODEEXT.NOTEXIST.code
			}

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
					borrowCreditCardArrear = reslt.outputCard3year[0].CARD_ARR_PSN_YN;
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
				return res.status(200).json(responseData);
			} else {
				// let responseData = new cics11aRSLTRes(responseUnknow, {}, {}, {});
				return res.status(400).json(responseUnknow);
			}
		});

	} catch (error) {
		console.log(error);
	}

};

