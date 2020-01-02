
const logger = require('../config/logger');

const cicExternalService = require('../services/cicExternal.service')

const validation = require('../../shared/util/validation');
const dateutil = require('../util/dateutil');

const responcodeEXT = require('../../shared/constant/responseCodeExternal');

const cics11aRSLTReq = require('../domain/CIC_S11A_RSLT.request');
const cics11aRSLTRes = require('../domain/CIC_S11A_RSLT.response');
const validS11ARQLT = require('../util/validRequestS11AResponse');

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

			let responseData = new cics11aRSLTRes(getdataReq, preResponse, {});
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
				responseMessage: responcodeEXT.RESCODEEXT.UNKNOW.name,
				responseTime: dateutil.getSeconds(start),
				responseCode: responcodeEXT.RESCODEEXT.UNKNOW.code
			}

			if (!validation.isEmptyStr(reslt)) {
				let responseData = new cics11aRSLTRes(getdataReq, response, reslt[0]);
				return res.status(200).json(responseData);
			} else {
				let responseData = new cics11aRSLTRes(getdataReq, responseUnknow, {});
				return res.status(400).json(responseData);
			}
		});

	} catch (error) {
		console.log(error);
	}

};

