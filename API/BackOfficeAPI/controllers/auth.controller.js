
const logger = require('../config/logger');
const oracledb = require('oracledb');
const dbconfig = require('../config/dbconfig');
const authService = require('../services/auth.service');
const IUser = require('../domain/IUser');
const validation = require('../../shared/util/validation');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var salt = bcrypt.genSaltSync(saltRounds);
const config = require('../config/config')

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
                console.log("OK password~~~");
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
            connection = await oracledb.getConnection(dbconfig);
            sqlRegister = `INSERT INTO TB_USER VALUES (:user_name, :password, :email, :fullname)`;
            result = await connection.execute(sqlRegister, {
                user_name: { val: req.body.username }, password: { val: bcrypt.hashSync(req.body.password, saltRounds) },
                email: { val: req.body.email }, fullname: { val: req.body.fullname }
            },
                { autoCommit: true }
            );
            res.send({msg: result.rowsAffected});
        }
    } catch (error) {
        console.log(error);
    }
};

