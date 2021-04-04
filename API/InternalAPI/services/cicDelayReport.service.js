const oracledb = require('oracledb');
const config = require('../config/config');

const dateUtil = require('../util/dateutil');
const _ = require('lodash');
const responseCode = require('../../shared/constant/responseCodeExternal');

/*
    B0003 : CIC보고서 조회 (Inquiry for CIC Delay Report)
*/
async function selectDeplayReport() {
    let connection;

    try {
        let sql, result;

        connection = await oracledb.getConnection(config.poolAlias);

        sql = `SELECT a.nice_ssin_id as niceSessionKey, b.S_CIC_NO as cicId, a.inq_dtim, a.login_id, a.login_pw, a.sys_dtim
        FROM TB_SCRPLOG a inner join tb_scrp_trlog b on a.nice_ssin_id = b.nice_ssin_id
        WHERE a.SCRP_STAT_CD = :SCRP_STAT_CD
            and a.SCRP_MOD_CD in ('00', '02') 
            and b.S_SVC_CD = 'B0002'
            and ROWNUM <= 20
        ORDER BY a.SYS_DTIM ASC`;
        result = await connection.execute(
            sql,
            {
                SCRP_STAT_CD: { val: responseCode.SCRAPPINGERRORCODE.CICReportInqDelay.code }
            },
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT  // query result format
            });
        if (result.rows[0]) {
            console.log("rows delay report:", result.rows);
        }

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

/*
    B0003 : CIC보고서 조회 (Inquiry for CIC Delay Report) 30 minutes
*/
async function selectDeplayReport2() {
    let connection;

    try {
        let sql, result;

        connection = await oracledb.getConnection(config.poolAlias);

        sql = `SELECT a.nice_ssin_id as niceSessionKey, b.S_CIC_NO as cicId, a.inq_dtim, a.login_id, a.login_pw, a.sys_dtim
        FROM TB_SCRPLOG a inner join tb_scrp_trlog b on a.nice_ssin_id = b.nice_ssin_id
        WHERE a.SCRP_STAT_CD = :SCRP_STAT_CD
            and a.SCRP_MOD_CD in ('03') 
            and b.S_SVC_CD = 'B0002'
            and ROWNUM <= 20
        ORDER BY a.SYS_DTIM ASC`;
        result = await connection.execute(
            sql,
            {
                SCRP_STAT_CD: { val: responseCode.SCRAPPINGERRORCODE.CICReportInqDelay.code }
            },
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT  // query result format
            });
        if (result.rows[0]) {
            console.log("rows delay report2:", result.rows);
        }
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

/*
    B0003 : CIC보고서 조회 (Update SCRP_MOD_CD = 03 )
*/
async function updateScrpModCd03(niceSesKey) {
    let connection;

    try {
        let sql, result;
        connection = await oracledb.getConnection(config.poolAlias);


        sql = `UPDATE TB_SCRPLOG
                SET SCRP_MOD_CD  = :SCRP_MOD_CD
                WHERE NICE_SSIN_ID = :NICE_SSIN_ID`;

        result = await connection.execute(
            // The statement to execute
            sql,
            {
                SCRP_MOD_CD: { val: responseCode.StatusCodeBatchProcess.CICReportInquiryDelay3 },
                NICE_SSIN_ID: { val: niceSesKey }
            },
            { autoCommit: true },
        );


        console.log("update ScrpModCd 03 updated::", result.rowsAffected);

        return result.rowsAffected;
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

/*
    * delay report
    *update statu == 05 
    *
*/
async function updateDelayReportS11A(niceSessionKey) {
    let connection;
    try {
        let sql, result;

        connection = await oracledb.getConnection(config.poolAlias);

        sql = `UPDATE TB_SCRPLOG
                SET SCRP_STAT_CD = :SCRP_STAT_CD, RSP_CD = :RSP_CD, SCRP_MOD_CD = :SCRP_MOD_CD 
                WHERE NICE_SSIN_ID =:niceSessionKey`;

        result = await connection.execute(
            // The statement to execute
            sql,
            {
                SCRP_STAT_CD: { val: responseCode.SCRAPPINGERRORCODE.CICReportInqDelay.code },
                RSP_CD: { val: responseCode.RESCODEEXT.INPROCESS.code },
                SCRP_MOD_CD: { val: responseCode.StatusCodeBatchProcess.CICReportInquiryDelay },
                niceSessionKey: { val: niceSessionKey }
            },
            { autoCommit: true }
        );

        console.log("updateDelayReportS11A updated:", result.rowsAffected);

        return result.rowsAffected;

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

module.exports.updateDelayReportS11A = updateDelayReportS11A;
module.exports.selectDeplayReport = selectDeplayReport;
module.exports.selectDeplayReport2 = selectDeplayReport2;
module.exports.updateScrpModCd03 = updateScrpModCd03;
