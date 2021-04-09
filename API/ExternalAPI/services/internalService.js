
const oracledb = require('oracledb');
const config = require('../config/config');
const _ = require('lodash');
const database = require('../config/db.config');
async function updateScrpStatCdErrorResponseCodeScraping(niceSessionKey, code, niceCode) {
    let connection;

    try {
        let sql, result;
		database.initialize().then();
        connection = await oracledb.getConnection(config.poolAlias);


        sql = `UPDATE TB_SCRPLOG
                SET SCRP_STAT_CD  = :SCRP_STAT_CD, RSP_CD = :RSP_CD
                WHERE NICE_SSIN_ID = :NICE_SSIN_ID`;

        result = await connection.execute(
            // The statement to execute
            sql,
            {
                NICE_SSIN_ID: { val: niceSessionKey },
                SCRP_STAT_CD: { val: code },
                RSP_CD: { val: niceCode }
            },
            { autoCommit: true },
        );

        console.log("updateScrpStatCdErrorResponseCodeScraping updated::", result.rowsAffected);

        return result.rowsAffected;
    } catch (err) {
        console.log(err);
        // return res.status(400);
    } finally {
        if (connection) {
            try {
				console.log("updateScrpStatCdErrorResponseCodeScraping: connection.close 1");
				console.log(database.poolInfoFnc());
                await connection.close();
				console.log("updateScrpStatCdErrorResponseCodeScraping: connection.close 2");
				console.log(database.poolInfoFnc());
            } catch (error) {
				console.log("updateScrpStatCdErrorResponseCodeScraping: connection.close error");
                console.log(error);
            }
        }
    }
}


module.exports.updateScrpStatCdErrorResponseCodeScraping = updateScrpStatCdErrorResponseCodeScraping;