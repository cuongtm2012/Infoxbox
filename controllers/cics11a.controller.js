
var cics11aModelRes = require('../domain/cics11a.response');

const { body } = require('express-validator/check');
const Cics11aModelReq = require('../domain/customer.request');

const db = require('../config/db.config.js');

const { validationResult } = require('express-validator/check');

const request = require('request');

const Customer = db.customers;

const logger = require('../shared/logs/logger');

const axios = require('axios');

const URI = require('../shared/URI');

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
			name: req.body.nameReq,
			age: req.body.age,
			add: req.body.address
		};

		const getdataReq = new Cics11aModelReq(requestData);
		JSON.stringify(getdataReq);

		//Logging request
		logger.debug('Log request parameters from routes after manage request');
		logger.info(req.body);

		axios.post(URI.createCustomer, getdataReq)
			.then((body) => {
				console.log("body data:", body.data)
				logger.debug('LogPost from routes after manage request');
				logger.debug(body.data);
				//  using Sequelize
				Customer.findAll(
					{ attributes: { exclude: [] } }
				)
					.then(customer => {
						if (!customer) {
							return res.status(404).json({ message: "Customer Not Found" })
						}
						var data = new cics11aModelRes(body.data, body.data);
						console.log("log data output")
						console.log(data)
						logger.debug('LogFindAl; from routes after manage request');
						logger.debug(data);
						return res.status(200).json(data)
					})
					.catch(error => res.status(400).send(error));
			}).catch((error) => {
				console.log(error)
			});

	} catch (err) {
		return next(err)
	}
};

