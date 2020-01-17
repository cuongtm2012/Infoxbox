var express = require('express');
var router = express.Router();
// var verifyToken = require('../shared/auth/verifyToken');


var customer_router = require('../controllers/customer.controller');

router.get('/getCustInfo',  customer_router.getCustInfo);
router.post('/addCust', customer_router.addCust);
router.put('/editCust', customer_router.editCust);
module.exports = router;

