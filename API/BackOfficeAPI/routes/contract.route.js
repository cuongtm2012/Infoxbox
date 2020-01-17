var express = require('express');
var router = express.Router();
// var verifyToken = require('../shared/auth/verifyToken');


var contract_route = require('../controllers/contract.controller');

router.get('/getProduct',  contract_route.getProduct);
router.get('/getContract',  contract_route.getContract);
router.post('/insertContract',  contract_route.insertContract);
router.put('/updateContract',  contract_route.updateContract);
module.exports = router;