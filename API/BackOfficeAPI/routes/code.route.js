var express = require('express');
var router = express.Router();
var verifyToken = require('../util/verifyToken');
var verifyAdmin = require('../util/verifyAdmin');

var code_route = require('../controllers/code.controller');

router.get('/getCodeClassification', verifyToken ,  code_route.getCodeClassification);
router.post('/getCode', verifyToken ,  code_route.getCode);
router.post('/insertCode', verifyAdmin ,  code_route.insertCode);
router.put('/editCode',  verifyAdmin , code_route.editCode);

module.exports = router;
