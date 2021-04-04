const oracledb = require('oracledb');
var bcrypt = require('bcrypt');
const oracelService = require('../services/oracelQuery.service');
var _ = require('lodash');
const optionFormatObj = { outFormat: oracledb.OUT_FORMAT_OBJECT };
const optionAutoCommit = { autoCommit: true };
const dateFormat = require('dateformat');
const moment = require('moment');


exports.countTransaction = async function (req, res) {
    let fromDate = req.query.fromDate;
    let toDate = req.query.toDate;
    let result = [];
    // get All month between 2 date
    let d1 = new Date(fromDate);
    let d2 = new Date(toDate);

    let ydiff = d2.getYear() - d1.getYear();
    let mdiff = d2.getMonth() - d1.getMonth();

    let diff = (ydiff * 12 + mdiff);
    let arrAllMonth = []
    for (i = 0; i <= diff; i++) {
        if (i == 0)
            d1.setMonth(d1.getMonth());
        else
            d1.setMonth(d1.getMonth() + 1);

        arrAllMonth[i] = moment(d1).format("YYYYMM");
    }
    //checking
    if (arrAllMonth[0]) {
        let SQL =
            `   (SELECT COUNT (*) as RESULT  FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM )     
                UNION ALL
                (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '10')  
                UNION ALL
                (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD)  FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD IN ('20','21','22','23','24','29'))`
        for (const e of arrAllMonth) {
            let param = {
                INQ_DTIM: e + '%',
            }
            let count = await oracelService.queryAndReturnData(res, SQL, param, optionFormatObj);
            let object = {
                TOTAL: count[0].RESULT,
                COMPLETED: count[1].RESULT,
                FAILED: count[2].RESULT,
                DATE: e
            }
            await result.push(object);
        }
        return res.status(200).send(result);
    } else {
        return res.status(204).send([]);
    }
}