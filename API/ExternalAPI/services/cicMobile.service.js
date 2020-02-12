const oracledb = require('oracledb');
const dbconfig = require('../../shared/config/dbconfig');

const convertTime = require('../util/dateutil');
const nicekey = require('../../shared/util/niceGoodCode');
const ipGateWay = require('../../shared/util/getIPGateWay');


async function insertSCRPLOG(req, res) {
    let connection;

    try {
        let sql, result;

        let sysDim = convertTime.timeStamp();
        let producCode = nicekey.niceProductCode(req.cicGoodCode);
        let niceSessionKey = req.niceSessionKey;

        connection = await oracledb.getConnection(dbconfig);

        sql = `INSERT INTO TB_SCRPLOG(
               NICE_SSIN_ID, 
               CUST_SSID_ID, 
               CUST_CD, 
               PSN_NM,
               LOGIN_ID,
               TEL_NO_MOBILE, 
               TAX_ID, 
               NATL_ID, 
               OLD_NATL_ID, 
               PSPT_NO, 
               CIC_ID, 
               SCRP_STAT_CD, 
               AGR_FG, 
               SYS_DTIM) 
            VALUES (
               :NICE_SSIN_ID, 
               :CUST_SSID_ID, 
               :CUST_CD, 
               :PSN_NM,
               :LOGIN_ID, 
               :TEL_NO_MOBILE, 
               :TAX_ID, 
               :NATL_ID, 
               :OLD_NATL_ID, 
               :PSPT_NO, 
               :CIC_ID, 
               :SCRP_STAT_CD, 
               :AGR_FG, 
               :SYS_DTIM)`;

        result = await connection.execute(
            // The statement to execute
            sql,
            {
                NICE_SSIN_ID: { val: producCode + niceSessionKey },
                CUST_SSID_ID: { val: req.fiSessionKey },
                CUST_CD: { val: req.fiCode },
                PSN_NM: { val: req.name },
                LOGIN_ID: { val: req.name },
                TEL_NO_MOBILE: { val: req.mobilePhoneNumber },
                TAX_ID: { val: req.taxCode },
                NATL_ID: { val: req.natId },
                OLD_NATL_ID: { val: req.oldNatId },
                PSPT_NO: { val: req.passportNumber },
                CIC_ID: { val: req.cicId },
                SCRP_STAT_CD: { val: '01' },
                AGR_FG: { val: req.infoProvConcent },
                SYS_DTIM: { val: sysDim }
            },
            { autoCommit: true }
        );

        console.log("row insert insertSCRPLOG::", result.rowsAffected);

        return producCode + niceSessionKey;


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

async function insertINQLOG(req, res) {
    let connection;

    try {
        let sql, result;

        let sysDim = convertTime.timeStamp();
        let producCode = nicekey.niceProductCode(req.cicGoodCode);
        let niceSessionKey = req.niceSessionKey;

        connection = await oracledb.getConnection(dbconfig);

        let TX_GB_CD = "CIC_MACR_RQST";
        let gateway = ipGateWay.getIPGateWay(req);

        sql = `INSERT INTO TB_INQLOG(
            INQ_LOG_ID, 
            CUST_CD, 
            TX_GB_CD, 
            NATL_ID, 
            TAX_ID, 
            OTR_ID, 
            CIC_ID, 
            INQ_DTIM, 
            AGR_FG, 
            SYS_DTIM, 
            WORK_ID) 
        VALUES (
            :INQ_LOG_ID, 
            :CUST_CD, 
            :TX_GB_CD, 
            :NATL_ID, 
            :TAX_ID, 
            :OTR_ID, 
            :CIC_ID, 
            :INQ_DTIM, 
            :AGR_FG, 
            :SYS_DTIM, 
            :WORK_ID)`;

        result = await connection.execute(
            // The statement to execute
            sql,
            {
                INQ_LOG_ID: { val: niceSessionKey },
                CUST_CD: { val: req.fiCode },
                TX_GB_CD: { val: TX_GB_CD },
                NATL_ID: { val: req.natId },
                TAX_ID: { val: req.taxCode },
                OTR_ID: { val: req.oldNatId + "," + req.passportNumber },
                CIC_ID: { val: req.cicId },
                INQ_DTIM: { val: sysDim },
                AGR_FG: { val: req.infoProvConcent },
                SYS_DTIM: { val: sysDim },
                WORK_ID: { val: gateway }
            },
            { autoCommit: true }
        );

        console.log("row insert INQLOG::", result.rowsAffected);

        return producCode + niceSessionKey;


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

async function selectCICMacrRSLT(req) {
    let connection;

    try {
        let sqlScrpTranlog, resultScrpTranlog, outputScrpTranlog, ouputCicrptMain,  outputCicMRPT;

        connection = await oracledb.getConnection(dbconfig);

        sqlScrpTranlog = `SELECT DISTINCT 
                            a.R_ERRYN, 
                            a.S_DTIM, 
                            a.R_DTIM, 
                            a.S_REQ_STATUS,
                            b.SCRP_STAT_CD, 
                            b.INQ_DTIM AS INQ_DTIM_SCRPLOG,
                            b.SYS_DTIM  
                          FROM TB_SCRP_TRLOG a INNER JOIN TB_SCRPLOG b on  
                            a.NICE_SSIN_ID = b.NICE_SSIN_ID
                          WHERE a.NICE_SSIN_ID = :niceSessionKey
                          AND a.S_SCV_CD = 'B0003'`;

        resultScrpTranlog = await connection.execute(
            // The statement to execute
            sqlScrpTranlog,
            {
                niceSessionKey: { val: req.niceSessionKey }
            },
            {
                // maxRows: 1,
                outFormat: oracledb.OUT_FORMAT_OBJECT  // query result format
                //, extendedMetaData: true                 // get extra metadata
                //, fetchArraySize: 100                    // internal buffer allocation size for tuning
            });

        console.log("rows::", resultScrpTranlog.rows);
        outputScrpTranlog = resultScrpTranlog.rows;
        
        //CicRptMain
        let sqlCicrptMain = `SELECT a.PSN_NM, a.BIRTH_YMD, a.CIC_ID, a.PSN_ADDR, a.TEL_NO_MOBILE, a.NATL_ID
                             FROM TB_CICRPT_MAIN a
                             WHERE a.NICE_SSIN_ID = :niceSessionKey`;

        resultCicrptMain = await connection.execute(
            sqlCicrptMain,
            {
                niceSessionKey: { val: req.niceSessionKey}
            },
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            });

        console.log("resultCicrptMain rows:", resultCicrptMain.rows);
        ouputCicrptMain = resultCicrptMain.rows;
        
        if (_.isEmpty(ouputCicrptMain))
           return {}; 

        //CicMRPT    
        let sqlCicMRPT = `SELECT a.SCORE, a.GRADE, a.BASE_DATE, a.CC_BAL, a.REL_OGZ_LIST
                          FROM TB_CIC_MRPT a
                          WHERE a.NICE_SSIN_ID = :niceSessionKey`;    

        resultCicMRPT = await connection.execute(
            sqlCicMRPT,
            {
                niceSessionKey: { val: req.niceSessionKey}
            },
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            }
        ); 

        console.log("resultCicMRPT rows:", resultCicMRPT.rows);
        outputCicMRPT = resultCicMRPT.rows;

        if (_.isEmpty(outputCicMRPT))
           return {};  
           
        return { outputScrpTranlog, ouputCicrptMain, outputCicMRPT }  

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

async function selectScrapingStatusCodeSCRPLOG(niceSessionKey) {
    let connection;

    try {
        
        connection = await oracledb.getConnection(dbconfig);

        let sqlCusLookup = `SELECT T.SCRP_STAT_CD FROM TB_SCRPLOG T
                            where T.NICE_SSIN_ID = :niceSessionKey`;

        let result = await connection.execute(
            
            sqlCusLookup,
            {
                niceSessionKey: { val: niceSessionKey }
            },
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            });
        console.log("selectScrapingStatusCodeSCRPLOG rows:", result.rows);

        return result.rows;
        
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

module.exports.insertSCRPLOG = insertSCRPLOG;
module.exports.insertINQLOG = insertINQLOG;
module.exports.selectCICMacrRSLT = selectCICMacrRSLT;
module.exports.selectScrapingStatusCodeSCRPLOG = selectScrapingStatusCodeSCRPLOG;
