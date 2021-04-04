
const oracledb = require('oracledb');
const dbconfig = require('../../shared/config/dbconfig');
const config = require('../config/config');
async function getSequence() {
    let connection;

    try {
        let sql, result;

        connection = await oracledb.getConnection(config.poolAlias);

        sql = `SELECT SUBSTR(concat('0000', to_char(SEQ_INQLOG.nextval)), -5) as seq  FROM dual`;
        // where CUS_ID = :CUS_ID`;

        result = await connection.execute(
            // The statement to execute
            sql,
            {},
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


module.exports.getSequence = getSequence;