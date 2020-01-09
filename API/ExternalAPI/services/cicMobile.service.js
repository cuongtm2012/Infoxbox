const oracledb = require('oracledb');
const dbconfig = require('../config/dbconfig');

const convertTime = require('../util/dateutil');
const nicekey = require('../util/niceSessionKey');
const ipGateWay = require('../../shared/util/getIPGateWay');


async function insertSCRPLOG(req, res, next) {
    try {
        let sql, binds, options, result;

        let sysDim = convertTime.timeStamp();
        let producCode = nicekey.niceProductCode(req.cicGoodCode);
        let niceSessionKey = req.niceSessionKey;

            connection = await oracledb.getConnection(dbconfig);

        sql = `INSERT INTO TB_SCRPLOG(
               NICE_SSIN_ID, 
               CUST_SSID_ID, 
               CUST_CD, 
               PSN_NM, 
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
                PSN_NM: {val: req.name},
                TEL_NO_MOBILE: {val: req.mobilePhoneNumber},
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

async function insertINQLOG(req, res, next) {
    try {
        let sql, binds, options, result;

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

async function selectSCRPTRLOG(req, res, next){
    try{
        let sql, binds, options, result;

        connection = await oracledb.getConnection(dbconfig);

        sql = `SELECT  R_ERRYN, S_DTIM, R_DTIM, S_REQ_STATUS 
               FROM TB_SCRP_TRLOG
               where NICE_SSIN_ID = :niceSessionKey`;

        result = await connection.execute(
            // The statement to execute
            sql,
            {
                niceSessionKey: { val: req.niceSessionKey }
            },
            {
                // maxRows: 1,
                outFormat: oracledb.OUT_FORMAT_OBJECT  // query result format
                //, extendedMetaData: true                 // get extra metadata
                //, fetchArraySize: 100                    // internal buffer allocation size for tuning
            });

        console.log("rows::", result.rows);

        return result.rows;
    
    } catch (err){
           console.log(err);
}     finally {
        if (connection){
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
module.exports.selectSCRPTRLOG = selectSCRPTRLOG;
