const validRequest = require('../../util/validateFTN_GAS_RQSTRequest');
const logger = require('../../config/logger');
const common_service = require('../../services/common.service');
const responCode = require('../../../shared/constant/responseCodeExternal');
const PreResponse = require('../../domain/preResponse.response');
const DataSaveToInqLog = require('../../domain/data_FptId_Save_To_InqLog.save');
const cicExternalService = require('../../services/cicExternal.service');
const dateutil = require('../../util/dateutil');
const util = require('../../util/dateutil');
const getApiStructureResponseWithoutResult = require('../../domain/getApiStructureReponseWithoutResult.response')
const validS11AService = require('../../services/validS11A.service');
const utilFunction = require('../../../shared/util/util');
const _ = require('lodash');
const dataGetStructureAPISaveToScrapLog = require('../../domain/dataGetStructureAPISaveToScrapLog.save');
const bodyGetAuthEContract = require('../../domain/bodyGetAuthEContract.body');
const axios = require('axios');
const URI = require('../../../shared/URI');
const responseGetApiStructureResponseWithResult = require('../../domain/responseGetStructureApiWithResult.response');
const database = require('../../config/db.config');
const dns = require('dns');
exports.getStructureAPI = function(req, res) {
	try {
		let statusErrorDNS = dnsLookup('demo.econtract.fpt.com.vn')
		if(statusErrorDNS){
			console.log("222 dns errorrrrrrrrrrrrrrr 22222222222 stop");
			clearTimeout(timeoutObj);
			return res.status(500).json({error: statusErrorDNS});
		}else{
			console.log("checking....");
			return res.status(200).send("Ok");
		}

		/*const config = {
			headers: {
				'Content-Type': 'application/json'
			},
			timeout: 60 * 1000
		}
		let rsCheck = validRequest.checkParamRequest(req.query);
		logger.info(req.query);
		let preResponse, responseData, dataInqLogSave;
		if (!_.isEmpty(rsCheck)) {
			preResponse = new PreResponse(rsCheck.responseMessage, '', dateutil.timeStamp(), rsCheck.responseCode);
			responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
			// save Inqlog
			dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
			cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
			logger.info(responseData);
			return res.status(200).send(responseData);
		} else {
			// check FI contract
			validS11AService.selectFiCode(req.query.fiCode, responCode.NiceProductCode.FTN_GAS_RQST.code).then(dataFICode => {
				if (_.isEmpty(dataFICode)) {
					preResponse = new PreResponse(responCode.RESCODEEXT.InvalidNiceProductCode.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.InvalidNiceProductCode.code);
					responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
					// update INQLOG
					dataInqLogSave = new DataSaveToInqLog(req.query, responseData);
					cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
					logger.info(responseData);
					return res.status(200).json(responseData);
				} else if (_.isEmpty(dataFICode[0]) && utilFunction.checkStatusCodeScraping(responCode.OracleError, utilFunction.getOracleCode(dataFICode))) {
					preResponse = new PreResponse(responCode.RESCODEEXT.ErrorDatabaseConnection.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.ErrorDatabaseConnection.code);
					responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
					logger.info(responseData);
					return res.status(500).json(responseData);
				} else {
					(async() => {
						console.log("dns.lookup checking..." + URI.URL_E_CONTRACT_GET_TOKEN_ACCESS_DEV);
						let statusErrorDNS = dnsLookup('demo.econtract.fpt.com.vn')
						if(statusErrorDNS){
							console.log("dns errorrrrrrrrrrrrrrr 1111111111 sleep 2s");
							await sleep(2000);
							console.log("dns check again");
							statusErrorDNS = dnsLookup('demo.econtract.fpt.com.vn')
							if(statusErrorDNS){
								console.log("dns errorrrrrrrrrrrrrrr 22222222222 stop");
								return res.status(500).json({error: statusErrorDNS});
							}else{
								console.log("getAuthAccess lan 2");
								return getAuthAccess(config,req, res)
							}
						}else{
							console.log("getAuthAccess lan 1");
							return getAuthAccess(config,req, res)
						}
					})();
					//Tuanma move to function

				}
			}).catch(reason => {
				logger.error(reason.toString());
				return res.status(500).json({ error: reason.toString()});
				}
			)
		}*/
		
		
	} catch (err) {
		logger.error(err.toString());
		return res.status(500).json({ error:err.toString()});
	}
}

