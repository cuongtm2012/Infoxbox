var express = require('express');
var router = express.Router();
var verifyToken = require('../util/verifyToken');
var verifyAdmin = require('../util/verifyAdmin');


var customer_router = require('../controllers/customer.controller');

router.post('/getCustInfo',  verifyToken , customer_router.getCustInfo);
router.post('/addCust',  verifyAdmin ,customer_router.addCust);
router.put('/editCust', verifyAdmin, customer_router.editCust);
module.exports = router;

