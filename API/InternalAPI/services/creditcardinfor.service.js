const oracledb = require('oracledb');
const dbconfig = require('../config/dbconfig');

const getIdGetway = require('../../shared/util/getIPGateWay');
const dateutil = require('../util/dateutil');

async function insertCreditCardInfor(req, res, next) {
    try {
        let sql, binds, options, result;

        const sysDtim = dateutil.timeStamp();
        const workID = getIdGetway.getIPGateWay();

        connection = await oracledb.getConnection(dbconfig);

        sql = `INSERT INTO TB_CICRPT_MAIN (NICE_SSIN_ID,
                CARD_TOT_LMT,
                CARD_TOT_SETL_AMT,
                CARD_TOT_ARR_AMT,
                CARD_CNT,
                CARD_ISU_OGZ,            
                SYS_DTIM,
                WORK_ID)VALUES (:NICE_SSIN_ID,
                    :CARD_TOT_LMT,
                    :CARD_TOT_SETL_AMT,
                    :CARD_TOT_ARR_AMT,
                    :CARD_CNT,
                    :CARD_ISU_OGZ, 
                    :SYS_DTIM,
                    :WORK_ID)`;

        result = await connection.execute(
            // The statement to execute
            sql,
            {
                NICE_SSIN_ID: { val: req.NICE_SSIN_ID },
                CARD_TOT_LMT: { val: req.INQ_OGZ_NM },
                CARD_TOT_SETL_AMT: { val: req.INQ_OGZ_ADDR },
                CARD_TOT_ARR_AMT: { val: req.INQ_USER_NM },
                CARD_CNT: { val: req.INQ_CD },
                CARD_ISU_OGZ: { val: req.INQ_DTIM },
                SYS_DTIM: { val: sysDtim },
                WORK_ID: { val: workID }
            },
            { autoCommit: true }
        );

        console.log("update Credit card infor updated::", result.rowsAffected);

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

module.exports.insertCreditCardInfor = insertCreditCardInfor;