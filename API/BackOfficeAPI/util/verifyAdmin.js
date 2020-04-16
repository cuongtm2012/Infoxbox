const oracledb = require('oracledb');
var bcrypt = require('bcrypt');
const oracelService = require('../services/oracelQuery.service');
var _ = require('lodash');
const optionFormatObj = { outFormat: oracledb.OUT_FORMAT_OBJECT };
const optionAutoCommit = { autoCommit: true };
const IUser = require('../domain/user.response');
var jwt = require('jsonwebtoken');
var config = require('../config/config');

async function verifyAdmin(req, res, next) {
    var userId = req.headers['userid'];
    var userName = req.headers['username'];
    var token = req.headers['token'];
    if (!token) {
        return res.status(403).send({
            auth: false,
            message: 'No token provided'
        });
    } else {
        if (token.startsWith('Bearer ')) {
            token = token.substring(7, token.length);
        }
    }
    jwt.verify(token, config.secret, function (err, decoded) {
        if (err)
            return res.status(500).send({
                auth: false,
                message: 'Failed to authenticate token.'
            });

    });
    if (!userId && !userName) {
        return res.status(403).send({
            auth: false,
            message: 'No UserId and User Name provided'
        });
    } else {
        let sqlGetAccount = `SELECT * FROM TB_ITUSER WHERE USER_ID=:userId AND USER_NM=:userName`;
        let paramGetAccount = {
            userName,
            userId
        };
        let result = await oracelService.getUserByUserNameAndUserID(res, sqlGetAccount, paramGetAccount, optionFormatObj);
        if(result[0]) {
            if (result[0].ROLE_ID == 2 && result[0].ACTIVE == 1) {
                next();
            } else {
                return res.status(403).send({message: 'Fail'});
            }
        } else {
            return res.status(403).send({message: 'Fail'});
        }
    }
}


module.exports = verifyAdmin;
