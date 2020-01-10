
const oracledb = require('oracledb');
const dbconfig = require('../config/dbconfig');
const authService = require('../services/auth.service');
const IUser = require('../domain/IUser');
const validation = require('../../shared/util/validation');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var salt = bcrypt.genSaltSync(saltRounds);
const config = require('../config/config')
var emailExistence = require('email-existence');
var nodemailer = require('nodemailer');
var redisApi = require('./../redis/redisApi');
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

exports.checkemail = async function (req, res) {
    let connection;

    try {
        connection = await oracledb.getConnection(dbconfig);
        sqlCheckUser = `SELECT  * FROM TB_USER where USER_NAME = :user_name`;
        result = await connection.execute(sqlCheckUser, { user_name: { val: req.body.username } },
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            });
        if (result.rows.length >= 1) {
            res.send({ msg: 0 });
        } else {
            emailExistence.check(req.body.email, async function (error, response) {
                console.log('res: ' + response);
                if (response === true) {
                    connection = await oracledb.getConnection(dbconfig);
                    sqlRegister = `INSERT INTO TB_USER VALUES (:user_name, :password, :email, :fullname)`;
                    result = await connection.execute(sqlRegister, {
                        user_name: { val: req.body.username }, password: { val: bcrypt.hashSync(req.body.password, saltRounds) },
                        email: { val: req.body.email }, fullname: { val: req.body.fullname }
                    },
                        { autoCommit: true }
                    );
                    res.send({ msg: result.rowsAffected });
                } else {
                    res.send({ msg: 2 })
                }
            });
        }
    } catch (error) {
        console.log(error);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.log(error);
            }
        }
    }
};

exports.sendEmail = function (req, res) {
    var userName = req.body.username;
    var pincode = Math.floor(100000 + Math.random() * 900000);
    var smtpTransport = nodemailer.createTransport({
        service: config.email.service,
        auth: {
            user: config.email.user,
            pass: config.email.password
        }
    });

    mailOptions = {
        to: req.body.email,
        subject: config.email.header,
        html: config.email.body.replace('$userName', userName).replace('$pincode', pincode)
    }
    console.log(mailOptions);

    redisApi.set(redisApi.PINCODE_PREFIX + req.body.email, pincode, function (err, reply) {
        if (err) {
            console.log('Store pincode error : ' + err);
        } else {
            smtpTransport.sendMail(mailOptions, function (error, response) {
                if (error) {
                    console.log(error);
                } else {
                    console.log("Message sent: ");
                    res.status(200).send({ msg: 'ok' });
                }
            });
            console.log('Store pincode : ' + reply);
        }
    });
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

