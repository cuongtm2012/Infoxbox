var express = require('express');
var router = express.Router();
var verifyToken = require('../util/verifyToken');


var customer_router = require('../controllers/customer.controller');

router.get('/getCustInfo',  verifyToken , customer_router.getCustInfo);
router.post('/addCust',  verifyToken ,customer_router.addCust);
router.put('/editCust', verifyToken , customer_router.editCust);
module.exports = router;

