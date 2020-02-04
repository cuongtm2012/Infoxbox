var express = require('express');
var router = express.Router();
// var verifyToken = require('../shared/auth/verifyToken');
var user_router = require('../controllers/user.controller');

router.get('/getUserInfo',  user_router.getUserInfo);
router.post('/createUser',  user_router.createUser);
router.put('/updateUser', user_router.updateUser);
router.put('/resetPassword', user_router.resetPassword);

module.exports = router;
