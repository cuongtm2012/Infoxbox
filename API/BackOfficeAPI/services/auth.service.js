const oracledb = require('oracledb');
const dbconfig = require('../config/dbconfig');

async function getUser(req, res, next) {
    try {
        let sql, binds, options, result;

        connection = await oracledb.getConnection(dbconfig);

        sql = `SELECT  * 
                FROM TB_USER
                where USER_NAME = :user_name and PASSWORD = :user_password`;

        result = await connection.execute(
            // The statement to execute
            sql,
            {
                user_name: { val: req.body.username },
                user_password: { val: req.body.password }
            },
            {
                // maxRows: 1,
                outFormat: oracledb.OUT_FORMAT_OBJECT  // query result format
                //, extendedMetaData: true                 // get extra metadata
                //, fetchArraySize: 100                    // internal buffer allocation size for tuning
            });

        console.log("rows::", result.rows);

        return result.rows;
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