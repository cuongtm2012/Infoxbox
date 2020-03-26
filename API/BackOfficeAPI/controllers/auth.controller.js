
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
var redisApi = require('./../redis/redisApi');
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
            user_pwd: user_pwd
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

exports.register = async function (req, res) {
    var username = req.body.username;
    var custCd = req.body.custCd;
    var password = req.body.password;
    var typeUser = req.body.typeUser;
    var startDate = req.body.startDate;
    var endDate = req.body.endDate;
    var mobileUser = req.body.mobileUser;
    var email = req.body.email;
    var addressUser = req.body.addressUser;
    var systemDate = req.body.systemDate;
    var workId = req.body.workId;
    
    let params = {
        user_id: { val: null },
        user_name: { val: username },
        custCd: { val: custCd },
        password: { val: bcrypt.hashSync(password, saltRounds) },
        typeUser: { val: typeUser },
        startDate: { val: startDate },
        endDate: { val: endDate },
        mobileUser: { val: mobileUser },
        email: { val: email },
        addressUser: { val: addressUser },
        systemDate: { val: systemDate },
        workId: { val: workId }
    };
    let sql = `INSERT INTO TB_ITUSER (USER_ID , USER_NM, CUST_CD, INOUT_GB, USER_PW, VALID_START_DT, VALID_END_DT, TEL_NO_MOBILE, ADDR, EMAIL, SYS_DTIM, WORK_ID) VALUES (:user_id, :user_name, :custCd, :typeUser, :password, :startDate, :endDate, :mobileUser, :addressUser,:email , :systemDate, :workId)`;
    oracelService.queryOracel(res, sql, params, optionAutoCommit);
};


exports.sendEmail = async function (req, res) {
    var userName = req.body.username;
    var email = req.body.email;
    let sqlCheckUser = `SELECT  * FROM TB_ITUSER WHERE USER_NM = :user_name`;
    let params = { user_name: { val: userName } };
    let isExit = await oracelService.checkIsExistUserName(res, sqlCheckUser, params, optionFormatObj);
    if(isExit[0]) {
        return res.status(500).send({message: 'User Name has been used!'});
    } else {
        var pincode = Math.floor(100000 + Math.random() * 900000);
        var smtpTransport = nodemailer.createTransport({
            host: mailHost,
            port: mailPort,
            secure: true,
            auth: {

                user: config.email.user,
                pass: config.email.password
            }
        });

        mailOptions = {
            from: config.email.user,
            to: email,
            subject: config.email.header,
            html: config.email.body.replace('$userName', userName).replace('$pincode', pincode)
        };
        await smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                res.status(500).send({message: error})
            } else {
                console.log("Message sent: ");
                res.status(200).send({message: 'Mail sent to ' + email, PinCode: pincode});
            }
        });
    }
};

exports.getCodeEmail = function (req, res) {
    var email = req.body.email;
    redisApi.get(redisApi.PINCODE_PREFIX + email, function (err, reply) {
        console.log(reply);
        if (err) {
            res.status(404).send(err);
            return;
        }
        if (validation.isEmptyStr(reply)) {
            res.status(404).send('');
        } else {
            res.status(200).send(reply);
        }
    });
};

