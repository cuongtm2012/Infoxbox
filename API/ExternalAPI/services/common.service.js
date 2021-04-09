
const oracledb = require('oracledb');
const config = require('../config/config');
const database = require('../config/db.config');
async function getSequence() {
    let connection;

    try {
        let sql, result;
        database.initialize().then();
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
        return result.rows;
        // return res.status(200).json(result.rows);


    } catch (err) {
        console.log(err);
        //throw err;
        // return res.status(400);
    } finally {
        if (connection) {
            try {
                console.log("getSequence: connection.close 1");
                console.log(database.poolInfoFnc());
                await connection.close();
                console.log("getSequence: connection.close 2");
                console.log(database.poolInfoFnc());
            } catch (error) {
                console.log("getSequence: connection.close error");
                console.log(error);
            }
        }
    }
}


module.exports.getSequence = getSequence;
