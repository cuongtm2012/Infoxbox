
const { validationResult, body } = require('express-validator/check');

const logger = require('../shared/logs/logger');

const cics11aRQSTReq = require('../domain/CIC_S11A_RQST.request');

const cicExternalService = require('../services/cicExternal.service');

const cics11aRQSTRes = require('../domain/CIC_S11A_RQST.response');

exports.validate = (method) => {
	switch (method) {
		case 'cics11aRQST': {
			return [
				body('fiCode', 'fiCode does not exists').exists(),
				body('taskCode', 'taskCode does not exists').exists(),
				body('loginId', 'cicId does not exists').exists(),
				body('loginPw', 'loginPw does not exists').exists(),
				body('cicGoodCode', 'cicGoodCode does not exists').exists(),
				body('inquiryDate', 'inquiryDate does not exists').exists(),
				body('infoProvConcent', 'infoProvConcent does not exists').exists()
			]
		}
	}
};

exports.cics11aRQST = function (req, res, next) {
	try {

		// Finds the validation errors in this request and wraps them in an object with handy functions
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(422).json({ errors: errors.array() });
			return;
		}

		const getdataReq = new cics11aRQSTReq(req.body);
		// JSON.stringify(getdataReq);
		console.log("getdataReq=====", getdataReq);

		//Logging request
		logger.debug('Log request parameters from routes after manage request');
		logger.info(getdataReq);

		cicExternalService.insertSCRPLOG(getdataReq, res).then(result => {
			console.log("result cics11aRQST: ", result);

			let preResponse1 = {
				responseMessage: "REQUEST IS PROCESSING	",
				niceSessionKey: getdataReq.fiSessionKey,
				responseTime: "0.2S",
				responseCode: "0000"
			}

			let preResponse2 = {
				responseMessage: "REQUEST IS FAILED",
				niceSessionKey: getdataReq.fiSessionKey,
				responseTime: "0.2S",
				responseCode: "P000"
			}
			if (result == 1) {
				let responseData = new cics11aRQSTRes(getdataReq, preResponse1);
				return res.status(200).json(responseData);
			} else {
				let responseData = new cics11aRQSTRes(getdataReq, preResponse2);
				return res.status(200).json(responseData);
			}
		});

	} catch (err) {
		return next(err)
	}
};

