var express = require('express');
var router = express.Router();
var verifyToken = require('../util/verifyToken');
var verifyAdmin = require('../util/verifyAdmin');
var user_router = require('../controllers/user.controller');

router.get('/getUserInfo',  verifyAdmin , user_router.getUserInfo);
router.post('/createUser', verifyAdmin ,  user_router.createUser);
router.put('/updateUser',  verifyAdmin ,user_router.updateUser);
router.put('/resetPassword', verifyAdmin , user_router.resetPassword);
router.put('/changePassword', verifyToken, user_router.changePassword);

module.exports = router;
