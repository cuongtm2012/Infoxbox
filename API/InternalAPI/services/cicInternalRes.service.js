const oracledb = require('oracledb');
const dbconfig = require('../../shared/config/dbconfig');

async function updateScrapingTranslog(req, res, next) {
    let connection;

    try {
        let sql, result;

        connection = await oracledb.getConnection(dbconfig);

        sql = `INSERT INTO TB_SCRP_TRLOG(SCRP_LOG_ID,
                NICE_SSIN_ID,
                S_SVC_CD,
                S_USER_ID,
                S_USER_PW,
                S_CUSTOMER_TYPE,
                S_CIC_NO,
                S_TAX_NO,
                S_CMT_NO,
                S_REPORT_TYPE,
                S_VOTE_NO,
                S_REQ_STATUS,
                S_INQ_DT1,
                S_INQ_DT2,
                S_STEP_INPUT,
                S_STEP_DATA,
                S_DTIM,
                R_ERRYN,
                R_ERRMSG,
                R_STEP_IMG,
                R_STEP_DATA,
                R_DTIM,
                WORK_ID ) VALUES (
                    :SCRP_LOG_ID,
                    :NICE_SSIN_ID,
                    :S_SVC_CD,
                    :S_USER_ID,
                    :S_USER_PW,
                    :S_CUSTOMER_TYPE,
                    :S_CIC_NO,
                    :S_TAX_NO,
                    :S_CMT_NO,
                    :S_REPORT_TYPE,
                    :S_VOTE_NO,
                    :S_REQ_STATUS,
                    :S_INQ_DT1,
                    :S_INQ_DT2,
                    :S_STEP_INPUT,
                    :S_STEP_DATA,
                    :S_DTIM,
                    :R_ERRYN,
                    :R_ERRMSG,
                    :R_STEP_IMG,
                    :R_STEP_DATA,
                    :R_DTIM,
                    :WORK_ID )`;

        result = await connection.execute(
            // The statement to execute
            sql,
            {
                SCRP_LOG_ID: { val: req.SCRP_LOG_ID },
                NICE_SSIN_ID: { val: req.NICE_SSIN_ID },
                S_SVC_CD: { val: req.S_SVC_CD },
                S_USER_ID: { val: req.S_USER_ID },
                S_USER_PW: { val: req.S_USER_PW },
                S_CUSTOMER_TYPE: { val: req.S_CUSTOMER_TYPE },
                S_CIC_NO: { val: req.S_CIC_NO },
                S_TAX_NO: { val: req.S_TAX_NO },
                S_CMT_NO: { val: req.S_CMT_NO },
                S_REPORT_TYPE: { val: req.S_REPORT_TYPE },
                S_VOTE_NO: { val: req.S_VOTE_NO },
                S_REQ_STATUS: { val: req.S_REQ_STATUS },
                S_INQ_DT1: { val: req.S_INQ_DT1 },
                S_INQ_DT2: { val: req.S_INQ_DT2 },
                S_STEP_INPUT: { val: req.S_STEP_INPUT },
                S_STEP_DATA: { val: req.S_STEP_DATA },
                S_DTIM: { val: req.S_DTIM },
                R_ERRYN: { val: req.R_ERRYN },
                R_ERRMSG: { val: req.R_ERRMSG },
                R_STEP_IMG: { val: req.R_STEP_IMG },
                R_STEP_DATA: { val: req.R_STEP_DATA },
                R_DTIM: { val: req.R_DTIM },
                WORK_ID: { val: req.WORK_ID }
            },
            { autoCommit: true }
        );

        console.log("updateScrapingTranslog updated::", result.rowsAffected);

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

module.exports.updateScrapingTranslog = updateScrapingTranslog;