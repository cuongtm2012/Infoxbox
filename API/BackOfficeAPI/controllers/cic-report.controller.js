const oracledb = require('oracledb');
const oracelService = require('../services/oracelQuery.service');
var _ = require('lodash');

const optionFormatObj = { outFormat: oracledb.OUT_FORMAT_OBJECT };
const optionAutoCommit = { autoCommit: true };

exports.viewHistoryCICReport = async function (req, res) {
    var SQL_SELECT = `SELECT a.SCRP_LOG_ID as SCRP_LOG_ID ,a.NICE_SSIN_ID as NICE_SSIN_ID, b.CUST_CD as ORGAN_CD, c.CUST_NM as ORGAN_NM, c.PRT_CUST_CD as PRODUCT_NUMBER,
    a.S_CIC_NO as CIC_NUMBER, a.S_INQ_DT1 as INQUIRY_DATE, a.S_REQ_STATUS as STATUS_CD , b.RSP_CD as RES_CD, to_char(to_date(a.S_DTIM, 'YYYY/MM/DD HH:MI:SS'),'mm/dd/yyyy hh:mi:ss') as OPERATION_DATE `;
    var SQL_FROM = `FROM TB_SCRP_TRLOG a `;
    var INNER_JOIN_TB_SCRPLOG = 'INNER JOIN TB_SCRPLOG b ON a.NICE_SSIN_ID  = b.NICE_SSIN_ID ';
    var INNER_JOIN_TB_ITCUST = 'INNER JOIN TB_ITCUST c ON b.CUST_CD  = c.CUST_CD AND b.SYS_DTIM = c.SYS_DTIM ';
    let sql = SQL_SELECT + SQL_FROM + INNER_JOIN_TB_SCRPLOG + INNER_JOIN_TB_ITCUST;
    let params = {};
    oracelService.queryOracel(res, sql, params, optionFormatObj)
};


exports.viewDetailInfoCICReport = async function (req, res) {
    var scrpLogID = req.query.scrpLogID;
    var SQL_SELECT = `SELECT a.NICE_SSIN_ID as NICE_SSIN_ID, b.CUST_SSID_ID as ORGANIZE_SESSION_NUMBER, c.CUST_CD as ORGANIZE_CODE, c.CUST_NM as ORGANIZE_NM, c.PRT_CUST_CD as PRT_CD,
    b.CUST_ID as CUST_ID, a.S_TAX_NO as TAX_CD, b.OTR_ID as OTHER_ID ,b.AGR_FG as CONSENT_TO_PROVIDING ,
    b.CUST_CD as ORGAN_CD, c.CUST_NM as ORGAN_NM, c.PRT_CUST_CD as PRODUCT_NUMBER,
    a.S_CIC_NO as CIC_NUMBER, a.S_INQ_DT1 as INQUIRY_DATE, a.S_REQ_STATUS as STATUS_CD , b.RSP_CD as RES_CD, to_char(to_date(a.S_DTIM, 'YYYY/MM/DD HH:MI:SS'),'mm/dd/yyyy hh:mi:ss') as OPERATION_DATE `;
    var SQL_FROM = `FROM TB_SCRP_TRLOG a `;
    var INNER_JOIN_TB_SCRPLOG = 'INNER JOIN TB_SCRPLOG b ON a.NICE_SSIN_ID  = b.NICE_SSIN_ID ';
    var INNER_JOIN_TB_ITCUST = 'INNER JOIN TB_ITCUST c ON b.CUST_CD  = c.CUST_CD  AND b.SYS_DTIM = c.SYS_DTIM  ';
    var WHERE = 'WHERE a.SCRP_LOG_ID = :scrpLogID ';

    let sql = SQL_SELECT + SQL_FROM + INNER_JOIN_TB_SCRPLOG + INNER_JOIN_TB_ITCUST + WHERE;
    let params = {
        scrpLogID: { val: scrpLogID }
    };
    oracelService.queryOracel(res, sql, params, optionFormatObj)
};

exports.editCICReport = async function (req, res) {
    var scrpLogID = req.body.scrpLogID;
    var taxNo = req.body.taxNo;
    var otherID = req.body.scrpLogID;
    var inquiryDate = req.body.inquiryDate;
    var statusCD = req.body.statusCD;
    var operationDT = req.body.operationDT;

    var SQL_SELECT = `UPDATE TP_SRP_TRLOG SET S_TAX_NO = :taxNo, OTHER_ID = :otherID, S_INQ_DT1 = :inquiryDate, S_REQ_STATUS = :statusCD, S_DTIM = :operationDT `;
    var SQL_FROM = `FROM TB_SCRP_TRLOG `;
    var WHERE = 'WHERE a.SCRP_LOG_ID = :scrpLogID ';

    let sql = SQL_SELECT + SQL_FROM + WHERE;
    let params = {
        scrpLogID: { val: scrpLogID },
        taxNo: { val: taxNo },
        otherID: { val: otherID },
        inquiryDate: { val: inquiryDate },
        statusCD: { val: statusCD },
        operationDT: { val: operationDT }
    };
    oracelService.queryOracel(res, sql, params, optionAutoCommit)
};



