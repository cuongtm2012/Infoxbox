const oracledb = require('oracledb');
const dbconfig = require('../../shared/config/dbconfig');
const _ = require('lodash');

async function selectCicS37DetailReport(req) {
    let connection;

    try {
        //Connection db
        connection = await oracledb.getConnection();

        let resultScrpTranlog, outputScrpTranlog, resultS37Detail, outputS37Detail;

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
                               AND a.S_SVC_CD = 'B1003'
                               AND b.CUST_CD = :fiCode
                               AND b.CUST_SSID_ID like :fiSessionKey
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

        console.log("S37 resultScrpTranlog rows:", resultScrpTranlog.rows);
        outputScrpTranlog = resultScrpTranlog.rows;

        if (_.isEmpty(outputScrpTranlog))
            return {};
        else {
            /*
           ** cicrpt main, s37 detail
           */
            let sql = `select  a.psn_nm, a.cic_id, a.psn_addr, b.rltn_fi_cnt,b.cts_loan_yn, b.bad_loan_yn, b.base_date, b.ews_grd, b.rpt_cmt
                                 from tb_cicrpt_main a INNER JOIN tb_s37_detail b on a.nice_ssin_id = b.nice_ssin_id
                                 where a.NICE_SSIN_ID = :niceSessionKey`;

            resultS37Detail = await connection.execute(
                // The statement to execute
                sql,
                {
                    niceSessionKey: { val: req.niceSessionKey }
                },
                {
                    outFormat: oracledb.OUT_FORMAT_OBJECT
                });

            console.log("resultS37Detail rows:", resultS37Detail.rows);
            outputS37Detail = resultS37Detail.rows;
        }

        return { outputScrpTranlog, outputS37Detail };
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

module.exports.selectCicS37DetailReport = selectCicS37DetailReport;