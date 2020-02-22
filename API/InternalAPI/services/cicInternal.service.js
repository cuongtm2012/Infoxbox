
const oracledb = require('oracledb');
const dbconfig = require('../../shared/config/dbconfig');

const dateUtil = require('../util/dateutil');
const _ = require('lodash');
const responseCode = require('../../shared/constant/responseCodeExternal');

/*
    B0002 : CIC보고서 요청 (Request for CIC Report)
*/
async function select01(req, res, next) {
    let connection;

    try {
        let sql, result;

        connection = await oracledb.getConnection(dbconfig);

        //get curremt time
        let currentTimeStamp = dateUtil.timeStamp();

        sql = `SELECT NICE_SSIN_ID, CIC_ID, LOGIN_ID, LOGIN_PW, PSPT_NO, TAX_ID, NATL_ID, OLD_NATL_ID, SYS_DTIM, INQ_DTIM
            FROM TB_SCRPLOG a
            WHERE a.SCRP_STAT_CD = '01' 
                and (a.SCRP_MOD_CD = '00' or a.SCRP_MOD_CD is null)
                and a.GDS_CD = 'S1001'
                and a.AGR_FG = 'Y'
                and ROWNUM <= 20
            ORDER BY a.SYS_DTIM ASC`;
        // and (round((to_number(to_char(to_date(substr(:currentTimeStamp,9,14), 'hh24:mi:ss'),'sssss'))- to_number(to_char(to_date(substr(a.sys_dtim,9,14), 'hh24:mi:ss'),'sssss')))/60,0)) <= 30 

        result = await connection.execute(
            // The statement to execute
            sql,
            {},
            // [currentTimeStamp],
            // [1],
            // The "bind value" 3 for the bind variable ":idbv"
            // Options argument.  Since the query only returns one
            // row, we can optimize memory usage by reducing the default
            // maxRows value.  For the complete list of other options see
            // the documentation.
            {
                // maxRows: 1,
                outFormat: oracledb.OUT_FORMAT_OBJECT  // query result format
                //, extendedMetaData: true                 // get extra metadata
                //, fetchArraySize: 100                    // internal buffer allocation size for tuning
            });

        console.log("rows::", result.rows);

        return result.rows;
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

async function select04NotExist() {
    let connection;

    try {
        let sql, result;

        connection = await oracledb.getConnection(dbconfig);

        //get curremt time
        let currentTimeStamp = dateUtil.timeStamp();

        sql = `SELECT NICE_SSIN_ID, CIC_ID, LOGIN_ID, LOGIN_PW, PSPT_NO, TAX_ID
            FROM TB_SCRPLOG a
            WHERE a.SCRP_STAT_CD in ('01', '04') 
                and (round((to_number(to_char(to_date(substr(:currentTimeStamp,9,14), 'hh24:mi:ss'),'sssss'))- to_number(to_char(to_date(substr(a.sys_dtim,9,14), 'hh24:mi:ss'),'sssss')))/60,0)) > 30 
                and SCRP_MOD_CD = '00'
                and ROWNUM <= 20
            ORDER BY a.SYS_DTIM ASC`;

        result = await connection.execute(
            // The statement to execute
            sql,
            [currentTimeStamp],
            // [1],
            // The "bind value" 3 for the bind variable ":idbv"
            // Options argument.  Since the query only returns one
            // row, we can optimize memory usage by reducing the default
            // maxRows value.  For the complete list of other options see
            // the documentation.
            {
                // maxRows: 1,
                outFormat: oracledb.OUT_FORMAT_OBJECT  // query result format
                //, extendedMetaData: true                 // get extra metadata
                //, fetchArraySize: 100                    // internal buffer allocation size for tuning
            });

        console.log("rows::", result.rows);

        return result.rows;
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
    update statu == 04
*/
async function updateCICReportInquirySuccessful(req) {
    let connection;
    try {
        let sql, result;

        let sysDim = dateUtil.timeStamp();
        connection = await oracledb.getConnection(dbconfig);

        sql = `UPDATE TB_SCRPLOG
                SET SCRP_STAT_CD = '04', SYS_DTIM = :sysDim
                WHERE NICE_SSIN_ID =:niceSessionKey `;

        result = await connection.execute(
            // The statement to execute
            sql,
            {
                sysDim: { val: sysDim },
                niceSessionKey: { val: req.niceSessionKey }
            },
            { autoCommit: true }
        );

        console.log("updateCICReportInquirySuccessful updated::", result.rowsAffected);

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
    update statu == 10
*/
async function updateCICReportInquiryCompleted(req) {
    let connection;

    try {
        let sql, result;

        let sysDim = dateUtil.timeStamp();
        connection = await oracledb.getConnection(dbconfig);

        sql = `UPDATE TB_SCRPLOG
                SET SCRP_STAT_CD = '10', RSP_CD = 'P000', SYS_DTIM = :sysDim
                WHERE NICE_SSIN_ID =:niceSessionKey`;

        result = await connection.execute(
            // The statement to execute
            sql,
            {
                sysDim: { val: sysDim },
                niceSessionKey: { val: req }
            },
            { autoCommit: true }
        );

        console.log("updateCICReportInquirySuccessful updated::", result.rowsAffected);

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

async function updateScrapingTargetRepostNotExist(niceSessionKey) {
    let connection;

    try {
        let sqlUpdateScrplog, resultScrpLog;

        let sysDim = dateUtil.timeStamp();

        connection = await oracledb.getConnection(dbconfig);


        sqlUpdateScrplog = `UPDATE TB_SCRPLOG
                SET SCRP_STAT_CD = :SCRP_STAT_CD, RSP_CD = :RSP_CD , SYS_DTIM = :sysDim
                WHERE NICE_SSIN_ID =:NICE_SSIN_ID `;

        resultScrpLog = await connection.execute(
            // The statement to execute
            sqlUpdateScrplog,
            {
                SCRP_STAT_CD: { val: responseCode.ScrapingStatusCode.CicReportResultInqError.code },
                RSP_CD: { val: responseCode.RESCODEEXT.CICReportInqFailureTimeout.code },
                sysDim: { val: sysDim },
                NICE_SSIN_ID: { val: niceSessionKey }
            },
            { autoCommit: true },
        );
        console.log("updateScrapingTargetRepostNotExist updated::", resultScrpLog.rowsAffected);

        return resultScrpLog.rowsAffected;
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

async function updateScrpModCdPreRequestToScraping(req) {
    let connection;

    try {
        let sql, result;
        if (!_.isEmpty(req)) {
            connection = await oracledb.getConnection(dbconfig);


            sql = `UPDATE TB_SCRPLOG
                SET SCRP_MOD_CD  = '01'
                WHERE NICE_SSIN_ID in (${req.map((name, index) => `'${name}'`).join(", ")})`;

            result = await connection.execute(
                // The statement to execute
                sql,
                {},
                { autoCommit: true },
            );


            console.log("updateScrpModCdPreRequestToScraping updated::", result.rowsAffected);

            return result.rowsAffected;
            // return res.status(200).json(result.rows);
        }

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

async function updateScrpModCdPreRequestToScrapingB0002(niceSessionKey) {
    let connection;

    try {
        let sql, result;
        if (!_.isEmpty(niceSessionKey)) {
            connection = await oracledb.getConnection(dbconfig);


            sql = `UPDATE TB_SCRPLOG
                SET SCRP_MOD_CD  = '01'
                WHERE NICE_SSIN_ID =:niceSessionKey`;

            result = await connection.execute(
                // The statement to execute
                sql,
                {
                    niceSessionKey: { val: niceSessionKey }
                },
                { autoCommit: true },
            );


            console.log("updateScrpModCdPreRequestToScrapingB0002 updated::", result.rowsAffected);

            return result.rowsAffected;
            // return res.status(200).json(result.rows);
        }

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

async function updateScrpModCdHasNoResponseFromScraping(req) {
    let connection;

    try {
        let sql, result;

        connection = await oracledb.getConnection(dbconfig);


        sql = `UPDATE TB_SCRPLOG
                SET SCRP_MOD_CD  = '00'
                WHERE NICE_SSIN_ID =:NICE_SSIN_ID`;

        result = await connection.execute(
            // The statement to execute
            sql,
            {
                NICE_SSIN_ID: { val: req }
            },
            { autoCommit: true },
        );

        console.log("updateScrpModCdHasNoResponseFromScraping updated::", result.rowsAffected);

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

async function updateCICReportInquiryReadyToRequestScraping(req) {
    let connection;

    try {
        let sql, result;

        connection = await oracledb.getConnection(dbconfig);

        sql = `UPDATE TB_SCRPLOG
                SET SCRP_MOD_CD = '00'
                WHERE NICE_SSIN_ID in (${req.map((name, index) => `'${name}'`).join(", ")})`;

        result = await connection.execute(
            // The statement to execute
            sql,
            {},
            { autoCommit: true }
        );

        console.log("updateCICReportInquiryReadyToRequestScraping updated::", result.rowsAffected);

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
    B0003 : CIC보고서 조회 (Inquiry for CIC Report)
*/
async function startProcessB0003() {
    let connection;

    try {
        let sql, result;

        connection = await oracledb.getConnection(dbconfig);

        //get curremt time
        // let currentTimeStamp = dateUtil.timeStamp();

        sql = `SELECT a.nice_ssin_id as niceSessionKey, b.S_CIC_NO as cicId, a.inq_dtim
        FROM TB_SCRPLOG a inner join tb_scrp_trlog b on a.nice_ssin_id = b.nice_ssin_id
        WHERE a.SCRP_STAT_CD = '04'
            and a.SCRP_MOD_CD = '00'
            and b.S_SVC_CD = 'B0002'
            and a.GDS_CD = 'S1001'
            and a.AGR_FG = 'Y'
            and ROWNUM <= 20
        ORDER BY a.SYS_DTIM ASC`;
        // --                and (round((to_number(to_char(to_date(substr(:currentTimeStamp,9,14), 'hh24:mi:ss'),'sssss'))- to_number(to_char(to_date(substr(a.sys_dtim,9,14), 'hh24:mi:ss'),'sssss')))/60,0)) <= 30 
        // [currentTimeStamp],
        result = await connection.execute(
            sql,
            {},
            {
                // maxRows: 1,
                outFormat: oracledb.OUT_FORMAT_OBJECT  // query result format
            });

        console.log("rows::", result.rows);

        return result.rows;
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
    B1003 : CIC보고서요청 (Inquriy for CIC Report-S37)
*/
async function startProcessB1003() {
    let connection;

    try {
        let sql, result;

        connection = await oracledb.getConnection(dbconfig);

        sql = `SELECT NICE_SSIN_ID, CIC_ID, LOGIN_ID, LOGIN_PW, PSPT_NO, TAX_ID, NATL_ID, OLD_NATL_ID, SYS_DTIM, INQ_DTIM
                FROM TB_SCRPLOG a
                WHERE a.SCRP_STAT_CD = '01' 
                    and (a.SCRP_MOD_CD = '00' or a.SCRP_MOD_CD is null)
                    and a.GDS_CD = 'S1002'
                    and a.AGR_FG = 'Y'
                    and ROWNUM <= 20
                ORDER BY a.SYS_DTIM ASC`;
        result = await connection.execute(
            sql,
            {},
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            });

        console.log("startProcessB1003", result.rows);

        return result.rows;

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

async function updateScrpStatCdErrorResponseCodeScraping(niceSessionKey, code, niceCode) {
    let connection;

    try {
        let sql, result;

        connection = await oracledb.getConnection(dbconfig);


        sql = `UPDATE TB_SCRPLOG
                SET SCRP_STAT_CD  = :SCRP_STAT_CD, RSP_CD = :RSP_CD
                WHERE NICE_SSIN_ID = :NICE_SSIN_ID`;

        result = await connection.execute(
            // The statement to execute
            sql,
            {
                NICE_SSIN_ID: { val: niceSessionKey },
                SCRP_STAT_CD: { val: code },
                RSP_CD: { val: niceCode }
            },
            { autoCommit: true },
        );

        console.log("updateScrpStatCdErrorResponseCodeScraping updated::", result.rowsAffected);

        return result.rowsAffected;
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

async function updateListScrpStatCdErrorResponseCodeScraping(niceSessionKey, code, niceCode) {
    let connection;

    try {
        let sql, result;

        connection = await oracledb.getConnection(dbconfig);


        sql = `UPDATE TB_SCRPLOG
                SET SCRP_STAT_CD  = :SCRP_STAT_CD, RSP_CD = :RSP_CD
                WHERE NICE_SSIN_ID in (${niceSessionKey.map((name, index) => `'${name}'`).join(", ")})`;

        result = await connection.execute(
            // The statement to execute
            sql,
            {
                SCRP_STAT_CD: { val: code },
                RSP_CD: { val: niceCode }
            },
            { autoCommit: true },
        );

        console.log("updateScrpStatCdErrorResponseCodeScraping updated::", result.rowsAffected);

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

module.exports.select01 = select01;
module.exports.select04NotExist = select04NotExist;
module.exports.updateCICReportInquirySuccessful = updateCICReportInquirySuccessful;
module.exports.updateScrapingTargetRepostNotExist = updateScrapingTargetRepostNotExist;
module.exports.updateScrpModCdPreRequestToScraping = updateScrpModCdPreRequestToScraping;
module.exports.updateScrpModCdHasNoResponseFromScraping = updateScrpModCdHasNoResponseFromScraping;
module.exports.startProcessB0003 = startProcessB0003;
module.exports.updateCICReportInquiryCompleted = updateCICReportInquiryCompleted;
module.exports.updateCICReportInquiryReadyToRequestScraping = updateCICReportInquiryReadyToRequestScraping;
module.exports.updateScrpModCdPreRequestToScrapingB0002 = updateScrpModCdPreRequestToScrapingB0002;
module.exports.updateScrpStatCdErrorResponseCodeScraping = updateScrpStatCdErrorResponseCodeScraping;
module.exports.updateListScrpStatCdErrorResponseCodeScraping = updateListScrpStatCdErrorResponseCodeScraping;
module.exports.startProcessB1003 = startProcessB1003;