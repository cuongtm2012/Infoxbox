
import oracledb from 'oracledb';
import config from '../config/config.js';

import _ from 'lodash';
async function updateScrpStatCdErrorResponseCodeScraping(niceSessionKey, code, niceCode) {
    let connection;

    try {
        let sql, result;

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
                await connection.close();
            } catch (error) {
                console.log(error);
            }
        }
    }
}
export {updateScrpStatCdErrorResponseCodeScraping}
