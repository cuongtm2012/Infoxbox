var express = require('express');
var router = express.Router();

var user_controller = require('../controllers/usersController');
router.get('/isID', user_controller.isID);
module.exports = router;
