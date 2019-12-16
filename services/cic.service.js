
const oracledb = require('oracledb');
const dbconfig = require('../config/dbconfig');

async function select(req, res, next) {
    try {
        let sql, binds, options, result;

        connection = await oracledb.getConnection(dbconfig);

        sql = `SELECT *
        FROM TB_CIC_B0001`;
        // where CUS_ID = :CUS_ID`;

        result = await connection.execute(
            // The statement to execute
            sql,
            {},
            // [1],
            // The "bind value" 3 for the bind variable ":idbv"
            // Options argument.  Since the query only returns one
            // row, we can optimize memory usage by reducing the default
            // maxRows value.  For the complete list of other options see
            // the documentation.
            {
                // maxRows: 1,
                outFormat: oracledb.OUT_FORMAT_OBJECT  // query result format
                //, extendedMetaData: true                 // get extra metadata
                //, fetchArraySize: 100                    // internal buffer allocation size for tuning
            });

        console.log("row::", result.rows[0]);
        
        return result.rows;
        // return res.status(200).json(result.rows);


    } catch (err) {
        console.log(err);
        return res.status(400);
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

module.exports.select = select;