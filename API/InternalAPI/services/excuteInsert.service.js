const oracledb = require('oracledb');
const dbconfig = require('../../shared/config/dbconfig');

const getIdGetway = require('../../shared/util/getIPGateWay');
const dateutil = require('../util/dateutil');

const _ = require('lodash');

async function insertScrapingMSG(bindsLoanDetailInfor, bindlistloan5YearInfo, bindlistloan12monInfo, objciccptmain, objCreditcardinfor, bindlistVamcLoanInfo, bindlistloanAtt12monInfo, bindlistCreditContractInfo, bindlistcusLookupInfo, objCollateralInfo, objCard3YearInfo) {
    let connection;

    try {
        // Create connection to DB
        connection = await oracledb.getConnection(dbconfig);

        // result for insert
        let resultLoanDetailInfor, resultLoan5Year, resultLoan12MonInfor, resultCicrptMain, resultCreditCardInfor, resultVamcLoanInfo, resultloanAtt12monInfo, resultCreditContractInfo, resultCusLookupInfo, resultColletaralLoanSecuInfo, resultCard3yearInfo;

        const sysDtim = dateutil.timeStamp();
        const workID = getIdGetway.getIPGateWay();

        // 2.5.Insert Loan 5 Year
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
                autoCommit: false,
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

        // 2.1.Insert Loan detail infor
        if (!_.isEmpty(bindsLoanDetailInfor)) {
            const sqlInsertLoanDetailInfor = `INSERT INTO tb_loan_detail(NICE_SSIN_ID,
                SEQ,
                LOAD_DATE,
                LOAD_TIME,
                OGZ_CD,
                OGZ_NM,
                RCT_RPT_DATE,
                ST_LOAN_VND,
                ST_LOAN_USD,
                ST_NORM_LOAN_VND,
                ST_NORM_LOAN_USD,
                ST_CAT_LOAN_VND,
                ST_CAT_LOAN_USD,
                ST_FIX_LOAN_VND,
                ST_FIX_LOAN_USD,
                ST_CQ_LOAN_VND,
                ST_CQ_LOAN_USD,
                ST_EL_LOAN_VND,
                ST_EL_LOAN_USD,
                MT_LOAN_VND,
                MT_LOAN_UDS,
                MT_NORM_LOAN_VND,
                MT_NORM_LOAN_USD,
                MT_CAT_LOAN_VND,
                MT_CAT_LOAN_USD,
                MT_FIX_LOAN_VND,
                MT_FIX_LOAN_USD,
                MT_CQ_LOAN_VND,
                MT_CQ_LOAN_USD,
                MT_EL_LOAN_VND,
                MT_EL_LOAN_USD,
                LT_LOAN_VND,
                LT_LOAN_USD,
                LT_NORM_LOAN_VND,
                LT_NORM_LOAN_USD,
                LT_CAT_LOAN_VND,
                LT_CAT_LOAN_USD,
                LT_FIX_LOAN_VND,
                LT_FIX_LOAN_USD,
                LT_CQ_LOAN_VND,
                LT_CQ_LOAN_USD,
                LT_EL_LOAN_VND,
                LT_EL_LOAN_USD,
                OTR_LOAN_VND,
                OTR_LOAN_USD,
                OTR_NORM_LOAN_VND,
                OTR_NORM_LOAN_USD,
                OTR_CAT_LOAN_VND,
                OTR_CAT_LOAN_USD,
                OTR_FIX_LOAN_VND,
                OTR_FIX_LOAN_USD,
                OTR_CQ_LOAN_VND,
                OTR_CQ_LOAN_USD,
                OTR_EL_LOAN_VND,
                OTR_EL_LOAN_USD,
                OTR_BAD_LOAN_VND,
                OTR_BAD_LOAN_USD,
                OGZ_TOT_LOAN_VND,
                OGZ_TOT_LOAN_USD,
                SUM_TOT_OGZ_VND,
                SUM_TOT_OGZ_USD,
                SYS_DTIM,
                WORK_ID) values (:1,
                    :2,
                    :3,
                    :4,
                    :5,
                    :6,
                    :7,
                    :8,
                    :9,
                    :10,
                    :11,
                    :12,
                    :13,
                    :14,
                    :15,
                    :16,
                    :17,
                    :18,
                    :19,
                    :20,
                    :21,
                    :22,
                    :23,
                    :24,
                    :25,
                    :26,
                    :27,
                    :28,
                    :29,
                    :30,
                    :31,
                    :32,
                    :33,
                    :34,
                    :35,
                    :36,
                    :37,
                    :38,
                    :39,
                    :40,
                    :41,
                    :42,
                    :43,
                    :44,
                    :45,
                    :46,
                    :47,
                    :48,
                    :49,
                    :50,
                    :51,
                    :52,
                    :53,
                    :54,
                    :55,
                    :56,
                    :57,
                    :58,
                    :59,
                    :60,
                    :61,
                    :62,
                    :63)`;
            const options = {
                autoCommit: false,
                bindDefs: [
                    { type: oracledb.STRING, maxSize: 25 },
                    { type: oracledb.NUMBER, maxSize: 5 },
                    { type: oracledb.STRING, maxSize: 8 },
                    { type: oracledb.STRING, maxSize: 6 },
                    { type: oracledb.STRING, maxSize: 10 },
                    { type: oracledb.STRING, maxSize: 500 },
                    { type: oracledb.STRING, maxSize: 8 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.STRING, maxSize: 14 },
                    { type: oracledb.STRING, maxSize: 20 }
                ]
            };
            resultLoanDetailInfor = await connection.executeMany(sqlInsertLoanDetailInfor, bindsLoanDetailInfor, options);

        }
        console.log("Result resultLoanDetailInfor is:", resultLoanDetailInfor);

        //2.4. Loan 12 Mon infor
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
                autoCommit: false,
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

        // 2.6.Card 3 year info
        if (!_.isEmpty(objCard3YearInfo)) {

            const sqlInsertCard3year = `INSERT INTO TB_CRDT_CARD (NICE_SSIN_ID,
                CARD_ARR_PSN_YN,
                CARD_ARR_LGST_DAYS,
                CARD_ARR_CNT,                            
                SYS_DTIM,
                WORK_ID)VALUES (:NICE_SSIN_ID,
                :CARD_ARR_PSN_YN,
                :CARD_ARR_LGST_DAYS,
                :CARD_ARR_CNT, 
                :SYS_DTIM,
                :WORK_ID)`;

            resultCard3yearInfo = await connection.execute(
                // The statement to execute
                sqlInsertCard3year,
                {
                    NICE_SSIN_ID: { val: objCard3YearInfo.NICE_SSIN_ID },
                    CARD_ARR_PSN_YN: { val: objCard3YearInfo.CARD_ARR_PSN_YN },
                    CARD_ARR_LGST_DAYS: { val: objCard3YearInfo.CARD_ARR_LGST_DAYS },
                    CARD_ARR_CNT: { val: objCard3YearInfo.CARD_ARR_CNT },
                    SYS_DTIM: { val: sysDtim },
                    WORK_ID: { val: workID }
                },
                { autoCommit: false }
            );
        }
        console.log("update Card 3 Year infor updated::", resultCard3yearInfo);



        //2.7. Loan Attention 12 Mon infor
        if (!_.isEmpty(bindlistloanAtt12monInfo)) {
            const sqlInsertLoanAtt12MonInfor = `INSERT INTO TB_LOAN_12MON_PC (NICE_SSIN_ID,
            SEQ,
            BASE_MONTH,
            BASE_MONTH_CAT_LOAN_SUM,
            OGZ_NM,
            RPT_DATE,
            SYS_DTIM,
            WORK_ID)  values (:1, :2, :3, :4, :5, :6, :7, :8)`;

            const options = {
                autoCommit: false,
                bindDefs: [
                    { type: oracledb.STRING, maxSize: 25 },
                    { type: oracledb.NUMBER, maxSize: 5 },
                    { type: oracledb.STRING, maxSize: 6 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.STRING, maxSize: 2000 },
                    { type: oracledb.STRING, maxSize: 500 },
                    { type: oracledb.STRING, maxSize: 14 },
                    { type: oracledb.STRING, maxSize: 20 }
                ]
            };

            resultloanAtt12monInfo = await connection.executeMany(sqlInsertLoanAtt12MonInfor, bindlistloanAtt12monInfo, options);

        }
        console.log("Result bindlistloanAtt12monInfo is:", resultloanAtt12monInfo);

        // 2.2.Credit card infor
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
                { autoCommit: false }
            );
        }
        console.log("update Credit card infor updated::", resultCreditCardInfor);

        // 2.3.Vamc loan infor
        if (!_.isEmpty(bindlistVamcLoanInfo)) {
            const sqlInsertVamcLoanInfo = `INSERT INTO TB_VAMC_LOAN(NICE_SSIN_ID,
            SEQ,
            SELL_OGZ_NM,
            PRCP_BAL,
            DATA_RPT_DATE,
            SYS_DTIM,
            WORK_ID)  values (:1, :2, :3, :4, :5, :6, :7)`;

            const options = {
                autoCommit: false,
                bindDefs: [
                    { type: oracledb.STRING, maxSize: 25 },
                    { type: oracledb.NUMBER, maxSize: 5 },
                    { type: oracledb.STRING, maxSize: 500 },
                    { type: oracledb.NUMBER, maxSize: 27 },
                    { type: oracledb.STRING, maxSize: 8 },
                    { type: oracledb.STRING, maxSize: 14 },
                    { type: oracledb.STRING, maxSize: 20 }
                ]
            };

            resultVamcLoanInfo = await connection.executeMany(sqlInsertVamcLoanInfo, bindlistVamcLoanInfo, options);

        }
        console.log("Result VamcLoanInfo is :", resultVamcLoanInfo);

        //3.2. Credit contract infor
        if (!_.isEmpty(bindlistCreditContractInfo)) {
            const sqlInsertCreditContractInfo = `INSERT INTO TB_FINL_CTRT (NICE_SSIN_ID,
            SEQ,
            FIN_CTRT,
            OGZ_NM,
            CTRT_START_DATE,
            CTRT_END_DATE,
            SYS_DTIM,
            WORK_ID)  values (:1, :2, :3, :4, :5, :6, :7, :8)`;

            const options = {
                autoCommit: false,
                bindDefs: [
                    { type: oracledb.STRING, maxSize: 25 },
                    { type: oracledb.NUMBER, maxSize: 5 },
                    { type: oracledb.STRING, maxSize: 50 },
                    { type: oracledb.STRING, maxSize: 500 },
                    { type: oracledb.STRING, maxSize: 8 },
                    { type: oracledb.STRING, maxSize: 8 },
                    { type: oracledb.STRING, maxSize: 14 },
                    { type: oracledb.STRING, maxSize: 20 }
                ]
            };

            resultCreditContractInfo = await connection.executeMany(sqlInsertCreditContractInfo, bindlistCreditContractInfo, options);

        }
        console.log("Result bindlistCreditContractInfo is:", resultCreditContractInfo);

        //3.3. Customer looup infor
        if (!_.isEmpty(bindlistcusLookupInfo)) {
            const sqlInsertCusLookupInfo = `INSERT INTO TB_INQ_FINL_LST (NICE_SSIN_ID,
            SEQ,
            OGZ_NM_BRANCH_NM,
            OGZ_CD,
            INQ_GDS,
            INQ_DATE,
            INQ_TIME,
            SYS_DTIM,
            WORK_ID)  values (:1, :2, :3, :4, :5, :6, :7, :8, :9)`;

            const options = {
                autoCommit: false,
                bindDefs: [
                    { type: oracledb.STRING, maxSize: 25 },
                    { type: oracledb.NUMBER, maxSize: 5 },
                    { type: oracledb.STRING, maxSize: 500 },
                    { type: oracledb.STRING, maxSize: 50 },
                    { type: oracledb.STRING, maxSize: 50 },
                    { type: oracledb.STRING, maxSize: 8 },
                    { type: oracledb.STRING, maxSize: 6 },
                    { type: oracledb.STRING, maxSize: 14 },
                    { type: oracledb.STRING, maxSize: 20 }
                ]
            };

            resultCusLookupInfo = await connection.executeMany(sqlInsertCusLookupInfo, bindlistcusLookupInfo, options);

        }
        console.log("Result bindlistcusLookupInfo is:", resultCusLookupInfo);

        //3.1. Collateral loan security infor
        if (!_.isEmpty(objCollateralInfo)) {
            const sqlInsertCollateral = `INSERT INTO tb_loan_gurt (NICE_SSIN_ID,
                AST_SCRT_LOAN_GURT_AMT,
                SCRT_AST_CNT,
                SCRT_AST_OGZ_CNT,             
                SYS_DTIM,
                WORK_ID)  values (:NICE_SSIN_ID,
                    :AST_SCRT_LOAN_GURT_AMT,
                    :SCRT_AST_CNT,
                    :SCRT_AST_OGZ_CNT,             
                    :SYS_DTIM,
                    :WORK_ID)`;

            resultColletaralLoanSecuInfo = await connection.execute(
                // The statement to execute
                sqlInsertCollateral,
                {
                    NICE_SSIN_ID: { val: objCollateralInfo.NICE_SSIN_ID },
                    AST_SCRT_LOAN_GURT_AMT: { val: objCollateralInfo.AST_SCRT_LOAN_GURT_AMT },
                    SCRT_AST_CNT: { val: objCollateralInfo.SCRT_AST_CNT },
                    SCRT_AST_OGZ_CNT: { val: objCollateralInfo.SCRT_AST_OGZ_CNT },
                    SYS_DTIM: { val: sysDtim },
                    WORK_ID: { val: workID }
                },
                { autoCommit: false }
            );
        }
        console.log("Result ColletaralLoanSecuInfo is:", resultColletaralLoanSecuInfo);

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

        // Besure alway commit data in case crpt_main null
        let resultFinal = await connection.execute(`select 1 from dual`,
            {},
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT,
                autoCommit: true
            });
        console.log("resultFinal: " + resultFinal);

        return { resultLoanDetailInfor, resultLoan5Year, resultLoan12MonInfor, resultCicrptMain, resultCreditCardInfor, resultVamcLoanInfo, resultloanAtt12monInfo, resultCreditContractInfo, resultCusLookupInfo, resultColletaralLoanSecuInfo, resultCard3yearInfo };
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