
// const { validationResult, body } = require('express-validator/check');

const logger = require('../../InternalAPI/config/logger');

const cics11aRQSTReq = require('../domain/CIC_S11A_RQST.request');

const cicExternalService = require('../services/cicExternal.service');

const cics11aRQSTRes = require('../domain/CIC_S11A_RQST.response');

const validation = require('../../shared/util/validation');
const dateutil = require('../util/dateutil');
const validRequest = require('../util/validateParamRequest');
const encryptPassword = require('../util/encryptPassword');

const responcodeEXT = require('../../shared/constant/responseCodeExternal');

// exports.validate = (method) => {
// 	switch (method) {
// 		case 'cics11aRQST': {
// 			return [
// 				body('fiCode', 'fiCode does not exists').exists(),
// 				body('taskCode', 'taskCode does not exists').exists(),
// 				body('loginId', 'cicId does not exists').exists(),
// 				body('loginPw', 'loginPw does not exists').exists(),
// 				body('cicGoodCode', 'cicGoodCode does not exists').exists(),
// 				body('inquiryDate', 'inquiryDate does not exists').exists(),
// 				body('infoProvConcent', 'infoProvConcent does not exists').exists()
// 			]
// 		}
// 	}
// };

exports.cics11aRQST = function (req, res, next) {
	try {
		var start = new Date();
		// Finds the validation errors in this request and wraps them in an object with handy functions
		// const errors = validationResult(req);
		// if (!errors.isEmpty()) {
		// 	res.status(422).json({ errors: errors.array() });
		// 	return;
		// }

		// encrypt password
		let password = encryptPassword.encrypt(req.body.loginPw);

		const getdataReq = new cics11aRQSTReq(req.body, password);
		// JSON.stringify(getdataReq);
		console.log("getdataReq=====", getdataReq);

		//Logging request
		logger.debug('Log request parameters from routes after manage request');
		logger.info(getdataReq);

		/*
		* Checking parameters request
		* Request data
		*/
		let rsCheck = validRequest.checkParamRequest(getdataReq);
		let preResponse = {
			responseMessage: rsCheck.responseMessage,
			niceSessionKey: "",
			responseTime: dateutil.getSeconds(start),
			responseCode: rsCheck.responseCode
		}

		if (!validation.isEmptyJson(rsCheck)) {
			let responseData = new cics11aRQSTRes(getdataReq, preResponse);
			return res.status(200).json(responseData);
		}
		//End check params request

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

	} catch (err) {
		return next(err)
	}
};

exports.cics11aRSLT = function (req, res) {
	try {

	} catch (error) {
		console.log(error);
	}

};

