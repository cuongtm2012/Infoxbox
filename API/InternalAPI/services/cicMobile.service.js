const oracledb = require('oracledb');
const dbconfig = require('../../shared/config/dbconfig');
const dateutil = require('../util/dateutil');

async function insertMobileReportA0001(req) {
    let connection;

    try {
        let sqlInsertMain, resultMain, sqlInsertMrpt, resultMrpt;

        connection = await oracledb.getConnection(dbconfig);

        // tb_cicrpt_main
        sqlInsertMain = `INSERT INTO TB_CICRPT_MAIN(
                NICE_SSIN_ID,
                PSN_NM,
                BIRTH_YMD,
                CIC_ID,
                PSN_ADDR,
                TEL_NO_MOBILE,
                NATL_ID,
                INQ_DTIM,
                SYS_DTIM) VALUES (
                    :NICE_SSIN_ID,
                    :PSN_NM,
                    :BIRTH_YMD,
                    :CIC_ID,
                    :PSN_ADDR,
                    :TEL_NO_MOBILE,
                    :NATL_ID,
                    :INQ_DTIM,
                    :SYS_DTIM )`;

        resultMain = await connection.execute(
            // The statement to execute
            sqlInsertMain,
            {
                NICE_SSIN_ID: { val: req.niceSessionKey },
                PSN_NM: { val: req.name },
                BIRTH_YMD: { val: req.dateOfBirth },
                CIC_ID: { val: req.cicId },
                PSN_ADDR: { val: req.address },
                TEL_NO_MOBILE: { val: req.phoneNumber },
                NATL_ID: { val: req.natId },
                INQ_DTIM: { val: req.inquiryDate },
                SYS_DTIM: { val: dateutil.timeStamp() }
            },
            { autoCommit: false }
        );

        console.log("insertMobileReportA0001 main updated::", resultMain.rowsAffected);

        // tb_cic_mrpt
        sqlInsertMrpt = `INSERT INTO TB_CIC_MRPT(
            NICE_SSIN_ID,
            SCORE,
            GRADE,
            BASE_DATE,
            CC_BAL,
            REL_OGZ_LIST) VALUES (
                :NICE_SSIN_ID,
                :SCORE,
                :GRADE,
                :BASE_DATE,
                :CC_BAL,
                :REL_OGZ_LIST )`;

        resultMrpt = await connection.execute(
            // The statement to execute
            sqlInsertMrpt,
            {
                NICE_SSIN_ID: { val: req.niceSessionKey },
                SCORE: { val: req.creditScore },
                GRADE: { val: req.creditGrade },
                BASE_DATE: { val: req.baseDate },
                CC_BAL: { val: req.creditCardBalance },
                REL_OGZ_LIST: { val: req.relatedFiName }
            },
            { autoCommit: true }
        );

        console.log("insertMobileReportA0001 mrpt updated::", resultMrpt.rowsAffected);

        return resultMain.rowsAffected + resultMrpt.rowsAffected;
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
 ** update SCRP_MOD_CD = 06 to countinute process mobile
*/
async function updateScrpModCdTryCntHasNoResponseFromScraping06(req) {
    let connection;

    try {
        let sql, result;

        connection = await oracledb.getConnection(dbconfig);


        sql = `UPDATE TB_SCRPLOG
                SET SCRP_MOD_CD  = '06'
                WHERE NICE_SSIN_ID =:NICE_SSIN_ID`;

        result = await connection.execute(
            // The statement to execute
            sql,
            {
                NICE_SSIN_ID: { val: req }
            },
            { autoCommit: true },
        );

        console.log("updateScrpModCdHasNoResponseFromScraping trycount updated::", result.rowsAffected);

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

module.exports.insertMobileReportA0001 = insertMobileReportA0001;
module.exports.updateScrpModCdTryCntHasNoResponseFromScraping06 = updateScrpModCdTryCntHasNoResponseFromScraping06;