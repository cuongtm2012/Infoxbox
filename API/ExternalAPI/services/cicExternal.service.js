const oracledb = require('oracledb');
const dbconfig = require('../../shared/config/dbconfig');

const convertTime = require('../util/dateutil');
const nicekey = require('../util/niceSessionKey');
const ipGateWay = require('../../shared/util/getIPGateWay');
const _ = require('lodash');

async function insertSCRPLOG(req) {
    let connection;

    try {
        let sql, result;

        let sysDim = convertTime.timeStamp();
        let producCode = nicekey.niceProductCode(req.cicGoodCode);
        let niceSessionKey = req.niceSessionKey;

        connection = await oracledb.getConnection(dbconfig);

        sql = `INSERT INTO TB_SCRPLOG(NICE_SSIN_ID, CUST_SSID_ID, CUST_CD, LOGIN_ID, LOGIN_PW, TAX_ID, NATL_ID, OLD_NATL_ID, PSPT_NO, CIC_ID, SCRP_STAT_CD, AGR_FG, SYS_DTIM) 
        VALUES (:NICE_SSIN_ID, :CUST_SSID_ID, :CUST_CD, :LOGIN_ID, :LOGIN_PW, :TAX_ID, :NATL_ID, :OLD_NATL_ID, :PSPT_NO, :CIC_ID, :SCRP_STAT_CD, :AGR_FG, :SYS_DTIM)`;

        result = await connection.execute(
            // The statement to execute
            sql,
            {
                NICE_SSIN_ID: { val: producCode + niceSessionKey },
                CUST_SSID_ID: { val: req.fiSessionKey },
                CUST_CD: { val: req.fiCode },
                LOGIN_ID: { val: req.loginId },
                LOGIN_PW: { val: req.loginPw },
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

async function insertINQLOG(req) {
    let connection;

    try {
        let sql, result;

        let sysDim = convertTime.timeStamp();
        let gateway = ipGateWay.getIPGateWay(req);

        connection = await oracledb.getConnection(dbconfig);

        sql = `INSERT INTO TB_INQLOG(INQ_LOG_ID, CUST_CD, TX_GB_CD, NATL_ID, TAX_ID, OTR_ID, CIC_ID, INQ_DTIM, AGR_FG, SYS_DTIM, WORK_ID) 
        VALUES (:INQ_LOG_ID, :CUST_CD, :TX_GB_CD, :NATL_ID, :TAX_ID, :OTR_ID, :CIC_ID, :INQ_DTIM, :AGR_FG, :SYS_DTIM, :WORK_ID)`;

        result = await connection.execute(
            // The statement to execute
            sql,
            {
                INQ_LOG_ID: { val: req.niceSessionKey },
                CUST_CD: { val: req.fiCode },
                TX_GB_CD: { val: req.taskCode },
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

async function selectCICS11aRSLT(req) {
    let connection;

    try {
        let resultScrpTranlog, resultCicrptMain, resultLoanDetailInfo, resultCreditCardInfo;
        let outputCicrptMain, outputScrpTranlog, outputLoanDetailinfo, outputCreditCardInfo;
        var cmtLoanDetailInfo, cmtCreditCard;

        //Connection db
        connection = await oracledb.getConnection(dbconfig);

        /*
        ** scrp tranlosg
        */
        let sqlScrpTranlog = `SELECT  R_ERRYN, S_DTIM, R_DTIM, S_REQ_STATUS 
                FROM TB_SCRP_TRLOG
                where NICE_SSIN_ID = :niceSessionKey
                AND S_SVC_CD = 'B0003'`;

        resultScrpTranlog = await connection.execute(
            // The statement to execute
            sqlScrpTranlog,
            {
                niceSessionKey: { val: req.niceSessionKey }
            },
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            });

        console.log("resultScrpTranlog rows:", resultScrpTranlog.rows);
        outputScrpTranlog = resultScrpTranlog.rows;

        /*
        ** cicrpt main
        */
        let sqlCicrptMain = `select a.inq_ogz_nm, a.inq_ogz_addr, a.inq_user_nm, a.inq_cd, a.inq_dtim, a.rpt_send_dtim, a.psn_nm, a.cic_id, a.psn_addr, a.natl_id, a.otr_iden_evd,
                              a.CARD_CMT, a.LOAN_CMT_DETAIL  
                              from tb_cicrpt_main a
                              where a.NICE_SSIN_ID = :niceSessionKey`;

        resultCicrptMain = await connection.execute(
            // The statement to execute
            sqlCicrptMain,
            {
                niceSessionKey: { val: req.niceSessionKey }
            },
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            });

        console.log("resultCicrptMain rows:", resultCicrptMain.rows);
        outputCicrptMain = resultCicrptMain.rows;

        /*
        ** 2.1. loan detail
        */
        const sqlLoanDetailInfo = `select B.OGZ_CD,
            B.OGZ_NM,
            B.RCT_RPT_DATE,
            B.ST_LOAN_VND,
            B.ST_LOAN_USD,
            B.ST_NORM_LOAN_VND,
            B.ST_NORM_LOAN_USD,
            B.ST_CAT_LOAN_VND,
            B.ST_CAT_LOAN_USD,
            B.ST_FIX_LOAN_VND,
            B.ST_FIX_LOAN_USD,
            B.ST_CQ_LOAN_VND,
            B.ST_CQ_LOAN_USD,
            B.ST_EL_LOAN_VND,
            B.ST_EL_LOAN_USD,
            B.MT_LOAN_VND,
            B.MT_LOAN_UDS,
            B.MT_NORM_LOAN_VND,
            B.MT_NORM_LOAN_USD,
            B.MT_CAT_LOAN_VND,
            B.MT_CAT_LOAN_USD,
            B.MT_FIX_LOAN_VND,
            B.MT_FIX_LOAN_USD,
            B.MT_CQ_LOAN_VND,
            B.MT_CQ_LOAN_USD,
            B.MT_EL_LOAN_VND,
            B.MT_EL_LOAN_USD,
            B.LT_LOAN_VND,
            B.LT_LOAN_USD,
            B.LT_NORM_LOAN_VND,
            B.LT_NORM_LOAN_USD,
            B.LT_CAT_LOAN_VND,
            B.LT_CAT_LOAN_USD,
            B.LT_FIX_LOAN_VND,
            B.LT_FIX_LOAN_USD,
            B.LT_CQ_LOAN_VND,
            B.LT_CQ_LOAN_USD,
            B.LT_EL_LOAN_VND,
            B.LT_EL_LOAN_USD,
            B.OTR_LOAN_VND,
            B.OTR_LOAN_USD,
            B.OTR_NORM_LOAN_VND,
            B.OTR_NORM_LOAN_USD,
            B.OTR_CAT_LOAN_VND,
            B.OTR_CAT_LOAN_USD,
            B.OTR_FIX_LOAN_VND,
            B.OTR_FIX_LOAN_USD,
            B.OTR_CQ_LOAN_VND,
            B.OTR_CQ_LOAN_USD,
            B.OTR_EL_LOAN_VND,
            B.OTR_EL_LOAN_USD,
            B.OTR_BAD_LOAN_VND,
            B.OTR_BAD_LOAN_USD,
            B.OGZ_TOT_LOAN_VND,
            B.OGZ_TOT_LOAN_USD,
            A.SUM_TOT_OGZ_VND,
            A.SUM_TOT_OGZ_USD
            from 
                (select NICE_SSIN_ID,
                sum(OGZ_TOT_LOAN_VND) AS SUM_TOT_OGZ_VND,
                sum(OGZ_TOT_LOAN_USD) AS SUM_TOT_OGZ_USD
                from tb_loan_detail where nice_ssin_id =:niceSessionKey group by nice_ssin_id) A left join tb_loan_detail B on A.NICE_SSIN_ID = B.NICE_SSIN_ID`;

        resultLoanDetailInfo = await connection.execute(
            // The statement to execute
            sqlLoanDetailInfo,
            {
                niceSessionKey: { val: req.niceSessionKey }
            },
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            });

        console.log("resultLoanDetailInfo rows:", resultLoanDetailInfo.rows);

        if (_.isEmpty(resultLoanDetailInfo.rows)) {
            cmtLoanDetailInfo = outputCicrptMain[0].LOAN_CMT_DETAIL;
        }
        else
            outputLoanDetailinfo = resultLoanDetailInfo.rows;

        /*
        ** 2.2. Credit Card infor
        */
        let sqlCreditCardInfo = `select a.CARD_TOT_LMT, a.CARD_TOT_SETL_AMT, a.CARD_TOT_ARR_AMT, a.CARD_CNT, a.CARD_ISU_OGZ 
                             from TB_CRDT_CARD a
                             where a.NICE_SSIN_ID = :niceSessionKey`;

        resultCreditCardInfo = await connection.execute(
            // The statement to execute
            sqlCreditCardInfo,
            {
                niceSessionKey: { val: req.niceSessionKey }
            },
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            });

        console.log("resultCreditCardInfo rows:", resultCreditCardInfo.rows);
        if (_.isEmpty(resultCreditCardInfo.rows)) {
            cmtCreditCard = outputCicrptMain[0].CARD_CMT;
        }
        else
            outputCreditCardInfo = resultCreditCardInfo.rows;

        return { outputScrpTranlog, outputCicrptMain, outputLoanDetailinfo, outputCreditCardInfo, cmtLoanDetailInfo, cmtCreditCard };

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
module.exports.insertINQLOG = insertINQLOG;
module.exports.selectCICS11aRSLT = selectCICS11aRSLT;