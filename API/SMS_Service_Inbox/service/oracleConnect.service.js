const oracledb = require('oracledb');
const dbconfig = require('../../shared/config/dbconfig');
const logger = require('../config/logger');

async function queryOracel(sql, param, option) {
    let connection;
    try {
        connection = await oracledb.getConnection(dbconfig);
        let result = await connection.execute(
            sql, param, option);
            if(result.rows !== undefined){
               if (result.rows[0]) {
                logger.info(result);
               }
                return result.rows;
            }
            return result;
    } catch (err) {
        logger.error(err);
        return err;
    } finally {
        if (connection) {
            try {
                await connection.close();
            } catch (error) {
                return error;
            }
        }
    }
}

module.exports = queryOracel;
