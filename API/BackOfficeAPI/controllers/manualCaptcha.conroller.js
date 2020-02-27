const oracledb = require('oracledb');
const oracelService = require('../services/oracelQuery.service');
var _ = require('lodash');

const optionFormatObj = { outFormat: oracledb.OUT_FORMAT_OBJECT };
const optionAutoCommit = { autoCommit: true };

exports.getListB003 = async function (req, res) {
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
            and TB_SCRPLOG.AGR_FG = 'Y' and TB_SCRPLOG.GDS_CD = 'S1001' `;
    var SQL_ORDER_BY = `ORDER BY CASE WHEN TB_SCRPLOG.SYS_DTIM IS NOT NULL THEN 1 ELSE 0 END DESC, TB_SCRPLOG.SYS_DTIM DESC `;
    let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY;
    let param = {};
    return oracelService.queryOracel(res, sql, param, optionFormatObj);
};

exports.getListForB001 = async function (req, res) {
    var niceSsID = req.query.niceSsID;
    var currentLocation = req.query.currentLocation;
    var limitRow = req.query.limitRow;
    var SQL_SELECT = `SELECT
    TB_ITCUST.CUST_GB as CUST_GB, 
    TB_ITCUST.CUST_CD as CUST_CD, 
    TB_ITCUST.CUST_NM as CUST_NM, 
    TB_ITCODE.CODE_NM as CODE_NM,
    TB_SCRPLOG.NICE_SSIN_ID as NICE_SSIN_ID,
    TB_SCRPLOG.CUST_SSID_ID as CUST_SSID_ID,
    TB_SCRPLOG.LOGIN_ID as LOGIN_ID,
    TB_SCRPLOG.LOGIN_PW as LOGIN_PW,
    TB_SCRPLOG.GDS_CD as GDS_CD,
    TB_SCRPLOG.LOGIN_ID as LOGIN_ID,
    TB_SCRPLOG.LOGIN_PW as LOGIN_PW,
    TB_SCRPLOG.NATL_ID as NATL_ID,
    TB_SCRPLOG.OLD_NATL_ID as OLD_NATL_ID,
    TB_SCRPLOG.CUST_ID as CUST_ID,
    TB_SCRPLOG.TAX_ID as TAX_ID,
    TB_SCRPLOG.PSPT_NO as PSPT_NO,
    TB_SCRPLOG.OTR_ID as OTR_ID,
    TB_SCRPLOG.CIC_ID as CIC_ID,
    TB_SCRPLOG.CIC_USED_ID as CIC_USED_ID,
    TB_SCRPLOG.CIC_GDS_CD as CIC_GDS_CD,
    TB_SCRPLOG.PSN_NM as PSN_NM,
    TB_SCRPLOG.TEL_NO_MOBILE as TEL_NO_MOBILE,
    TB_SCRPLOG.INQ_DTIM as INQ_DTIM,
    TB_SCRPLOG.AGR_FG as AGR_FG,
    TB_SCRPLOG.SCRP_STAT_CD as SCRP_STAT_CD,
    TB_SCRPLOG.RSP_CD as RSP_CD,
    TB_SCRPLOG.RSP_CD as RSP_CD,
    TB_SCRPLOG.SYS_DTIM as SYS_DTIM,
    TB_SCRP_TRLOG.S_INQ_DT1 as S_INQ_DT1,
    TB_SCRP_TRLOG.S_INQ_DT2 as S_INQ_DT2,
    TB_SCRPLOG.INQ_DTIM as INQ_DTIM,
    TB_SCRPLOG.SCRP_REQ_DTIM as SCRP_REQ_DTIM,
    TB_SCRPLOG.WORK_ID as WORK_ID  `;
    var SQL_FROM = 'FROM TB_SCRPLOG ';
    var SQL_JOIN = 'LEFT JOIN TB_ITCUST ON TB_SCRPLOG.CUST_CD = TB_ITCUST.CUST_CD LEFT JOIN TB_ITCODE ON TB_SCRPLOG.GDS_CD = TB_ITCODE.CODE LEFT JOIN TB_SCRP_TRLOG ON TB_SCRPLOG.NICE_SSIN_ID = TB_SCRP_TRLOG.NICE_SSIN_ID ';
    var SQL_ORDER_BY = `ORDER BY CASE WHEN TB_SCRPLOG.INQ_DTIM IS NOT NULL THEN 1 ELSE 0 END DESC, TB_SCRPLOG.INQ_DTIM DESC `;
    var SQL_LIMIT = 'OFFSET :currentLocation ROWS FETCH NEXT :limitRow ROWS ONLY ';

    if(_.isEmpty(niceSsID) ) {
        let SQL_WHERE = ` WHERE TB_SCRPLOG.GDS_CD = 'S1002' AND TB_SCRPLOG.SCRP_STAT_CD = '01'  `;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            currentLocation,
            limitRow
        };
        return oracelService.queryOracel(res, sql, param, optionFormatObj);
    }

    if( niceSsID) {
        let SQL_WHERE = `WHERE TB_SCRPLOG.NICE_SSIN_ID LIKE :niceSsID AND TB_SCRPLOG.GDS_CD = 'S1002' AND TB_SCRPLOG.SCRP_STAT_CD = '01' `;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            niceSsID,
            currentLocation,
            limitRow
        };
        return oracelService.queryOracel(res, sql, param, optionFormatObj);
    }
};
