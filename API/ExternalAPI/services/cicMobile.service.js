const oracledb = require('oracledb');
const dbconfig = require('../../shared/config/dbconfig');

const dateutil = require('../util/dateutil');
const nicekey = require('../../shared/util/niceGoodCode');
const ipGateWay = require('../../shared/util/getIPGateWay');
const niceGoodCode = require('../../shared/util/niceGoodCode');
const _ = require('lodash');


async function insertSCRPLOG(req, res) {
    let connection;

    try {
        let sql, result;

        let sysDim = dateutil.timeStamp();

        let producCode = nicekey.niceProductCode(req.taskCode);
        let niceSessionKey = req.niceSessionKey;

        connection = await oracledb.getConnection();

        sql = `INSERT INTO TB_SCRPLOG(
               NICE_SSIN_ID, 
               CUST_SSID_ID, 
               CUST_CD, 
               GDS_CD,
               PSN_NM,
               LOGIN_ID,
               TEL_NO_MOBILE,
               SCRP_STAT_CD, 
               INQ_DTIM,
               AGR_FG, 
               SYS_DTIM) 
            VALUES (
                :NICE_SSIN_ID, 
                :CUST_SSID_ID, 
                :CUST_CD, 
                :GDS_CD,
                :PSN_NM,
                :LOGIN_ID,
                :TEL_NO_MOBILE,
                :SCRP_STAT_CD, 
                :INQ_DTIM,
                :AGR_FG, 
                :SYS_DTIM)`;

        result = await connection.execute(
            // The statement to execute
            sql,
            {
                NICE_SSIN_ID: { val: producCode + niceSessionKey },
                CUST_SSID_ID: { val: req.fiSessionKey },
                CUST_CD: { val: req.fiCode },
                GDS_CD: { val: producCode },
                PSN_NM: { val: req.name },
                LOGIN_ID: { val: req.mobilePhoneNumber },
                TEL_NO_MOBILE: { val: req.mobilePhoneNumber },
                SCRP_STAT_CD: { val: '01' },
                INQ_DTIM: { val: req.inquiryDate },
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

async function selectCicMobileDetailReport(req) {
    let connection;

    try {
        //Connection db
        connection = await oracledb.getConnection();

        let result;

        let _fiSessionKey, _inquiryDate, gdscd;

        gdscd = niceGoodCode.niceProductCode(req.taskCode);

        if (_.isEmpty(req.fiSessionKey))
            _fiSessionKey = '%%';
        else
            _fiSessionKey = req.fiSessionKey;

        if (_.isEmpty(req.inquiryDate))
            _inquiryDate = '%%';
        else
            _inquiryDate = req.inquiryDate;

        let sql = `SELECT a.S_REQ_STATUS, b.SCRP_STAT_CD, b.INQ_DTIM , b.SYS_DTIM, c.PSN_NM,c.BIRTH_YMD,c.CIC_ID,c.PSN_ADDR,c.NATL_ID, c.TEL_NO_MOBILE
                            , d.SCORE, d.GRADE, d.BASE_DATE, d.CC_BAL, d.REL_OGZ_LIST
                       FROM TB_SCRP_TRLOG a 
                       inner join tb_scrplog b on  a.nice_ssin_id = b.nice_ssin_id
                       inner join tb_cicrpt_main c on b.nice_ssin_id = c.nice_ssin_id
                       inner join tb_cic_mrpt d on b.nice_ssin_id = d.nice_ssin_id
                        where a.NICE_SSIN_ID = :niceSessionKey
                           AND a.S_SVC_CD = 'A0001'
                           AND b.CUST_CD = :fiCode
                           AND b.GDS_CD = :gdscd
                           AND b.INQ_DTIM like :inquiryDate`;

        result = await connection.execute(
            // The statement to execute
            sql,
            {
                niceSessionKey: { val: req.niceSessionKey },
                fiCode: { val: req.fiCode },
                gdscd: { val: gdscd },
                inquiryDate: { val: _inquiryDate }
            },
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            });

        console.log("tb_cic_mrpt result rows:", result.rows.length);

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

module.exports.insertSCRPLOG = insertSCRPLOG;
module.exports.selectCicMobileDetailReport = selectCicMobileDetailReport;
