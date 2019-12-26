
const oracledb = require('oracledb');
const dbconfig = require('../config/dbconfig');

async function getSequence() {
    try {
        let sql, binds, options, result;

        connection = await oracledb.getConnection(dbconfig);

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