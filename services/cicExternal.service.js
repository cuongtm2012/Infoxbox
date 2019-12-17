const oracledb = require('oracledb');
const dbconfig = require('../config/dbconfig');

const convertTime = require('../util/dateutil');

async function insertSCRPLOG(req, res, next) {
    try {
        let sql, binds, options, result;

        let sysDim = convertTime.timeStamp();

        connection = await oracledb.getConnection(dbconfig);

        sql = `INSERT INTO TB_SCRPLOG(NICE_SSIN_ID, CUST_SSID_ID, CUST_CD, LOGIN_ID, LOGIN_PW, TAX_ID, NATL_ID, OLD_NATL_ID, PSPT_NO, CIC_ID, AGR_FG, SYS_DTIM) 
        VALUES (:NICE_SSIN_ID, :CUST_SSID_ID, :CUST_CD, :LOGIN_ID, :LOGIN_PW, :TAX_ID, :NATL_ID, :OLD_NATL_ID, :PSPT_NO, :CIC_ID, :AGR_FG, :SYS_DTIM)`;

        result = await connection.execute(
            // The statement to execute
            sql,
            {
                NICE_SSIN_ID: { val: req.fiSessionKey },
                CUST_SSID_ID: { val: req.fiSessionKey },
                CUST_CD: { val: req.fiCode },
                LOGIN_ID: { val: req.loginId },
                LOGIN_PW: { val: req.loginPw },
                TAX_ID: { val: req.taxCode },
                NATL_ID: { val: req.natId },
                OLD_NATL_ID: { val: req.oldNatId },
                PSPT_NO: { val: req.passportNumber },
                CIC_ID: { val: req.cicId },
                AGR_FG: { val: req.infoProvConcent },
                SYS_DTIM: { val: sysDim }
            },
            { autoCommit: true }
        );

        console.log("row insert insertSCRPLOG::", result.rowsAffected);

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

module.exports.insertSCRPLOG = insertSCRPLOG;