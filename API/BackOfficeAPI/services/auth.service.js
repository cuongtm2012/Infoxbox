const oracledb = require('oracledb');
const dbconfig = require('../../shared/config/dbconfig');

const bcrypt = require('bcrypt');
const saltRounds = 12;
var salt = bcrypt.genSaltSync(saltRounds);
const config = require('../config/config')

async function getUser(req) {
    let connection;
    try {
        let sql, result;

        var user_pwd = req.body.password;

        connection = await oracledb.getConnection(dbconfig);

        sql = `SELECT  * 
                FROM TB_ITUSER
                where USER_NM = :user_name AND ACTIVE = '1' `;

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
            console.log(bcrypt.hashSync(user_pwd, salt));
            
        if (bcrypt.compareSync(user_pwd, result.rows[0].USER_PW)) {
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
