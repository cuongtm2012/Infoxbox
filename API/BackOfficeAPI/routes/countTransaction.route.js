var express = require('express');
var router = express.Router();
var verifyToken = require('../util/verifyToken');
var verifyAdmin = require('../util/verifyAdmin');

var transaction = require('../controllers/countTransaction.controller');

router.get('/count', transaction.countTransaction);

module.exports = router;