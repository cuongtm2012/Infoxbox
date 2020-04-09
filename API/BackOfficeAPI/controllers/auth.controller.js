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
    var userName = req.body.username;
    var custCd = req.body.custCd;
    // var password = req.body.password;
    var password = "nice1234";
    var userClass = req.body.typeUser;
    var email = req.body.email;
    var finalOperaDate = req.body.systemDate ? req.body.systemDate : '';
    var validStartDT = req.body.validStartDT ? req.body.validStartDT : '';
    var validEndDT = req.body.validEndDT ? req.body.validEndDT : '';
    var phone = req.body.phone ? req.body.phone : '';
    var address = req.body.address ? req.body.address : '';
    var workID = req.body.workID ? req.body.workID : '';
    var role = req.body.role;
    var active = req.body.active;
    let params = {
        user_id: {val: null},
        user_name: {val: userName},
        custCd: {val: custCd},
        password: {val: bcrypt.hashSync(password, saltRounds)},
        typeUser: {val: userClass},
        email: {val: email},
        systemDate: {val: finalOperaDate},
        validStartDT: {val: validStartDT},
        validEndDT: {val: validEndDT},
        phone: {val: phone},
        address: {val: address},
        workID: {val: workID},
        active: {val: active}
    };
    let sqlCheckUser = `SELECT  * FROM TB_ITUSER WHERE USER_NM = :user_name`;
    let paramsCheckUserName = {user_name: {val: userName}};
    let isExit = await oracelService.checkIsExistUserName(res, sqlCheckUser, paramsCheckUserName, optionFormatObj);
    if (isExit[0]) {
        return res.status(500).send({message: "User Name [" + userName + "] has been used!"});
    } else {
        let sql_insert = `INSERT INTO TB_ITUSER (USER_ID , USER_NM, CUST_CD, INOUT_GB,  USER_PW , VALID_START_DT , VALID_END_DT, TEL_NO_MOBILE , ADDR , WORK_ID  , EMAIL, SYS_DTIM , ACTIVE)
         VALUES (:user_id, :user_name, :custCd, :typeUser, :password, :validStartDT, :validEndDT , :phone, :address , :workID , :email , :systemDate ,:active)`;
        let createAffect = await oracelService.createUser(res, sql_insert, params, optionAutoCommit);
        console.log(createAffect);
        if (createAffect.rowsAffected === 1) {
            let sql_select = `SELECT USER_ID FROM TB_ITUSER WHERE USER_NM = :username `;
            let paramSelect = {
                username: userName
            };
            let userId = await oracelService.getUserByUserName(res, sql_select, paramSelect, optionFormatObj);
            console.log(userId[0].USER_ID);
            if (userId[0].USER_ID) {
                let sql_setRole = `INSERT INTO TB_ADMIN (USER_ID , ROLE_ID) VALUES (:user_id , :roleId) `;
                let paramSetRole = {
                    user_id: userId[0].USER_ID,
                    roleId: role
                };
                await oracelService.setRole(res, sql_setRole , paramSetRole , optionAutoCommit);
            } else {
                return res.status(500).send({message: "Error when set Role!"});
            }
        } else {
            return res.status(500).send({message: "Error when save user!"});
        }
    }
};


// exports.sendEmail = async function (req, res) {
//     var userName = req.body.username;
//     var email = req.body.email;
//     let sqlCheckUser = `SELECT  * FROM TB_ITUSER WHERE USER_NM = :user_name`;
//     let params = { user_name: { val: userName } };
//     let isExit = await oracelService.checkIsExistUserName(res, sqlCheckUser, params, optionFormatObj);
//     if(isExit[0]) {
//         return res.status(500).send({message: 'User Name ' +  userName + 'has been used!'});
//     } else {
//         var pincode = Math.floor(100000 + Math.random() * 900000);
//         var smtpTransport = nodemailer.createTransport({
//             host: mailHost,
//             port: mailPort,
//             secure: true,
//             auth: {
//
//                 user: config.email.user,
//                 pass: config.email.password
//             }
//         });
//
//         mailOptions = {
//             from: config.email.user,
//             to: email,
//             subject: config.email.header,
//             html: config.email.body.replace('$userName', userName).replace('$pincode', pincode)
//         };
//         await smtpTransport.sendMail(mailOptions, function (error, response) {
//             if (error) {
//                 res.status(500).send({message: error})
//             } else {
//                 console.log("Message sent: ");
//                 res.status(200).send({message: 'Mail sent to ' + email, PinCode: pincode});
//             }
//         });
//     }
// };
//
// exports.getCodeEmail = function (req, res) {
//     var email = req.body.email;
//     redisApi.get(redisApi.PINCODE_PREFIX + email, function (err, reply) {
//         console.log(reply);
//         if (err) {
//             res.status(404).send(err);
//             return;
//         }
//         if (validation.isEmptyStr(reply)) {
//             res.status(404).send('');
//         } else {
//             res.status(200).send(reply);
//         }
//     });
// };