function getAuthAccess(config, req, res) {
	//    getAuthAccess
	let bodyGetAuth = new bodyGetAuthEContract();

	axios.post(URI.URL_E_CONTRACT_GET_TOKEN_ACCESS_DEV, bodyGetAuth, config).then(
		resultGetAuthAccess => {
			if (!_.isEmpty(resultGetAuthAccess.data.access_token)) {
				(async() => {
					console.log("222 dns.lookup checking..." + URI.URL_E_CONTRACT_GET_STRUCTURE_API_DEV);
					let statusErrorDNS = dnsLookup('demo.econtract.fpt.com.vn')
					if(statusErrorDNS){
						console.log("222 dns errorrrrrrrrrrrrrrr 1111111111 sleep 2s");
						await sleep(2000);
						console.log("222 dns check again");
						statusErrorDNS = dnsLookup('demo.econtract.fpt.com.vn')
						if(statusErrorDNS){
							console.log("222 dns errorrrrrrrrrrrrrrr 22222222222 stop");
							return res.status(500).json({error: statusErrorDNS});
						}else{
							console.log("222 getStructureContract lan 2");
							return getStructureContract(resultGetAuthAccess,req, res)
						}
					}else{
						console.log("222 getStructureContract lan 1");
						return getStructureContract(resultGetAuthAccess,req, res)
					}
				})();
					
				
			}
		}
	).catch(reason => {
		console.log('errGetStatus: ', reason.toString());
		if (reason.message === 'timeout of 60000ms exceeded') {
			preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFTIMEOUTERR.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFTIMEOUTERR.code);
			responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
			dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
			cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
			cicExternalService.updateRspCdScrapLogAfterGetResult('', responCode.RESCODEEXT.EXTITFTIMEOUTERR.code).then();
			logger.info(responseData);
			logger.info(reason.toString());
			return res.status(200).json(responseData);
		} else {
			preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
			responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
			dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
			cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
			cicExternalService.updateRspCdScrapLogAfterGetResult('', responCode.RESCODEEXT.EXTITFERR.code).then();
			logger.info(responseData);
			logger.info(reason.toString());
			return res.status(200).json(responseData);
		}
	})
}

function getStructureContract(resultGetAuthAccess, req, res){
	let URlGetStructureContract = URI.URL_E_CONTRACT_GET_STRUCTURE_API_DEV + req.query.alias;
	let configGetStructure = {
		headers: {
			'Authorization': `Bearer ${resultGetAuthAccess.data.access_token}`,
			'Accept-Encoding': 'gzip, deflate, br'
		},
		timeout: 60 * 1000
	}
	axios.get(URlGetStructureContract, configGetStructure).then(
		resultGetStructure => {
			if (resultGetStructure.status === 200 && !_.isEmpty(resultGetStructure.data)) {
				preResponse = new PreResponse(responCode.RESCODEEXT.NORMAL.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.NORMAL.code);
				responseData = new responseGetApiStructureResponseWithResult(req.query, preResponse, resultGetStructure.data);
				dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
				cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
				cicExternalService.updateRspCdScrapLogAfterGetResult('', responCode.RESCODEEXT.NORMAL.code).then();
				logger.info(responseData);
				return res.status(200).json(responseData);
			} else {
				//    update scraplog & response F048
				console.log('errGetStructure: ', resultGetStructure);
				preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
				responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
				dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
				cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
				cicExternalService.updateRspCdScrapLogAfterGetResult('', responCode.RESCODEEXT.EXTITFERR.code).then();
				logger.info(responseData);
				logger.info(resultGetStructure.data);
				return res.status(200).json(responseData);
			}
		}).catch(reason => {
			console.log('errGetStructureContract: ', reason.toString());
			if (reason.response && reason.response.data.message === 'Internal Server Error: template  is not exists') {
				console.log('errGetStructureContract: ', reason.response.data.message);
				preResponse = new PreResponse(responCode.RESCODEEXT.NoContractTemplateForInputAlias.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.NoContractTemplateForInputAlias.code);
				responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
				dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
				cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
				cicExternalService.updateRspCdScrapLogAfterGetResult('', responCode.RESCODEEXT.NoContractTemplateForInputAlias.code).then();
				logger.info(responseData);
				logger.info(reason.toString());
				return res.status(200).json(responseData);
			} else if (reason.message === 'timeout of 60000ms exceeded') {
				preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFTIMEOUTERR.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFTIMEOUTERR.code);
				responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
				dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
				cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
				cicExternalService.updateRspCdScrapLogAfterGetResult('', responCode.RESCODEEXT.EXTITFTIMEOUTERR.code).then();
				logger.info(responseData);
				logger.info(reason.toString());
				return res.status(200).json(responseData);
			} else {
				preResponse = new PreResponse(responCode.RESCODEEXT.EXTITFERR.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.EXTITFERR.code);
				responseData = new getApiStructureResponseWithoutResult(req.query, preResponse);
				dataInqLogSave = new DataSaveToInqLog(req.query, preResponse);
				cicExternalService.insertDataToINQLOG(dataInqLogSave).then();
				cicExternalService.updateRspCdScrapLogAfterGetResult('', responCode.RESCODEEXT.EXTITFERR.code).then();
				logger.info(responseData);
				logger.info(reason.toString());
				return res.status(200).json(responseData);
			}
		})
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}  

function dnsLookup(domain){
	dns.lookup(domain, (err, address, family) => {
		console.log('address: %j family: IPv%s', address, family);
		console.log(err);
		return err
	});
}