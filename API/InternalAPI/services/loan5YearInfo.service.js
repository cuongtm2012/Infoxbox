const oracledb = require('oracledb');
const dbconfig = require('../config/dbconfig');

const _ = require('lodash');

async function insertLoan5YearInfor(req, res, next) {
    try {
        // let sql, binds, options, result;

        const sql = `INSERT INTO TB_NPL_5YR(NICE_SSIN_ID,
                        SEQ,
                        OGZ_NM_BRANCH_NM,
                        RCT_OCR_DATE,
                        DEBT_GRP,
                        AMT_VND,
                        AMD_USD,
                        SYS_DTIM,
                        WORK_ID)  values (:1, :2, :3, :4, :5, :6, :7, :8, :9)`;

        const options = {
            autoCommit: true,
            bindDefs: [
                { type: oracledb.STRING, maxSize: 25 },
                { type: oracledb.NUMBER, maxSize: 5 },
                { type: oracledb.STRING, maxSize: 500 },
                { type: oracledb.STRING, maxSize: 8 },
                { type: oracledb.STRING, maxSize: 10 },
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

async function insertNoLoan5YearInfor(req, res, next) {
    try {
        let sql, result;

        connection = await oracledb.getConnection(dbconfig);

        sql = `INSERT INTO TB_NPL_5YR(NICE_SSIN_ID,
                        SEQ,
                        OGZ_NM_BRANCH_NM,
                        RCT_OCR_DATE,
                        DEBT_GRP,
                        AMT_VND,
                        AMD_USD,
                        SYS_DTIM,
                        WORK_ID) values (:NICE_SSIN_ID,
                            :SEQ,
                            :OGZ_NM_BRANCH_NM,
                            :RCT_OCR_DATE,
                            :DEBT_GRP,
                            :AMT_VND,
                            :AMD_USD,
                            :SYS_DTIM,
                            :WORK_ID)`;

        result = await connection.execute(sql,
            {
                NICE_SSIN_ID: { val: req.NICE_SSIN_ID },
                SEQ: { val: req.SEQ },
                OGZ_NM_BRANCH_NM: { val: req.OGZ_NM_BRANCH_NM },
                RCT_OCR_DATE: { val: req.RCT_OCR_DATE },
                DEBT_GRP: { val: req.DEBT_GRP },
                AMT_VND: { val: req.AMT_VND },
                AMD_USD: { val: req.AMD_USD },
                SYS_DTIM: { val: req.SYS_DTIM },
                WORK_ID: { val: req.WORK_ID }
            },
            { autoCommit: true }
        );

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

module.exports.insertLoan5YearInfor = insertLoan5YearInfor;
module.exports.insertNoLoan5YearInfor = insertNoLoan5YearInfor;