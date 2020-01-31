const oracledb = require('oracledb');
const oracelService = require('../services/oracelQuery.service');
var _ = require('lodash');

const optionFormatObj = { outFormat: oracledb.OUT_FORMAT_OBJECT };
const optionAutoCommit = { autoCommit: true };

exports.viewHistoryCICReport = async function (req, res) {
    var SQL_SELECT = `SELECT a.NICE_SSIN_ID as NICE_SSIN_ID, b.CUST_CD as ORGAN_CD, c.CUST_NM as ORGAN_NM, c.PRT_CUST_CD as PRODUCT_NUMBER,
    a.S_CIC_NO as CIC_NUMBER, a.S_INQ_DT1 as INQUIRY_DATE, a.S_REQ_STATUS as STATUS_CD , b.RSP_CD as RES_CD, to_char(to_date(a.S_DTIM, 'YYYY/MM/DD HH:MI:SS'),'mm/dd/yyyy hh:mi:ss') as OPERATION_DATE `;
    var SQL_FROM = `FROM TB_SCRP_TRLOG a `;
    var INNER_JOIN_TB_SCRPLOG = 'INNER JOIN TB_SCRPLOG b ON a.NICE_SSIN_ID  = b.NICE_SSIN_ID ';
    var INNER_JOIN_TB_ITCUST = 'INNER JOIN TB_ITCUST c ON b.CUST_CD  = c.CUST_CD AND b.SYS_DTIM = c.SYS_DTIM ';
    let sql = SQL_SELECT + SQL_FROM + INNER_JOIN_TB_SCRPLOG + INNER_JOIN_TB_ITCUST;
    let params = {};
    oracelService.queryOracel(res, sql, params, optionFormatObj)
};


exports.viewDetailInfoCICReport = async function (req, res) {
    var nice_ssin_id = req.query.nice_ssin_id;
    var SQL_SELECT = `SELECT a.NICE_SSIN_ID as NICE_SSIN_ID, b.CUST_SSID_ID as ORGANIZE_SESSION_NUMBER, c.CUST_CD as ORGANIZE_CODE, c.CUST_NM as ORGANIZE_NM, c.PRT_CUST_CD as PRT_CD,
    b.CUST_ID as CUST_ID, a.S_TAX_NO as TAX_CD, b.OTR_ID as OTHER_ID ,b.AGR_FG as CONSENT_TO_PROVIDING ,
    b.CUST_CD as ORGAN_CD, c.CUST_NM as ORGAN_NM, c.PRT_CUST_CD as PRODUCT_NUMBER,
    a.S_CIC_NO as CIC_NUMBER, a.S_INQ_DT1 as INQUIRY_DATE, a.S_REQ_STATUS as STATUS_CD , b.RSP_CD as RES_CD, to_char(to_date(a.S_DTIM, 'YYYY/MM/DD HH:MI:SS'),'mm/dd/yyyy hh:mi:ss') as OPERATION_DATE `;
    var SQL_FROM = `FROM TB_SCRP_TRLOG a `;
    var INNER_JOIN_TB_SCRPLOG = 'INNER JOIN TB_SCRPLOG b ON a.NICE_SSIN_ID  = b.NICE_SSIN_ID ';
    var INNER_JOIN_TB_ITCUST = 'INNER JOIN TB_ITCUST c ON b.CUST_CD  = c.CUST_CD  AND b.SYS_DTIM = c.SYS_DTIM  ';
    var WHERE = 'WHERE a.NICE_SSIN_ID = :nice_ssin_id ';

    let sql = SQL_SELECT + SQL_FROM + INNER_JOIN_TB_SCRPLOG + INNER_JOIN_TB_ITCUST + WHERE;
    let params = {
        nice_ssin_id: { val: nice_ssin_id }
    };
    oracelService.queryOracel(res, sql, params, optionFormatObj)
};



