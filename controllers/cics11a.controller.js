
var cics11aModelRes = require('../domain/cics11a.response');

const { body } = require('express-validator/check');
const Cics11aModelReq = require('../domain/customer.request');

const db = require('../config/db.config.js');

const { validationResult } = require('express-validator/check');

const request = require('request');

const Customer = db.customers;

const logger = require('../shared/logs/logger');

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
			age: req.body.age
		};

		const getdataReq = new Cics11aModelReq(requestData);
		JSON.stringify(getdataReq);

		//Logging request
		logger.debug('Log request parameters from routes after manage request');
		logger.info(getdataReq);

		request.post({
			uri: 'http://localhost:3000/cic/customers/create',
			// {
			body: getdataReq,
			json: true
			// },
		}, function (error, res1, body) {
			if (error) {
				console.error(error)
				return
			}
			console.log(`statusCode: ${res1.statusCode}`)
			console.log("body:", body)
			logger.debug('LogPost from routes after manage request');
			logger.debug(body);
			//  using Sequelize
			Customer.findAll(
				{ attributes: { exclude: [] } }
			)
				.then(customer => {
					if (!customer) {
						return res.status(404).json({ message: "Customer Not Found" })
					}
					var data = new cics11aModelRes(body, body);
					console.log("log data output")
					console.log(data)
					logger.debug('LogFindAl; from routes after manage request');
					logger.debug(data);
					return res.status(200).json(customer)
				}
				)
				.catch(error => res.status(400).send(error));

			// var QUERY_INSERT = 'INSERT INTO scrap.TB_ITCUST(CUST_GB, CUST_CD, WORK_ID)';
			// var QUERY_VALUE = ' VALUES(?, ?, ?)';

			// const workId = body.cusAge;
			// const custGB = body.cusAge;
			// const custCD = body.cusName;

			// req.getConnection(function (error, conn) {
			// 	if (!conn) {
			// 		res.status(404).send();
			// 		return;
			// 	}
			// 	conn.query(QUERY_INSERT + QUERY_VALUE, [custGB, custCD, workId], function (err, rows) {
			// 		if (err || validation.isEmptyJson(rows)) {
			// 			console.log(err);
			// 			res.status(404).json({
			// 				'msg': err
			// 			});
			// 		} else {
			// 			// console.log("OK", { code: rows[0].CUST_CD, db: rows[0].CUST_GB, name: rows[0].CUST_NM });
			// 			var data = new cics11aModelRes(body, body);
			// 			console.log("log data output")
			// 			console.log(data)
			// 			res.status(200).send(data);
			// 			// res.status(200).json ({
			// 			// 	'result': new cics11aModelRes(body, body)
			// 			// });

			// 		}
			// 	});
			// });
		});


	} catch (err) {
		return next(err)
	}
};

