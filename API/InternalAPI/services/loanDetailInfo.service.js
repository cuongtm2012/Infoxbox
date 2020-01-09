const oracledb = require('oracledb');
const dbconfig = require('../config/dbconfig');

const dateutil = require('../util/dateutil');
const getIdGetway = require('../../shared/util/getIPGateWay');
const _ = require('lodash');

async function insertLoanDetailInfor(req, res, next) {
    try {
        // let sql, binds, options, result;

        const sql = `INSERT INTO tb_loan_detail(NICE_SSIN_ID,
                SEQ,
                ST_LOAN_VND,
                ST_LOAN_USD,
                SYS_DTIM,
                WORK_ID
                )  values (:1, :2, :3, :4, :5, :6)`;

        const options = {
            autoCommit: true,
            bindDefs: [
                { type: oracledb.STRING, maxSize: 25 },
                { type: oracledb.STRING, maxSize: 5 },
                { type: oracledb.NUMBER, maxSize: 27 },
                { type: oracledb.NUMBER, maxSize: 27 },
                { type: oracledb.STRING, maxSize: 14 },
                { type: oracledb.STRING, maxSize: 15 }
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

module.exports.insertLoanDetailInfor = insertLoanDetailInfor;