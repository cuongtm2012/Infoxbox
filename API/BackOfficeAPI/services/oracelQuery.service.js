const oracledb = require('oracledb');
const dbconfig = require('../../shared/config/dbconfig');

async function queryOracel(res, sql, param, option) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbconfig);
        result = await connection.execute(
            sql, param, option);
        res.status(200).send(result.rows);
        return result.rows;
    } catch (err) {
        console.log(err);
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

module.exports.queryOracel = queryOracel;