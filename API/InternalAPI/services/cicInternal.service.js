
const oracledb = require('oracledb');
const dbconfig = require('../config/dbconfig');

async function select(req, res, next) {
    try {
        let sql, binds, options, result;

        connection = await oracledb.getConnection(dbconfig);

        sql = `SELECT *
        FROM TB_CIC_B0001
        WHERE process_status in('0', '1') and 3 > try_count and ROWNUM <= 20
        ORDER BY APP_CODE ASC`;
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

        console.log("rows::", result.rows);

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

async function updateProcess(req, res, next) {
    try {
        let sql, binds, options, result;

        connection = await oracledb.getConnection(dbconfig);

        sql = `UPDATE TB_CIC_B0001
                SET process_status = '1'
                WHERE app_code =:app_code `;
        // where CUS_ID = :CUS_ID`;

        result = await connection.execute(
            // The statement to execute
            sql,
            [req.appCd],
            { autoCommit: true }
        );

        console.log("rows updated::", result.rowsAffected);

        return result.rowsAffected;
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

async function updateComplete(req, res, next) {
    try {
        let sql, binds, options, result;

        connection = await oracledb.getConnection(dbconfig);


        sql = `UPDATE TB_CIC_B0001
                SET process_status = '9'
                WHERE app_code =:app_code `;
        // where CUS_ID = :CUS_ID`;

        result = await connection.execute(
            // The statement to execute
            sql,
            [req.appCd],
            { autoCommit: true },
        );

        console.log("rows updated::", result.rowsAffected);

        return result.rowsAffected;
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

async function updateTryCount(req, res, next) {
    try {
        let sql, binds, options, result;

        connection = await oracledb.getConnection(dbconfig);

        sql = `UPDATE TB_CIC_B0001
                SET try_count = try_count + 1
                WHERE app_code =:app_code`;

        result = await connection.execute(
            // The statement to execute
            sql,
            [req.appCd],
            { autoCommit: true }
        );

        console.log("rows updated::", result.rowsAffected);

        return result.rowsAffected;
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
module.exports.updateProcess = updateProcess;
module.exports.updateComplete = updateComplete;
module.exports.updateTryCount = updateTryCount;