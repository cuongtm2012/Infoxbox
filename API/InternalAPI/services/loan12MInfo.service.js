const oracledb = require('oracledb');
const dbconfig = require('../config/dbconfig');

const _ = require('lodash');

async function insertLoan12MInfor(req, res, next) {
    try {
        // let sql, binds, options, result;

        const sql = `INSERT INTO TB_LOAN_12MON(NICE_SSIN_ID,
                        SEQ,
                        BASE_MONTH,
                        BASE_MONTH_BAL,
                        BASE_MONTH_CARD_BAL,
                        BASE_MONTH_SUM,
                        SYS_DTIM,
                        WORK_ID)  values (:1, :2, :3, :4, :5, :6, :7, :8)`;

        const options = {
            autoCommit: true,
            bindDefs: [
                { type: oracledb.STRING, maxSize: 25 },
                { type: oracledb.NUMBER, maxSize: 5 },
                { type: oracledb.STRING, maxSize: 6 },
                { type: oracledb.NUMBER, maxSize: 27 },
                { type: oracledb.NUMBER, maxSize: 27 },
                { type: oracledb.NUMBER, maxSize: 27 },
                { type: oracledb.STRING, maxSize: 14 },
                { type: oracledb.STRING, maxSize: 20 }
            ]
        };

        connection = await oracledb.getConnection(dbconfig);
        const result = await connection.executeMany(sql, req, options);
        console.log("Result is:", result);

        return result;
        // return Promise.all(result.rowsAffected);


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

module.exports.insertLoan12MInfor = insertLoan12MInfor;