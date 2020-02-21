var express = require('express');
var router = express.Router();
var verifyToken = require('../util/verifyToken');
var user_router = require('../controllers/user.controller');

router.get('/getUserInfo',  verifyToken ,  user_router.getUserInfo);
router.post('/createUser', verifyToken ,  user_router.createUser);
router.put('/updateUser',  verifyToken ,user_router.updateUser);
router.put('/resetPassword', verifyToken , user_router.resetPassword);

module.exports = router;
