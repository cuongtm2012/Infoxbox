
const oracledb = require('oracledb');
const dbconfig = require('../../shared/config/dbconfig');

const dateUtil = require('../util/dateutil');

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

        sql = `SELECT NICE_SSIN_ID, CIC_ID, LOGIN_ID, LOGIN_PW, PSPT_NO, TAX_ID, SYS_DTIM
            FROM TB_SCRPLOG a
            WHERE a.SCRP_STAT_CD = '01' 
                and (round((to_number(to_char(to_date(substr(:currentTimeStamp,9,14), 'hh24:mi:ss'),'sssss'))- to_number(to_char(to_date(substr(a.sys_dtim,9,14), 'hh24:mi:ss'),'sssss')))/60,0)) <= 30 
                and (SCRP_MOD_CD = '00' or SCRP_MOD_CD is null)
                and ROWNUM <= 20
            ORDER BY a.SYS_DTIM ASC`;
        // where CUS_ID = :CUS_ID`;

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

async function select04NotExist(req, res, next) {
    let connection;

    try {
        let sql, result;

        connection = await oracledb.getConnection(dbconfig);

        //get curremt time
        let currentTimeStamp = dateUtil.timeStamp();

        sql = `SELECT NICE_SSIN_ID, CIC_ID, LOGIN_ID, LOGIN_PW, PSPT_NO, TAX_ID
            FROM TB_SCRPLOG a
            WHERE a.SCRP_STAT_CD = '01' 
                and (round((to_number(to_char(to_date(substr(:currentTimeStamp,9,14), 'hh24:mi:ss'),'sssss'))- to_number(to_char(to_date(substr(a.sys_dtim,9,14), 'hh24:mi:ss'),'sssss')))/60,0)) > 30 
                and SCRP_MOD_CD = '00'
                and ROWNUM <= 20
            ORDER BY a.SYS_DTIM ASC`;
        // where CUS_ID = :CUS_ID`;

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
async function updateCICReportInquirySuccessful(req, res, next) {
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
async function updateCICReportInquiryCompleted(req, res, next) {
    let connection;

    try {
        let sql, result;

        let sysDim = dateUtil.timeStamp();
        connection = await oracledb.getConnection(dbconfig);

        sql = `UPDATE TB_SCRPLOG
                SET SCRP_STAT_CD = '10', SYS_DTIM = :sysDim
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

async function updateScrapingTargetRepostNotExist(req, res, next) {
    let connection;

    try {
        let sql, result;

        let sysDim = dateUtil.timeStamp();

        connection = await oracledb.getConnection(dbconfig);


        sql = `UPDATE TB_SCRPLOG
                SET SCRP_STAT_CD = '24', SYS_DTIM = :sysDim
                WHERE NICE_SSIN_ID =:NICE_SSIN_ID `;

        result = await connection.execute(
            // The statement to execute
            sql,
            {
                sysDim: { val: sysDim },
                NICE_SSIN_ID: { val: req.NICE_SSIN_ID }
            },
            { autoCommit: true },
        );

        console.log("updateScrapingTargetRepostNotExist updated::", result.rowsAffected);

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

async function updateScrpModCdPreRequestToScraping(req, res, next) {
    let connection;

    try {
        let sql, result;

        connection = await oracledb.getConnection(dbconfig);


        sql = `UPDATE TB_SCRPLOG
                SET SCRP_MOD_CD  = '01'
                WHERE NICE_SSIN_ID =:NICE_SSIN_ID `;

        result = await connection.execute(
            // The statement to execute
            sql,
            {
                NICE_SSIN_ID: { val: req.NICE_SSIN_ID }
            },
            { autoCommit: true },
        );

        console.log("updateScrpModCdPreRequestToScraping updated::", result.rowsAffected);

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

async function updateScrpModCdHasNoResponseFromScraping(req, res, next) {
    let connection;

    try {
        let sql, result;

        connection = await oracledb.getConnection(dbconfig);


        sql = `UPDATE TB_SCRPLOG
                SET SCRP_MOD_CD  = '00'
                WHERE NICE_SSIN_ID =:NICE_SSIN_ID `;

        result = await connection.execute(
            // The statement to execute
            sql,
            {
                NICE_SSIN_ID: { val: req.niceSessionKey }
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

/*
    B0003 : CIC보고서 조회 (Inquiry for CIC Report)
*/
async function startProcessB0003(req, res, next) {
    let connection;

    try {
        let sql, result;

        connection = await oracledb.getConnection(dbconfig);

        //get curremt time
        let currentTimeStamp = dateUtil.timeStamp();

        sql = `SELECT NICE_SSIN_ID, CIC_ID, LOGIN_ID, LOGIN_PW, PSPT_NO, TAX_ID, SYS_DTIM
            FROM TB_SCRPLOG a
            WHERE a.SCRP_STAT_CD = '04' 
                and (round((to_number(to_char(to_date(substr(:currentTimeStamp,9,14), 'hh24:mi:ss'),'sssss'))- to_number(to_char(to_date(substr(a.sys_dtim,9,14), 'hh24:mi:ss'),'sssss')))/60,0)) <= 30 
                and SCRP_MOD_CD = '00'
                and ROWNUM <= 20
            ORDER BY a.SYS_DTIM ASC`;
        // and (SCRP_MOD_CD = '00' or SCRP_MOD_CD is null)

        result = await connection.execute(
            // The statement to execute
            sql,
            [currentTimeStamp],
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


module.exports.select01 = select01;
module.exports.select04NotExist = select04NotExist;
module.exports.updateCICReportInquirySuccessful = updateCICReportInquirySuccessful;
module.exports.updateScrapingTargetRepostNotExist = updateScrapingTargetRepostNotExist;
module.exports.updateScrpModCdPreRequestToScraping = updateScrpModCdPreRequestToScraping;
module.exports.updateScrpModCdHasNoResponseFromScraping = updateScrpModCdHasNoResponseFromScraping;
module.exports.startProcessB0003 = startProcessB0003;
module.exports.updateCICReportInquiryCompleted = updateCICReportInquiryCompleted;