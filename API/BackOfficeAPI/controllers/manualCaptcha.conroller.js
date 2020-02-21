const oracledb = require('oracledb');
const oracelService = require('../services/oracelQuery.service');
var _ = require('lodash');

const optionFormatObj = { outFormat: oracledb.OUT_FORMAT_OBJECT };
const optionAutoCommit = { autoCommit: true };

exports.getListScrpLog = async function (req, res) {
    var SQL_SELECT = `SELECT
    TB_SCRPLOG.NICE_SSIN_ID as NICE_SSIN_ID, 
    TB_SCRPLOG.NATL_ID as NATL_ID,
    TB_SCRPLOG.OLD_NATL_ID as OLD_NATL_ID,
    TB_SCRPLOG.PSPT_NO as PSPT_NO,
    TB_SCRP_TRLOG.S_CIC_NO as S_CIC_NO, 
    TB_SCRP_TRLOG.S_USER_ID as S_USER_ID, 
    TB_SCRP_TRLOG.S_USER_PW as S_USER_PW, 
    TB_SCRPLOG.INQ_DTIM as INQ_DTIM `;
    var SQL_FROM = 'FROM TB_SCRP_TRLOG ';
    var SQL_JOIN = 'INNER JOIN TB_SCRPLOG ON TB_SCRPLOG.NICE_SSIN_ID = TB_SCRP_TRLOG.NICE_SSIN_ID ';
    var SQL_WHERE = `WHERE TB_SCRPLOG.SCRP_STAT_CD = '04' AND TB_SCRPLOG.SCRP_MOD_CD = '00' AND TB_SCRP_TRLOG.S_SVC_CD = 'B0002'
            and TB_SCRPLOG.AGR_FG = 'Y'  `;
    var SQL_ORDER_BY = `ORDER BY CASE WHEN TB_SCRPLOG.SYS_DTIM IS NOT NULL THEN 1 ELSE 0 END DESC, TB_SCRPLOG.SYS_DTIM DESC `;
    let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY;
    let param = {};
    return oracelService.queryOracel(res, sql, param, optionFormatObj);
};
