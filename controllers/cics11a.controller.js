
var cics11aModelRes = require('../domain/cics11a.response');

const Cics11aModelReq = require('../domain/customer.request');

const db = require('../config/db.config.js');

const { validationResult, body } = require('express-validator/check');

const Customer = db.customers;

const logger = require('../shared/logs/logger');

const axios = require('axios');

const URI = require('../shared/URI');


const customerService = require('../services/customer.service');

exports.validate = (method) => {
	switch (method) {
		case 'cics11a': {
			return [
				body('taxCode', 'taxCode does not exists').exists(),
				body('natId', 'natId does not exists').exists(),
				body('cicId', 'cicId does not exists').exists()
			]
		}
	}
};

exports.cics11a = function (req, res, next) {
	try {

		// Finds the validation errors in this request and wraps them in an object with handy functions
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			res.status(422).json({ errors: errors.array() });
			return;
		}
		var requestData = {
			name: req.body.name,
			age: req.body.age,
			add: req.body.add
		};

		const getdataReq = new Cics11aModelReq(requestData);
		JSON.stringify(getdataReq);

		//Logging request
		logger.debug('Log request parameters from routes after manage request');
		logger.info(req.body);

		axios.post(URI.createCustomer, getdataReq)
			.then((body) => {
				console.log("body data:", body.data)
				//  using oracledb
				customerService.runSelectById(req, res).then(resultFinal => {
					// console.log("resultFinal:::", resultFinal)

					var data = new cics11aModelRes(resultFinal[0], resultFinal[0]);
					console.log("log data output")
					console.log(data)
					logger.debug('LogFindAl; from routes after manage request')
					logger.debug(data)
					return res.status(200).json(data)
				});

			}).catch((error) => {
				console.log(error)
			});

	} catch (err) {
		return next(err)
	}
};

