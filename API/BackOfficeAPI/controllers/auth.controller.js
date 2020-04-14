const oracledb = require('oracledb');
const authService = require('../services/auth.service');
const oracelService = require('../services/oracelQuery.service');
const IUser = require('../domain/IUser');
const validation = require('../../shared/util/validation');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var salt = bcrypt.genSaltSync(saltRounds);
const config = require('../config/config')
var emailExistence = require('email-existence');
var nodemailer = require('nodemailer');
const optionFormatObj = {
    outFormat: oracledb.OUT_FORMAT_OBJECT
};
const optionAutoCommit = {
    autoCommit: true
};
const mailHost = 'smtp.gmail.com';
const mailPort = 465;
exports.login = function (req, res) {
    try {
        var jwt = require('jsonwebtoken');
        var userid = req.body.username;
        var user_pwd = req.body.password;

        var payload = {
            userid: userid,
        };

        authService.getUser(req, res).then(reslt => {
            console.log("result getUser: ", reslt);

            if (!validation.isEmptyStr(reslt)) {
                var token = jwt.sign(payload, config.secret, {
                    expiresIn: config.jwtExpiresIn
                });

                var resdata = reslt[0];
                console.log("OK password");
                var userData = new IUser(resdata, true, token);

                return res.status(200).json(userData);

            } else {
                var userData = new IUser({});
                return res.status(400).json(userData);
            }
        });
    } catch (error) {
        console.log(error);
    }
};

