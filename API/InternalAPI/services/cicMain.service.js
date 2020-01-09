const oracledb = require('oracledb');
const dbconfig = require('../config/dbconfig');

const getIdGetway = require('../../shared/util/getIPGateWay');
const dateutil = require('../util/dateutil');

async function insertCicMainInfor(req, res, next) {
    try {
        let sql, binds, options, result;

        const sysDtim = dateutil.timeStamp();
        const workID = getIdGetway.getIPGateWay();

        connection = await oracledb.getConnection(dbconfig);

        sql = `INSERT INTO TB_CICRPT_MAIN (NICE_SSIN_ID,
                INQ_OGZ_NM,
                INQ_OGZ_ADDR,
                INQ_USER_NM,
                INQ_CD,
                INQ_DTIM,
                RPT_SEND_DTIM,
                PSN_COMT,
                PSN_NM,
                CIC_ID,
                PSN_ADDR,
                NATL_ID,
                OTR_IDEN_EVD,
                EWS_GRD,
                BIRTH_YMD,
                TEL_NO_MOBILE,
                LOAN_CMT,
                LOAN_CMT_DETAIL,
                CARD_CMT,
                VAMC_CMT,
                LOAN_12MON_CMT,
                NPL_5YR_CMT,
                CARD_ARR_3YR_CMT,
                CAT_LOAN_12MON_CMT,
                FIN_CTRT_CMT,
                SYS_DTIM,
                WORK_ID)VALUES (:NICE_SSIN_ID,
                    :INQ_OGZ_NM,
                    :INQ_OGZ_ADDR,
                    :INQ_USER_NM,
                    :INQ_CD,
                    :INQ_DTIM,
                    :RPT_SEND_DTIM,
                    :PSN_COMT,
                    :PSN_NM,
                    :CIC_ID,
                    :PSN_ADDR,
                    :NATL_ID,
                    :OTR_IDEN_EVD,
                    :EWS_GRD,
                    :BIRTH_YMD,
                    :TEL_NO_MOBILE,
                    :LOAN_CMT,
                    :LOAN_CMT_DETAIL,
                    :CARD_CMT,
                    :VAMC_CMT,
                    :LOAN_12MON_CMT,
                    :NPL_5YR_CMT,
                    :CARD_ARR_3YR_CMT,
                    :CAT_LOAN_12MON_CMT,
                    :FIN_CTRT_CMT,
                    :SYS_DTIM,
                    :WORK_ID)`;

        result = await connection.execute(
            // The statement to execute
            sql,
            {
                NICE_SSIN_ID: { val: req.NICE_SSIN_ID },
                INQ_OGZ_NM: { val: req.INQ_OGZ_NM },
                INQ_OGZ_ADDR: { val: req.INQ_OGZ_ADDR },
                INQ_USER_NM: { val: req.INQ_USER_NM },
                INQ_CD: { val: req.INQ_CD },
                INQ_DTIM: { val: req.INQ_DTIM },
                RPT_SEND_DTIM: { val: req.RPT_SEND_DTIM },
                PSN_COMT: { val: req.PSN_COMT },
                PSN_NM: { val: req.PSN_NM },
                CIC_ID: { val: req.CIC_ID },
                PSN_ADDR: { val: req.PSN_ADDR },
                NATL_ID: { val: req.NATL_ID },
                OTR_IDEN_EVD: { val: req.OTR_IDEN_EVD },
                EWS_GRD: { val: req.EWS_GRD },
                BIRTH_YMD: { val: req.BIRTH_YMD },
                TEL_NO_MOBILE: { val: req.TEL_NO_MOBILE },
                LOAN_CMT: { val: req.LOAN_CMT },
                LOAN_CMT_DETAIL: { val: req.LOAN_CMT_DETAIL },
                CARD_CMT: { val: req.CARD_CMT },
                VAMC_CMT: { val: req.VAMC_CMT },
                LOAN_12MON_CMT: { val: req.LOAN_12MON_CMT },
                NPL_5YR_CMT: { val: req.NPL_5YR_CMT },
                CARD_ARR_3YR_CMT: { val: req.CARD_ARR_3YR_CMT },
                CAT_LOAN_12MON_CMT: { val: req.CAT_LOAN_12MON_CMT },
                FIN_CTRT_CMT: { val: req.FIN_CTRT_CMT },
                SYS_DTIM: { val: sysDtim },
                WORK_ID: { val: workID }
            },
            { autoCommit: true }
        );

        console.log("updated cicrpt main updated::", result.rowsAffected);

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

module.exports.insertCicMainInfor = insertCicMainInfor;