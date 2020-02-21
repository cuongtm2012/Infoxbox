var express = require('express');
var router = express.Router();
var verifyToken = require('../util/verifyToken');


var code_route = require('../controllers/code.controller');

router.get('/getCodeClassification', verifyToken ,  code_route.getCodeClassification);
router.get('/getCode', verifyToken ,  code_route.getCode);
router.post('/insertCode', verifyToken ,  code_route.insertCode);
router.put('/editCode',  verifyToken , code_route.editCode);

module.exports = router;
