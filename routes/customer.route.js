// module.exports = function (app) {

//     const customerService = require('../services/customer.service.js');
//     const customerController = require('../controllers/customer.comtroller');

//     // Create a new Customer
//     // app.post('/cic/customers/create', customerService.create);

//     // Retrieve all Customer
//     app.get('/cic/customers', customerService.findAll);

//     // Retrieve customer by id
//     app.get('/cic/customerbyId');

//     app.post('/customers/create', customerController.runs);

// }

var express = require('express');
var router = express.Router();

const customerController = require('../controllers/customer.comtroller');

router.post('/customer/create', customerController.runInsert);

router.get('/customer/customers', customerController. runSelectById);

module.exports = router;