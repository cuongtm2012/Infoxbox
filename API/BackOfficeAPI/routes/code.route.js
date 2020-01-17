var express = require('express');
var router = express.Router();
// var verifyToken = require('../shared/auth/verifyToken');


var code_route = require('../controllers/code.controller');

router.get('/getCode',  code_route.getCode);
router.post('/insertCode',  code_route.insertCode);
router.put('/editCode',  code_route.editCode);

module.exports = router;