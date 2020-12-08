const oracledb = require('oracledb');
const dbconfig = require('../../shared/config/dbconfig');

const convertTime = require('../util/dateutil');
const niceGoodCode = require('../../shared/util/niceGoodCode');
const ipGateWay = require('../../shared/util/getIPGateWay');
const _ = require('lodash');

async function insertSCRPLOG(req) {
    let connection;

    try {
        let sql, result;

        let sysDim = convertTime.timeStamp();
        let producCode = niceGoodCode.niceProductCode(req.taskCode);
        let niceSessionKey = req.niceSessionKey;

        connection = await oracledb.getConnection(dbconfig);

        sql = `INSERT INTO TB_SCRPLOG(NICE_SSIN_ID, CUST_SSID_ID, CUST_CD, GDS_CD, CIC_GDS_CD, LOGIN_ID, LOGIN_PW, TAX_ID, NATL_ID, OLD_NATL_ID, PSPT_NO, CIC_ID, SCRP_STAT_CD, AGR_FG, INQ_DTIM, SCRP_REQ_DTIM , SYS_DTIM) 
        VALUES (:NICE_SSIN_ID, :CUST_SSID_ID, :CUST_CD, :GDS_CD, :CIC_GDS_CD, :LOGIN_ID, :LOGIN_PW, :TAX_ID, :NATL_ID, :OLD_NATL_ID, :PSPT_NO, :CIC_ID, :SCRP_STAT_CD, :AGR_FG, :INQ_DTIM, :SCRP_REQ_DTIM ,:SYS_DTIM)`;

        result = await connection.execute(
            // The statement to execute
            sql,
            {
                NICE_SSIN_ID: { val: producCode + niceSessionKey },
                CUST_SSID_ID: { val: req.fiSessionKey },
                CUST_CD: { val: req.fiCode },
                GDS_CD: { val: producCode },
                CIC_GDS_CD: { val: req.cicGoodCode },
                LOGIN_ID: { val: req.loginId },
                LOGIN_PW: { val: req.loginPw },
                TAX_ID: { val: req.taxCode },
                NATL_ID: { val: req.natId },
                OLD_NATL_ID: { val: req.oldNatId },
                PSPT_NO: { val: req.passportNumber },
                CIC_ID: { val: req.cicId },
                SCRP_STAT_CD: { val: '01' },
                AGR_FG: { val: req.infoProvConcent },
                INQ_DTIM: { val: req.inquiryDate },
                SCRP_REQ_DTIM: { val: sysDim },
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
        let _OTR_ID;

        let sysDim = convertTime.timeStamp();
        let gateway = ipGateWay.getIPGateWay(req);

        connection = await oracledb.getConnection(dbconfig);

        if (_.isEmpty(req.oldNatId))
            _OTR_ID = req.passportNumber;
        else if (_.isEmpty(req.passportNumber))
            _OTR_ID = req.oldNatId;
        else
            _OTR_ID = req.oldNatId + "," + req.passportNumber;

        sql = `INSERT INTO TB_INQLOG(INQ_LOG_ID, CUST_CD, TX_GB_CD, NATL_ID, TAX_ID, OTR_ID, CIC_ID, INQ_DTIM, AGR_FG, RSP_CD, SYS_DTIM, WORK_ID) 
        VALUES (:INQ_LOG_ID, :CUST_CD, :TX_GB_CD, :NATL_ID, :TAX_ID, :OTR_ID, :CIC_ID, :INQ_DTIM, :AGR_FG, :RSP_CD, :SYS_DTIM, :WORK_ID)`;

        result = await connection.execute(
            // The statement to execute
            sql,
            {
                INQ_LOG_ID: { val: req.niceSessionKey },
                CUST_CD: { val: req.fiCode },
                TX_GB_CD: { val: req.taskCode },
                NATL_ID: { val: req.natId },
                TAX_ID: { val: req.taxCode },
                OTR_ID: { val: _OTR_ID },
                CIC_ID: { val: req.cicId },
                INQ_DTIM: { val: req.inquiryDate },
                AGR_FG: { val: req.infoProvConcent },
                RSP_CD: { val: req.respCd },
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
        let resultScrpTranlog, resultCicrptMain, resultLoanDetailInfo, resultCreditCardInfo, resultVamcLoan, resultLoan12MInfo, resultNPL5YLoan, resultLoan12MCat, resultCollateral, resultFinancialContract, resultCusLookup, resultCard3Year;
        let outputCicrptMain, outputScrpTranlog, outputLoanDetailinfo, outputCreditCardInfo, outputVamcLoan, outputLoan12MInfo, outputNPL5YLoan, outputloan12MCat, outputCollateral, outputFinanCialContract, outputCusLookup, outputCard3year;
        var cmtLoanDetailInfo, cmtCreditCard, cmtVamcLoan, cmtLoan12MInfo, cmtNPL5YearLoan, cmtLoan12MCat, cmtFinancialContract, cmtCard3Year;

        //Connection db
        connection = await oracledb.getConnection(dbconfig);

        /*
        ** scrp tranlosg
        */
        let _fiSessionKey, _inquiryDate;
        if (_.isEmpty(req.fiSessionKey))
            _fiSessionKey = '%%';
        else
            _fiSessionKey = req.fiSessionKey;

        if (_.isEmpty(req.inquiryDate))
            _inquiryDate = '%%';
        else
            _inquiryDate = req.inquiryDate;

        let sqlScrpTranlog = `SELECT distinct a.R_ERRYN, a.S_DTIM, a.R_DTIM, a.S_REQ_STATUS, b.SCRP_STAT_CD, b.INQ_DTIM AS INQ_DTIM_SCRPLOG, b.SYS_DTIM
                                FROM TB_SCRP_TRLOG a inner join tb_scrplog b on  a.nice_ssin_id = b.nice_ssin_id
                                where a.NICE_SSIN_ID = :niceSessionKey
                                AND a.S_SVC_CD = 'B0003'
                                AND b.CUST_CD = :fiCode
                                AND (b.CUST_SSID_ID like :fiSessionKey or b.CUST_SSID_ID is null)
                                AND b.INQ_DTIM like :inquiryDate`;

        resultScrpTranlog = await connection.execute(
            // The statement to execute
            sqlScrpTranlog,
            {
                niceSessionKey: { val: req.niceSessionKey },
                fiCode: { val: req.fiCode },
                fiSessionKey: { val: _fiSessionKey },
                inquiryDate: { val: _inquiryDate }
            },
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            });

        console.log("resultScrpTranlog rows:", resultScrpTranlog.rows);
        outputScrpTranlog = resultScrpTranlog.rows;

        if (_.isEmpty(outputScrpTranlog))
            return {};
        else {

            /*
            ** cicrpt main
            */
            let sqlCicrptMain = `select a.inq_ogz_nm, a.inq_ogz_addr, a.inq_user_nm, a.inq_cd, a.inq_dtim, a.rpt_send_dtim, a.psn_nm, a.cic_id, a.psn_addr, a.natl_id, a.psn_comt, a.otr_iden_evd,
                              a.CARD_CMT, a.LOAN_CMT_DETAIL, a.VAMC_CMT, a.LOAN_CMT, a.LOAN_12MON_CMT, a.NPL_5YR_CMT, a.CAT_LOAN_12MON_CMT, a.FIN_CTRT_CMT, a.CARD_ARR_3YR_CMT
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
            if (_.isEmpty(outputCicrptMain))
                return {};

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

            /*
            ** 2.3. VAMC Loan infor
            */
            let sqlVamcLoan = `SELECT T.SELL_OGZ_NM, T.PRCP_BAL, T.DATA_RPT_DATE FROM TB_VAMC_LOAN T
                                 where T.NICE_SSIN_ID = :niceSessionKey`;

            resultVamcLoan = await connection.execute(
                // The statement to execute
                sqlVamcLoan,
                {
                    niceSessionKey: { val: req.niceSessionKey }
                },
                {
                    outFormat: oracledb.OUT_FORMAT_OBJECT
                });

            console.log("resultVamcLoan rows:", resultVamcLoan.rows);
            if (_.isEmpty(resultVamcLoan.rows)) {
                cmtVamcLoan = outputCicrptMain[0].VAMC_CMT;
            }
            else
                outputVamcLoan = resultVamcLoan.rows;

            /*
            ** 2.4. Loan 12Month infor
            */
            let sqlLoan12MInfo = `SELECT T.BASE_MONTH, T.BASE_MONTH_BAL, T.BASE_MONTH_CARD_BAL, T.BASE_MONTH_SUM FROM TB_LOAN_12MON T
                            where T.NICE_SSIN_ID = :niceSessionKey`;

            resultLoan12MInfo = await connection.execute(
                // The statement to execute
                sqlLoan12MInfo,
                {
                    niceSessionKey: { val: req.niceSessionKey }
                },
                {
                    outFormat: oracledb.OUT_FORMAT_OBJECT
                });

            console.log("resultLoan12MInfo rows:", resultLoan12MInfo.rows);
            if (_.isEmpty(resultLoan12MInfo.rows)) {
                cmtLoan12MInfo = outputCicrptMain[0].LOAN_12MON_CMT;
            }
            else
                outputLoan12MInfo = resultLoan12MInfo.rows;

            /*
            ** 2.5. NPL Loan 5 year infor
            */
            let sqlNPL5YLoan = `SELECT T.OGZ_NM_BRANCH_NM, T.RCT_OCR_DATE, T.DEBT_GRP, T.AMT_VND, T.AMT_USD FROM TB_NPL_5YR T
                            where T.NICE_SSIN_ID = :niceSessionKey`;

            resultNPL5YLoan = await connection.execute(
                // The statement to execute
                sqlNPL5YLoan,
                {
                    niceSessionKey: { val: req.niceSessionKey }
                },
                {
                    outFormat: oracledb.OUT_FORMAT_OBJECT
                });

            console.log("resultNPL5YLoan rows:", resultNPL5YLoan.rows);
            if (_.isEmpty(resultNPL5YLoan.rows)) {
                cmtNPL5YearLoan = outputCicrptMain[0].NPL_5YR_CMT;
            }
            else
                outputNPL5YLoan = resultNPL5YLoan.rows;

            /*
            ** 2.6. Card 3 year
            */
            let sqlCard3Year = `SELECT T.CARD_ARR_PSN_YN, T.CARD_ARR_LGST_DAYS, T.CARD_ARR_CNT FROM TB_CRDT_CARD_DEQ T
                            where T.NICE_SSIN_ID = :niceSessionKey`;

            resultCard3Year = await connection.execute(
                // The statement to execute
                sqlCard3Year,
                {
                    niceSessionKey: { val: req.niceSessionKey }
                },
                {
                    outFormat: oracledb.OUT_FORMAT_OBJECT
                });

            console.log("resultCard3Year rows:", resultCard3Year.rows);
            if (_.isEmpty(resultCard3Year.rows)) {
                cmtCard3Year = outputCicrptMain[0].CARD_ARR_3YR_CMT;
            } else
                outputCard3year = resultCard3Year.rows;

            /*
            ** 2.7.Loan 12M Cautiou infor
            */
            let sqlLoan12MCat = `SELECT T.BASE_MONTH, T.BASE_MONTH_CAT_LOAN_SUM, T.OGZ_NM, T.RPT_DATE FROM TB_LOAN_12MON_PC T
                            where T.NICE_SSIN_ID = :niceSessionKey`;

            resultLoan12MCat = await connection.execute(
                // The statement to execute
                sqlLoan12MCat,
                {
                    niceSessionKey: { val: req.niceSessionKey }
                },
                {
                    outFormat: oracledb.OUT_FORMAT_OBJECT
                });

            console.log("resultLoan12MCat rows:", resultLoan12MCat.rows);
            if (_.isEmpty(resultLoan12MCat.rows)) {
                cmtLoan12MCat = outputCicrptMain[0].CAT_LOAN_12MON_CMT;
            }
            else
                outputloan12MCat = resultLoan12MCat.rows;

            /*
            ** 3.1. Collateral infor
            */
            let sqlCollateral = `SELECT T.AST_SCRT_LOAN_GURT_AMT, T.SCRT_AST_CNT, T.SCRT_AST_OGZ_CNT FROM TB_LOAN_GURT T
                                where T.NICE_SSIN_ID = :niceSessionKey`;

            resultCollateral = await connection.execute(
                // The statement to execute
                sqlCollateral,
                {
                    niceSessionKey: { val: req.niceSessionKey }
                },
                {
                    outFormat: oracledb.OUT_FORMAT_OBJECT
                });

            console.log("resultCollateral rows:", resultCollateral.rows);
            outputCollateral = resultCollateral.rows;

            /*
            ** 3.2. Financial contract
            */
            let sqlFiancialContract = `SELECT T.FIN_CTRT, T.OGZ_NM, T.CTRT_START_DATE, T.CTRT_END_DATE FROM TB_FINL_CTRT T
                                    where T.NICE_SSIN_ID = :niceSessionKey`;

            resultFinancialContract = await connection.execute(
                // The statement to execute
                sqlFiancialContract,
                {
                    niceSessionKey: { val: req.niceSessionKey }
                },
                {
                    outFormat: oracledb.OUT_FORMAT_OBJECT
                });

            console.log("resultFinancialContract rows:", resultFinancialContract.rows);
            if (_.isEmpty(resultFinancialContract.rows)) {
                cmtFinancialContract = outputCicrptMain[0].FIN_CTRT_CMT;
            }
            else
                outputFinanCialContract = resultFinancialContract.rows;

            /*
            ** 3.3. Customer lookup infor
            */
            let sqlCusLookup = `SELECT T.OGZ_NM_BRANCH_NM, T.OGZ_CD, T.INQ_GDS, T.INQ_DATE, T.INQ_TIME FROM TB_INQ_FINL_LST T
                            where T.NICE_SSIN_ID = :niceSessionKey`;

            resultCusLookup = await connection.execute(
                // The statement to execute
                sqlCusLookup,
                {
                    niceSessionKey: { val: req.niceSessionKey }
                },
                {
                    outFormat: oracledb.OUT_FORMAT_OBJECT
                });

            console.log("resultCusLookup rows:", resultCusLookup.rows);
            outputCusLookup = resultCusLookup.rows;


            return { outputScrpTranlog, outputCicrptMain, outputLoanDetailinfo, outputCreditCardInfo, cmtLoanDetailInfo, cmtCreditCard, outputVamcLoan, cmtVamcLoan, outputLoan12MInfo, cmtLoan12MInfo, outputNPL5YLoan, cmtNPL5YearLoan, outputloan12MCat, cmtLoan12MCat, outputCollateral, outputFinanCialContract, cmtFinancialContract, outputCusLookup, outputCard3year, cmtCard3Year };
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

async function selectScrapingStatusCodeSCRPLOG(req) {
    let connection;

    try {
        //Connection db
        connection = await oracledb.getConnection(dbconfig);

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

        let sqlCusLookup = `SELECT T.SCRP_STAT_CD, T.RSP_CD FROM TB_SCRPLOG T
                            where T.NICE_SSIN_ID = :niceSessionKey
                            AND T.CUST_CD = :fiCode
                            AND T.CUST_SSID_ID like :fiSessionKey
                            AND T.INQ_DTIM like :inquiryDate
                            AND T.GDS_CD = :gdscd`;

        let result = await connection.execute(
            // The statement to execute
            sqlCusLookup,
            {
                niceSessionKey: { val: req.niceSessionKey },
                fiCode: { val: req.fiCode },
                fiSessionKey: { val: _fiSessionKey },
                inquiryDate: { val: _inquiryDate },
                gdscd: { val: gdscd }
            },
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            });
        console.log("selectScrapingStatusCodeSCRPLOG rows:", result.rows);

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

async function selectProcStatus(req) {
    let connection;

    try {
        //Connection db
        connection = await oracledb.getConnection(dbconfig);
        let outputResult, totalCount;

        let _scrapingStatusCode;
        if (_.isEmpty(req.scrapingStatusCode))
            _scrapingStatusCode = '%%';
        else
            _scrapingStatusCode = req.scrapingStatusCode;

        let sql = `SELECT T.NICE_SSIN_ID, T.CUST_SSID_ID, T.CUST_CD, T.GDS_CD, T.INQ_DTIM, T.SCRP_STAT_CD, T.RSP_CD, T.CIC_GDS_CD FROM TB_SCRPLOG T
                    where to_date(T.INQ_DTIM , 'yyyymmdd') between to_date(:inqDtimFrom, 'yyyymmdd') and to_date (:inqDtimTo, 'yyyymmdd')
                        and T.CUST_CD =: fiCode
                        and (T.SCRP_STAT_CD like :scrapingStatusCode or T.SCRP_STAT_CD is null)
                        order by T.INQ_DTIM
                        OFFSET :offset ROWS FETCH NEXT :maxnumrows ROWS ONLY`;

        let sqlCount = `SELECT count(*) as TOTAL FROM TB_SCRPLOG T
                    where to_date(T.INQ_DTIM , 'yyyymmdd') between to_date(:inqDtimFrom, 'yyyymmdd') and to_date (:inqDtimTo, 'yyyymmdd')
                        and T.CUST_CD =: fiCode
                        and (T.SCRP_STAT_CD like :scrapingStatusCode or T.SCRP_STAT_CD is null)`;
        // execute qeury
        let result = await connection.execute(
            // The statement to execute
            sql,
            {
                inqDtimFrom: { val: req.searchDateFrom },
                inqDtimTo: { val: req.searchDateTo },
                fiCode: { val: req.fiCode },
                offset: { val: req.offset },
                scrapingStatusCode: { val: _scrapingStatusCode },
                maxnumrows: { val: req.maxnumrows }
            },
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            });
        console.log("selectProcStatus rows:", result.rows);
        outputResult = result.rows;

        // Execute count total records
        let resultCount = await connection.execute(
            // The statement to execute
            sqlCount,
            {
                inqDtimFrom: { val: req.searchDateFrom },
                inqDtimTo: { val: req.searchDateTo },
                fiCode: { val: req.fiCode },
                scrapingStatusCode: { val: _scrapingStatusCode }
            },
            {
                outFormat: oracledb.OUT_FORMAT_OBJECT
            });
        totalCount = resultCount.rows;


        return { outputResult, totalCount };
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

async function insertDataZaloINQLOG(req) {
    let connection;

    try {
        let sql, result;
        let sysDim = convertTime.timeStamp();
        let gateway = ipGateWay.getIPGateWay(req);

        connection = await oracledb.getConnection(dbconfig);

        sql = `INSERT INTO TB_INQLOG(INQ_LOG_ID, NICE_SSIN_ID ,CUST_CD, TX_GB_CD, NATL_ID, TAX_ID, OTR_ID, CIC_ID, INQ_DTIM, AGR_FG, RSP_CD, SYS_DTIM, WORK_ID, TEL_NO_MOBILE) 
        VALUES (:INQ_LOG_ID, :NICE_SSIN_ID ,:CUST_CD, :TX_GB_CD, :NATL_ID, :TAX_ID, :OTR_ID, :CIC_ID, :INQ_DTIM, :AGR_FG, :RSP_CD, :SYS_DTIM, :WORK_ID, :TEL_NO_MOBILE)`;

        result = await connection.execute(
            // The statement to execute
            sql,
            {
                INQ_LOG_ID: { val: req.inqLogId },
                NICE_SSIN_ID: { val: req.niceSessionKey},
                CUST_CD: { val: req.fiCode },
                TX_GB_CD: { val: req.taskCode },
                NATL_ID: { val: req.natId },
                TAX_ID: { val: req.taxCode },
                OTR_ID: { val: req.otrId },
                CIC_ID: { val: req.cicId },
                INQ_DTIM: { val: req.inquiryDate },
                AGR_FG: { val: req.infoProvConcent },
                RSP_CD: { val: req.respCd },
                SYS_DTIM: { val: sysDim },
                WORK_ID: { val: gateway },
                TEL_NO_MOBILE: { val: req.mobilePhoneNumber }
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

async function insertDataZaloToSCRPLOG(req) {
    let connection;

    try {
        let sql, result;
        connection = await oracledb.getConnection(dbconfig);

        sql = `INSERT INTO TB_SCRPLOG(NICE_SSIN_ID, CUST_SSID_ID, CUST_CD, GDS_CD, TEL_NO_MOBILE, INQ_DTIM, AGR_FG, SYS_DTIM, WORK_ID) 
        VALUES (:NICE_SSIN_ID, :CUST_SSID_ID, :CUST_CD, :GDS_CD, :TEL_NO_MOBILE, :INQ_DTIM, :AGR_FG, :SYS_DTIM, :WORK_ID)`;

        result = await connection.execute(
            // The statement to execute
            sql,
            {
                NICE_SSIN_ID: req.niceSessionKey ,
                CUST_SSID_ID: req.fiSessionKey ,
                CUST_CD: req.custCd ,
                GDS_CD: req.gdsCD,
                TEL_NO_MOBILE: req.mobilePhoneNumber,
                INQ_DTIM: req.inqDt,
                AGR_FG: req.agrFG,
                SYS_DTIM: req.sysDt,
                WORK_ID: req.workID
            },
            { autoCommit: true }
        );
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

async function updateRspCdScrapLogAfterGetResult(niceSessionKey, RspCd) {
    let connection;

    try {
        let sql, result;

        connection = await oracledb.getConnection(dbconfig);


        sql = `UPDATE TB_SCRPLOG
                SET RSP_CD = :RSP_CD
                WHERE NICE_SSIN_ID = :NICE_SSIN_ID`;

        result = await connection.execute(
            // The statement to execute
            sql,
            {
                NICE_SSIN_ID: { val: niceSessionKey },
                RSP_CD: { val: RspCd }
            },
            { autoCommit: true },
        );
        console.log('updateRspCdScrapLogAfterGetResult: ',result.rowsAffected)
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

async function insertDataZaloToExtScore(req) {
    let connection;

    try {
        let sql, result;
        connection = await oracledb.getConnection(dbconfig);

        sql = `INSERT INTO TB_EXT_SCORE(NICE_SSIN_ID, TEL_NO_MOBILE, SCORE_CD, SCORE_EXT, CUST_GB, EXT_REQ_ID,SYSTEM_DTIM) 
        VALUES (:NICE_SSIN_ID, :TEL_NO_MOBILE, :SCORE_CD, :SCORE_EXT, :CUST_GB, :EXT_REQ_ID, :SYSTEM_DTIM)`;

        result = await connection.execute(
            // The statement to execute
            sql,
            {
                NICE_SSIN_ID: req.niceSessionKey ,
                TEL_NO_MOBILE: req.mobilePhoneNumber ,
                SCORE_CD: req.scoreCode ,
                SCORE_EXT: req.scoreEx.toString(),
                CUST_GB: req.custGb,
                EXT_REQ_ID: req.requestId,
                SYSTEM_DTIM: req.sysDt,
            },
            { autoCommit: true }
        );
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

async function insertDataRiskScoreToINQLOG(req) {
    let connection;

    try {
        let sql, result;
        let sysDim = convertTime.timeStamp();
        let gateway = ipGateWay.getIPGateWay(req);

        connection = await oracledb.getConnection(dbconfig);

        sql = `INSERT INTO TB_INQLOG(INQ_LOG_ID, NICE_SSIN_ID ,CUST_CD, TX_GB_CD, NATL_ID, TAX_ID, OTR_ID, CIC_ID, INQ_DTIM, AGR_FG, RSP_CD, SYS_DTIM, WORK_ID, TEL_NO_MOBILE) 
        VALUES (:INQ_LOG_ID, :NICE_SSIN_ID ,:CUST_CD, :TX_GB_CD, :NATL_ID, :TAX_ID, :OTR_ID, :CIC_ID, :INQ_DTIM, :AGR_FG, :RSP_CD, :SYS_DTIM, :WORK_ID, :TEL_NO_MOBILE)`;

        result = await connection.execute(
            // The statement to execute
            sql,
            {
                INQ_LOG_ID: { val: req.inqLogId },
                NICE_SSIN_ID: { val: req.niceSessionKey},
                CUST_CD: { val: req.fiCode },
                TX_GB_CD: { val: req.taskCode },
                NATL_ID: { val: req.natId },
                TAX_ID: { val: req.taxCode },
                OTR_ID: { val: req.otrId },
                CIC_ID: { val: req.cicId },
                INQ_DTIM: { val: req.inquiryDate },
                AGR_FG: { val: req.infoProvConcent },
                RSP_CD: { val: req.respCd },
                SYS_DTIM: { val: sysDim },
                WORK_ID: { val: gateway },
                TEL_NO_MOBILE: { val: req.mobilePhoneNumber }
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

async function insertDataRiskScoreToSCRPLOG(req) {
    let connection;

    try {
        let sql, result;
        connection = await oracledb.getConnection(dbconfig);

        sql = `INSERT INTO TB_SCRPLOG(NICE_SSIN_ID, CUST_SSID_ID, CUST_CD, GDS_CD, TEL_NO_MOBILE, INQ_DTIM, AGR_FG, SYS_DTIM, WORK_ID,NATL_ID) 
        VALUES (:NICE_SSIN_ID, :CUST_SSID_ID, :CUST_CD, :GDS_CD, :TEL_NO_MOBILE, :INQ_DTIM, :AGR_FG, :SYS_DTIM, :WORK_ID, :NATL_ID)`;

        result = await connection.execute(
            // The statement to execute
            sql,
            {
                NICE_SSIN_ID: req.niceSessionKey ,
                CUST_SSID_ID: req.fiSessionKey ,
                CUST_CD: req.custCd ,
                GDS_CD: req.gdsCD,
                TEL_NO_MOBILE: req.mobilePhoneNumber,
                INQ_DTIM: req.inqDt,
                AGR_FG: req.agrFG,
                SYS_DTIM: req.sysDt,
                WORK_ID: req.workID,
                NATL_ID: req.natId
            },
            { autoCommit: true }
        );
        console.log('insertDataRiskScoreToSCRPLOG: ', result.rowsAffected)
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

async function insertDataRiskScoreToExtScore(req) {
    let connection;

    try {
        let sql, result;
        connection = await oracledb.getConnection(dbconfig);

        sql = `INSERT INTO TB_EXT_SCORE(NICE_SSIN_ID, TEL_NO_MOBILE, SCORE_CD, SCORE_EXT, CUST_GB, EXT_REQ_ID,SYSTEM_DTIM,GRADE,BASE_DATE,RSK_GLM_PROB,RSK_RF_PROB,RSK_GRB_PROB,RSK_ESB_PROB ) 
        VALUES (:NICE_SSIN_ID, :TEL_NO_MOBILE, :SCORE_CD, :SCORE_EXT, :CUST_GB, :EXT_REQ_ID, :SYSTEM_DTIM, :GRADE, :BASE_DATE, :RSK_GLM_PROB, :RSK_RF_PROB, :RSK_GRB_PROB, :RSK_ESB_PROB)`;

        result = await connection.execute(
            // The statement to execute
            sql,
            {
                NICE_SSIN_ID: req.niceSessionKey ,
                TEL_NO_MOBILE: req.mobilePhoneNumber ,
                SCORE_CD: req.scoreCode ,
                SCORE_EXT: req.scoreEx.toString(),
                CUST_GB: req.custGb,
                EXT_REQ_ID: req.requestId,
                SYSTEM_DTIM: req.sysDt,
                GRADE: req.grade,
                BASE_DATE: req.baseDate,
                RSK_GLM_PROB: req.RSK_GLM_PROB.toString(),
                RSK_RF_PROB: req.RSK_RF_PROB.toString(),
                RSK_GRB_PROB: req.RSK_GRB_PROB.toString(),
                RSK_ESB_PROB: req.RSK_ESB_PROB.toString(),
            },
            { autoCommit: true }
        );
        console.log('insertDataRiskScoreToExtScore: ',result.rowsAffected)
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

async function insertDataToINQLOG(req) {
    let connection;

    try {
        let sql, result;
        let sysDim = convertTime.timeStamp();
        let gateway = ipGateWay.getIPGateWay(req);

        connection = await oracledb.getConnection(dbconfig);

        sql = `INSERT INTO TB_INQLOG(INQ_LOG_ID, NICE_SSIN_ID ,CUST_CD, TX_GB_CD, NATL_ID, TAX_ID, OTR_ID, CIC_ID, INQ_DTIM, AGR_FG, RSP_CD, SYS_DTIM, WORK_ID, TEL_NO_MOBILE) 
        VALUES (:INQ_LOG_ID, :NICE_SSIN_ID ,:CUST_CD, :TX_GB_CD, :NATL_ID, :TAX_ID, :OTR_ID, :CIC_ID, :INQ_DTIM, :AGR_FG, :RSP_CD, :SYS_DTIM, :WORK_ID, :TEL_NO_MOBILE)`;

        result = await connection.execute(
            // The statement to execute
            sql,
            {
                INQ_LOG_ID: { val: req.inqLogId },
                NICE_SSIN_ID: { val: req.niceSessionKey},
                CUST_CD: { val: req.fiCode },
                TX_GB_CD: { val: req.taskCode },
                NATL_ID: { val: req.natId },
                TAX_ID: { val: req.taxCode },
                OTR_ID: { val: req.otrId },
                CIC_ID: { val: req.cicId },
                INQ_DTIM: { val: req.inquiryDate },
                AGR_FG: { val: req.infoProvConcent },
                RSP_CD: { val: req.respCd },
                SYS_DTIM: { val: sysDim },
                WORK_ID: { val: gateway },
                TEL_NO_MOBILE: { val: req.mobilePhoneNumber }
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

async function insertDataFptIdToSCRPLOG(req) {
    let connection;

    try {
        let sql, result;
        connection = await oracledb.getConnection(dbconfig);

        sql = `INSERT INTO TB_SCRPLOG(NICE_SSIN_ID, CUST_SSID_ID, CUST_CD, GDS_CD, INQ_DTIM, AGR_FG, SYS_DTIM, WORK_ID) 
        VALUES (:NICE_SSIN_ID, :CUST_SSID_ID, :CUST_CD, :GDS_CD, :INQ_DTIM, :AGR_FG, :SYS_DTIM, :WORK_ID)`;

        result = await connection.execute(
            // The statement to execute
            sql,
            {
                NICE_SSIN_ID: req.niceSessionKey ,
                CUST_SSID_ID: req.fiSessionKey ,
                CUST_CD: req.custCd ,
                GDS_CD: req.gdsCD,
                INQ_DTIM: req.inqDt,
                AGR_FG: req.agrFG,
                SYS_DTIM: req.sysDt,
                WORK_ID: req.workID,
            },
            { autoCommit: true }
        );
        console.log('insertDataFptIdToSCRPLOG: ', result.rowsAffected)
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

module.exports.insertSCRPLOG = insertSCRPLOG;
module.exports.insertINQLOG = insertINQLOG;
module.exports.selectCICS11aRSLT = selectCICS11aRSLT;
module.exports.selectScrapingStatusCodeSCRPLOG = selectScrapingStatusCodeSCRPLOG;
module.exports.selectProcStatus = selectProcStatus;
module.exports.insertDataZaloINQLOG = insertDataZaloINQLOG;
module.exports.insertDataZaloToSCRPLOG = insertDataZaloToSCRPLOG;
module.exports.updateRspCdScrapLogAfterGetResult = updateRspCdScrapLogAfterGetResult;
module.exports.insertDataZaloToExtScore = insertDataZaloToExtScore;
module.exports.insertDataRiskScoreToINQLOG = insertDataRiskScoreToINQLOG;
module.exports.insertDataRiskScoreToSCRPLOG = insertDataRiskScoreToSCRPLOG;
module.exports.insertDataRiskScoreToExtScore = insertDataRiskScoreToExtScore;
module.exports.insertDataToINQLOG = insertDataToINQLOG;
module.exports.insertDataFptIdToSCRPLOG = insertDataFptIdToSCRPLOG;
