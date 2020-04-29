var express = require('express');
var router = express.Router();
var verifyToken = require('../util/verifyToken');
var verifyAdmin = require('../util/verifyAdmin');

var contract_route = require('../controllers/contract.controller');

router.get('/getProduct', verifyToken , contract_route.getProduct);
router.get('/getContract',  verifyToken, contract_route.getContract );
router.post('/insertContract', verifyAdmin ,  contract_route.insertContract );
router.put('/updateContract',  verifyAdmin , contract_route.updateContract );
module.exports = router;
