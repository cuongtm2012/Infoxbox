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
        var userID = req.body.userID;
        var user_pwd = req.body.password;

        var payload = {
            userID: userID,
        };

        authService.getUser(req, res).then(reslt => {
            console.log("result getUser: ", reslt);

            if (!validation.isEmptyStr(reslt)) {
                var token = jwt.sign(payload, config.secret, {
                    expiresIn: config.jwtExpiresIn
                });

                let resdata = reslt[0];
                if (resdata.ACTIVE === 1) {
                    if (user_pwd == 'nice1234') {
                        return res.status(202).json({status: 202 , token: token});
                    } else {
                        let userData = new IUser(resdata, true, token);
                        return res.status(200).json(userData);
                    }
                } else {
                    return res.status(403).send({message: 'Your account not active by Admin. Please contact Admin to solve problems!'});
                }

            } else {
                let userData = new IUser({});
                return res.status(400).json(userData);
            }
        });
    } catch (error) {
        console.log(error);
    }
};

