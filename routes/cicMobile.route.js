var express = require('express');
var router = express.Router();

const cicMacr_Controller = require('../controllers/cicMacr.controller');

//TODO
router.post('/cicMacrRQST', cicMacr_Controller.cicMACRRQST);
router.post('/cicMacrRSLT', cicMacr_Controller.cicMACRRSLT);

module.exports = router;