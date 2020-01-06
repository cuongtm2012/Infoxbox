const oracledb = require('oracledb');
const dbconfig = require('../config/dbconfig');

const dateutil = require('../util/dateutil');
const getIdGetway = require('../../shared/util/getIPGateWay');

async function insertLoanDetailInfor(req, res, next) {
    try {
        let sql, binds, options, result;

        connection = await oracledb.getConnection(dbconfig);

        sql = `INSERT INTO tb_loan_detail(NICE_SSIN_ID,
            SEQ,
            ST_LOAN_VND,
            ST_LOAN_USD,
            SYS_DTIM,
            WORK_ID
            ) 
            values (:NICE_SSIN_ID, :SEQ, :ST_LOAN_VND, :ST_LOAN_USD, :SYS_DTIM, :WORK_ID)`;

        result = await connection.execute(
            // The statement to execute
            sql,
            {
                NICE_SSIN_ID: { val: req.NICE_SSIN_ID },
                SEQ: { val: req.SEQ },
                ST_LOAN_VND: { val: req.ST_LOAN_VND },
                ST_LOAN_USD: { val: req.ST_LOAN_USD },
                SYS_DTIM: { val: dateutil.timeStamp() },
                WORK_ID: {val: getIdGetway.getIPGateWay()}
            },
            { autoCommit: true }
        );

        console.log("tb_loan_detail updated::", result.rowsAffected);

        return result.rowsAffected;
        // return res.status(200).json(result.rows);


    } catch (err) {
        console.log(err);
        return;
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

module.exports.insertLoanDetailInfor = insertLoanDetailInfor;