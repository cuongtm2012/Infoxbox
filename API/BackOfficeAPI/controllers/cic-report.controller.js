const oracledb = require('oracledb');
const oracelService = require('../services/oracelQuery.service');
var _ = require('lodash');

const optionFormatObj = { outFormat: oracledb.OUT_FORMAT_OBJECT };
const optionAutoCommit = { autoCommit: true };

exports.viewHistoryCICReport = async function (req, res) {
    var orgCode = req.query.orgCode;
    var productCode = req.query.productCode;
    var CICNumber = req.query.CICNumber;
    var inqDateFrom = (_.isEmpty(req.query.inqDateFrom)) ? '': req.query.inqDateFrom.replace(/[^0-9 ]/g, "");
    var inqDateTo = (_.isEmpty(req.query.inqDateTo)) ? '': req.query.inqDateTo.replace(/[^0-9 ]/g, "");
    var currentLocation = req.query.currentLocation;
    var limitRow = req.query.limitRow;

    var SQL_SELECT = `SELECT
    TB_ITCUST.CUST_GB as CUST_GB, 
    TB_ITCUST.CUST_CD as CUST_CD, 
    TB_ITCUST.CUST_NM as CUST_NM, 
    TB_ITCODE.CODE_NM as CODE_NM,
    TB_SCRPLOG.NICE_SSIN_ID as NICE_SSIN_ID,
    TB_SCRPLOG.CUST_SSID_ID as CUST_SSID_ID,
    TB_SCRPLOG.GDS_CD as GDS_CD,
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
    to_char(to_date(TB_SCRPLOG.SYS_DTIM, 'YYYY/MM/DD HH24:MI:SS'),'mm/dd/yyyy hh24:mi:ss') as SYS_DTIM,
    to_char(to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD'),'mm/dd/yyyy') as INQ_DTIM,
    TB_SCRPLOG.SCRP_MOD_CD as SCRP_MOD_CD,
    TB_SCRPLOG.SCRP_REQ_DTIM as SCRP_REQ_DTIM,
    TB_SCRPLOG.WORK_ID as WORK_ID  `;
    var SQL_FROM = 'FROM TB_SCRPLOG ';
    var SQL_JOIN = 'LEFT JOIN TB_ITCUST ON TB_SCRPLOG.CUST_CD = TB_ITCUST.CUST_CD ' +
                         'LEFT JOIN TB_ITCODE ON TB_SCRPLOG.GDS_CD = TB_ITCODE.CODE ';
    var SQL_LIMIT = 'OFFSET :currentLocation ROWS FETCH NEXT :limitRow ROWS ONLY ';

    if (_.isEmpty(orgCode) && _.isEmpty(productCode) && _.isEmpty(CICNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_LIMIT;
        let param = {
            currentLocation,
            limitRow
        };
        oracelService.queryOracel(res, sql, param, optionFormatObj);
    }
    if(orgCode && _.isEmpty(productCode) && _.isEmpty(CICNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE = 'WHERE TB_SCRPLOG.CUST_CD LIKE :orgCode ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        oracelService.queryOracel(res, sql, param, optionFormatObj);
    }

    if(_.isEmpty(orgCode) && (productCode) && _.isEmpty(CICNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE = 'WHERE TB_SCRPLOG.GDS_CD LIKE :productCode ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_LIMIT;
        let param = {
            productCode,
            currentLocation,
            limitRow
        };
        oracelService.queryOracel(res, sql, param, optionFormatObj);
    }

    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && (CICNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE = 'WHERE TB_SCRPLOG.CIC_ID LIKE :CICNumber ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_LIMIT;
        let param = {
            CICNumber,
            currentLocation,
            limitRow
        };
        oracelService.queryOracel(res, sql, param, optionFormatObj);
    }

    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && _.isEmpty(CICNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE = `WHERE to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') `;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_LIMIT;
        let param = {
            inqDateFrom,
            inqDateTo,
            currentLocation,
            limitRow
        };
        oracelService.queryOracel(res, sql, param, optionFormatObj);
    }

    if((orgCode) && (productCode) && _.isEmpty(CICNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE = 'WHERE TB_SCRPLOG.CUST_CD LIKE :orgCode AND TB_SCRPLOG.GDS_CD LIKE :productCode ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_LIMIT;
        let param = {
            orgCode,
            productCode,
            currentLocation,
            limitRow
        };
        oracelService.queryOracel(res, sql, param, optionFormatObj);
    }

    if((orgCode) && _.isEmpty(productCode) && (CICNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE = 'WHERE TB_SCRPLOG.CUST_CD LIKE :orgCode AND TB_SCRPLOG.CIC_ID LIKE :CICNumber ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_LIMIT;
        let param = {
            orgCode,
            CICNumber,
            currentLocation,
            limitRow
        };
        oracelService.queryOracel(res, sql, param, optionFormatObj);
    }

    if((orgCode) && _.isEmpty(productCode) && _.isEmpty(CICNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE = `WHERE TB_SCRPLOG.CUST_CD LIKE :orgCode AND to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') `;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_LIMIT;
        let param = {
            orgCode,
            inqDateFrom,
            inqDateTo,
            currentLocation,
            limitRow
        };
        oracelService.queryOracel(res, sql, param, optionFormatObj);
    }

    if(_.isEmpty(orgCode) && (productCode) && (CICNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE = 'WHERE TB_SCRPLOG.GDS_CD LIKE :productCode AND TB_SCRPLOG.CIC_ID LIKE :CICNumber ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_LIMIT;
        let param = {
            productCode,
            CICNumber,
            currentLocation,
            limitRow
        };
        oracelService.queryOracel(res, sql, param, optionFormatObj);
    }

    if(_.isEmpty(orgCode) && (productCode) && _.isEmpty(CICNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE = `WHERE TB_SCRPLOG.GDS_CD LIKE :productCode AND 
         to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') `;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_LIMIT;
        let param = {
            productCode,
            inqDateFrom,
            inqDateTo,
            currentLocation,
            limitRow
        };
        oracelService.queryOracel(res, sql, param, optionFormatObj);
    }

    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && (CICNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE = `WHERE TB_SCRPLOG.CIC_ID LIKE :CICNumber :orgCode AND 
         to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') `;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_LIMIT;
        let param = {
            CICNumber,
            inqDateFrom,
            inqDateTo,
            currentLocation,
            limitRow
        };
        oracelService.queryOracel(res, sql, param, optionFormatObj);
    }

    if((orgCode) && (productCode) && (CICNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE = `WHERE TB_SCRPLOG.CUST_CD LIKE :orgCode AND 
                               TB_SCRPLOG.GDS_CD LIKE :productCode AND 
                               TB_SCRPLOG.CIC_ID LIKE :CICNumber  `;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_LIMIT;
        let param = {
            orgCode,
            productCode,
            CICNumber,
            currentLocation,
            limitRow
        };
        oracelService.queryOracel(res, sql, param, optionFormatObj);
    }

    if((orgCode) && (productCode) && _.isEmpty(CICNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE = `WHERE TB_SCRPLOG.CUST_CD LIKE :orgCode AND 
                               TB_SCRPLOG.GDS_CD LIKE :productCode AND 
                               to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD')  `;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_LIMIT;
        let param = {
            orgCode,
            productCode,
            inqDateFrom,
            inqDateTo,
            currentLocation,
            limitRow
        };
        oracelService.queryOracel(res, sql, param, optionFormatObj);
    }

    if((orgCode) && _.isEmpty(productCode) && (CICNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE = `WHERE TB_SCRPLOG.CUST_CD LIKE :orgCode AND 
                               TB_SCRPLOG.CIC_ID LIKE :CICNumber AND 
                               to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD')  `;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_LIMIT;
        let param = {
            orgCode,
            CICNumber,
            inqDateFrom,
            inqDateTo,
            currentLocation,
            limitRow
        };
        oracelService.queryOracel(res, sql, param, optionFormatObj);
    }

    if(_.isEmpty(orgCode) && (productCode) && (CICNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE = `WHERE TB_SCRPLOG.GDS_CD LIKE :productCode AND 
                               TB_SCRPLOG.CIC_ID LIKE :CICNumber AND 
                               to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD')  `;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_LIMIT;
        let param = {
            productCode,
            CICNumber,
            inqDateFrom,
            inqDateTo,
            currentLocation,
            limitRow
        };
        oracelService.queryOracel(res, sql, param, optionFormatObj);
    }

    if(_(orgCode) && (productCode) && (CICNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE = `WHERE TB_SCRPLOG.CUST_CD LIKE :orgCode AND
                               TB_SCRPLOG.GDS_CD LIKE :productCode AND 
                               TB_SCRPLOG.CIC_ID LIKE :CICNumber AND 
                               to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD')  `;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_LIMIT;
        let param = {
            orgCode,
            productCode,
            CICNumber,
            inqDateFrom,
            inqDateTo,
            currentLocation,
            limitRow
        };
        oracelService.queryOracel(res, sql, param, optionFormatObj);
    }
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



