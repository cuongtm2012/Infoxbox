const oracledb = require('oracledb');
const dbconfig = require('../config/dbconfig');

const bcrypt = require('bcrypt');
const saltRounds = 12;
var salt = bcrypt.genSaltSync(saltRounds);
const config = require('../config/config')

async function getUser(req, res, next) {
    try {
        let sql, binds, options, result;

        var user_pwd = req.body.password;

        connection = await oracledb.getConnection(dbconfig);

        sql = `SELECT  * 
                FROM TB_USER
                where USER_NAME = :user_name`;

        result = await connection.execute(
            // The statement to execute
            sql,
            {
                user_name: { val: req.body.username }
            },
            {
                // maxRows: 1,
                outFormat: oracledb.OUT_FORMAT_OBJECT  // query result format
                //, extendedMetaData: true                 // get extra metadata
                //, fetchArraySize: 100                    // internal buffer allocation size for tuning
            });

        console.log("rows::", result.rows);

        if (bcrypt.compareSync(user_pwd, result.rows[0].PASSWORD)) {
            console.log("OK password");

            return result.rows;
        } else {
            return;
        }
        // return res.status(200).json(result.rows);


    } catch (err) {
        console.log(err);
        // return res.status(400);
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                console.log(error);
            }
        }
    }
}

module.exports.getUser = getUser;