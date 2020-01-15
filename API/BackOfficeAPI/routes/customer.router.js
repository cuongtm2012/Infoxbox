var express = require('express');
var router = express.Router();
// var verifyToken = require('../shared/auth/verifyToken');


var customer_router = require('../controllers/customer.controller');

router.get('/getOrganizationName',  customer_router.getOrganizationName);

module.exports = router;

