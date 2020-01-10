const oracledb = require('oracledb');
const dbconfig = require('../config/dbconfig');

const getIdGetway = require('../../shared/util/getIPGateWay');
const dateutil = require('../util/dateutil');

const _ = require('lodash');

async function insertScrapingMSG(bindsLoanDetailInfor, bindlistloan5YearInfo, bindlistloan12monInfo, objciccptmain, objCreditcardinfor) {
    let connection;

    try {
        // Create connection to DB
        connection = await oracledb.getConnection(dbconfig);

        // result for insert
        let resultLoanDetailInfor, resultLoan5Year, resultLoan12MonInfor, resultCicrptMain, resultCreditCardInfor;

        const sysDtim = dateutil.timeStamp();
        const workID = getIdGetway.getIPGateWay();

        // Insert Loan detail infor
        if (!_.isEmpty(bindsLoanDetailInfor)) {
            const sqlInsertLoanDetailInfor = `INSERT INTO tb_loan_detail(NICE_SSIN_ID,
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
                    { type: oracledb.NUMBER, maxSize: 5 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.STRING, maxSize: 14 },
                    { type: oracledb.STRING, maxSize: 15 }
                ]
            };


            resultLoanDetailInfor = await connection.executeMany(sqlInsertLoanDetailInfor, bindsLoanDetailInfor, options);

        }
        console.log("Result resultLoanDetailInfor is:", resultLoanDetailInfor);

        // Insert Loan 5 Year
        if (!_.isEmpty(bindlistloan5YearInfo)) {
            const sqlInsert5YearInfor = `INSERT INTO TB_NPL_5YR(NICE_SSIN_ID,
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

            resultLoan5Year = await connection.executeMany(sqlInsert5YearInfor, bindlistloan5YearInfo, options);

        }
        console.log("Result resultLoan5Year is :", resultLoan5Year);

        // Loan 12 Mon infor
        if (!_.isEmpty(bindlistloan12monInfo)) {
            const sqlInsertLoan12MonInfor = `INSERT INTO TB_LOAN_12MON(NICE_SSIN_ID,
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

            resultLoan12MonInfor = await connection.executeMany(sqlInsertLoan12MonInfor, bindlistloan12monInfo, options);

        }
        console.log("Result bindlistloan12monInfo is:", resultLoan12MonInfor);

        // CICRPT main
        if (!_.isEmpty(objciccptmain)) {
            const sqlInsertCICRPTMain = `INSERT INTO TB_CICRPT_MAIN (NICE_SSIN_ID,
            INQ_OGZ_NM,
            INQ_OGZ_ADDR,
            INQ_USER_NM,
            INQ_CD,
            INQ_DTIM,
            RPT_SEND_DTIM,
            PSN_COMT,
            PSN_NM,
            CIC_ID,
            PSN_ADDR,
            NATL_ID,
            OTR_IDEN_EVD,
            EWS_GRD,
            BIRTH_YMD,
            TEL_NO_MOBILE,
            LOAN_CMT,
            LOAN_CMT_DETAIL,
            CARD_CMT,
            VAMC_CMT,
            LOAN_12MON_CMT,
            NPL_5YR_CMT,
            CARD_ARR_3YR_CMT,
            CAT_LOAN_12MON_CMT,
            FIN_CTRT_CMT,
            SYS_DTIM,
            WORK_ID)VALUES (:NICE_SSIN_ID,
                :INQ_OGZ_NM,
                :INQ_OGZ_ADDR,
                :INQ_USER_NM,
                :INQ_CD,
                :INQ_DTIM,
                :RPT_SEND_DTIM,
                :PSN_COMT,
                :PSN_NM,
                :CIC_ID,
                :PSN_ADDR,
                :NATL_ID,
                :OTR_IDEN_EVD,
                :EWS_GRD,
                :BIRTH_YMD,
                :TEL_NO_MOBILE,
                :LOAN_CMT,
                :LOAN_CMT_DETAIL,
                :CARD_CMT,
                :VAMC_CMT,
                :LOAN_12MON_CMT,
                :NPL_5YR_CMT,
                :CARD_ARR_3YR_CMT,
                :CAT_LOAN_12MON_CMT,
                :FIN_CTRT_CMT,
                :SYS_DTIM,
                :WORK_ID)`;

            resultCicrptMain = await connection.execute(
                // The statement to execute
                sqlInsertCICRPTMain,
                {
                    NICE_SSIN_ID: { val: objciccptmain.NICE_SSIN_ID },
                    INQ_OGZ_NM: { val: objciccptmain.INQ_OGZ_NM },
                    INQ_OGZ_ADDR: { val: objciccptmain.INQ_OGZ_ADDR },
                    INQ_USER_NM: { val: objciccptmain.INQ_USER_NM },
                    INQ_CD: { val: objciccptmain.INQ_CD },
                    INQ_DTIM: { val: objciccptmain.INQ_DTIM },
                    RPT_SEND_DTIM: { val: objciccptmain.RPT_SEND_DTIM },
                    PSN_COMT: { val: objciccptmain.PSN_COMT },
                    PSN_NM: { val: objciccptmain.PSN_NM },
                    CIC_ID: { val: objciccptmain.CIC_ID },
                    PSN_ADDR: { val: objciccptmain.PSN_ADDR },
                    NATL_ID: { val: objciccptmain.NATL_ID },
                    OTR_IDEN_EVD: { val: objciccptmain.OTR_IDEN_EVD },
                    EWS_GRD: { val: objciccptmain.EWS_GRD },
                    BIRTH_YMD: { val: objciccptmain.BIRTH_YMD },
                    TEL_NO_MOBILE: { val: objciccptmain.TEL_NO_MOBILE },
                    LOAN_CMT: { val: objciccptmain.LOAN_CMT },
                    LOAN_CMT_DETAIL: { val: objciccptmain.LOAN_CMT_DETAIL },
                    CARD_CMT: { val: objciccptmain.CARD_CMT },
                    VAMC_CMT: { val: objciccptmain.VAMC_CMT },
                    LOAN_12MON_CMT: { val: objciccptmain.LOAN_12MON_CMT },
                    NPL_5YR_CMT: { val: objciccptmain.NPL_5YR_CMT },
                    CARD_ARR_3YR_CMT: { val: objciccptmain.CARD_ARR_3YR_CMT },
                    CAT_LOAN_12MON_CMT: { val: objciccptmain.CAT_LOAN_12MON_CMT },
                    FIN_CTRT_CMT: { val: objciccptmain.FIN_CTRT_CMT },
                    SYS_DTIM: { val: sysDtim },
                    WORK_ID: { val: workID }
                },
                { autoCommit: true }
            );
        }
        console.log("updated cicrpt main updated::", resultCicrptMain);

        // Credit card infor
        if (!_.isEmpty(objCreditcardinfor)) {

            const sqlInsertCreditCardInfor = `INSERT INTO TB_CRDT_CARD (NICE_SSIN_ID,
            CARD_TOT_LMT,
            CARD_TOT_SETL_AMT,
            CARD_TOT_ARR_AMT,
            CARD_CNT,
            CARD_ISU_OGZ,            
            SYS_DTIM,
            WORK_ID)VALUES (:NICE_SSIN_ID,
                :CARD_TOT_LMT,
                :CARD_TOT_SETL_AMT,
                :CARD_TOT_ARR_AMT,
                :CARD_CNT,
                :CARD_ISU_OGZ, 
                :SYS_DTIM,
                :WORK_ID)`;

            resultCreditCardInfor = await connection.execute(
                // The statement to execute
                sqlInsertCreditCardInfor,
                {
                    NICE_SSIN_ID: { val: objCreditcardinfor.NICE_SSIN_ID },
                    CARD_TOT_LMT: { val: objCreditcardinfor.CARD_TOT_LMT },
                    CARD_TOT_SETL_AMT: { val: objCreditcardinfor.CARD_TOT_SETL_AMT },
                    CARD_TOT_ARR_AMT: { val: objCreditcardinfor.CARD_TOT_ARR_AMT },
                    CARD_CNT: { val: objCreditcardinfor.CARD_CNT },
                    CARD_ISU_OGZ: { val: objCreditcardinfor.CARD_ISU_OGZ },
                    SYS_DTIM: { val: sysDtim },
                    WORK_ID: { val: workID }
                },
                { autoCommit: true }
            );
        }
        console.log("update Credit card infor updated::", resultCreditCardInfor);

        return { resultLoanDetailInfor, resultLoan5Year, resultLoan12MonInfor, resultCicrptMain, resultCreditCardInfor };
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

module.exports.insertScrapingMSG = insertScrapingMSG;