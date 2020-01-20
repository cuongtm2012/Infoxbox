const oracledb = require('oracledb');
const oracelService = require('../services/oracelQuery.service');
var _ = require('lodash');
const optionFormatObj = { outFormat: oracledb.OUT_FORMAT_OBJECT };
const optionAutoCommit = { autoCommit: true };

exports.getProduct = async function (req, res) {
    var productCode = req.query.productCode;
    var productNM = req.query.productNM;
    var SQL_SELECT = `SELECT TB_ITCODE.CODE, TB_ITCODE.CODE_NM `;
    var SQL_FROM = `FROM TB_ITCODE WHERE TB_ITCODE.CD_CLASS = 'C0005' `;
    var SQL_SEARCH = 'AND TB_ITCODE.CODE LIKE :productCode OR TB_ITCODE.CODE_NM LIKE :productNM ';

    if (_.isEmpty(productCode) && _.isEmpty(productNM)) {
        let sql = SQL_SELECT + SQL_FROM;
        let param = {};
        oracelService.queryOracel(res, sql, params, optionFormatObj)
    } else {
        let sql = SQL_SELECT + SQL_FROM + SQL_SEARCH;
        let params = {
            productCode: { val: productCode },
            productNM: { val: productNM }
        };
        oracelService.queryOracel(res, sql, params, optionFormatObj)
    }
};

exports.getContract = async function (req, res) {
    var organClassifi = req.query.organClassifi;
    var organCd = req.query.organCd;
    var organNM = req.query.organNM;
    var productCode = req.query.productCode;
    var currentLocation = req.query.currentLocation;
    var limitRow = req.query.limitRow;
    var SQL_SELECT = `SELECT TB_ITCUST.CUST_GB as CLASS, TB_ITCTRT.CUST_CD as CUST_CODE, TB_ITCTRT.GDS_CD as PRODUCT_CODE, TB_ITCUST.CUST_NM as CUST_NM, TB_ITCTRT.VALID_START_DT as VALID_START_DT, TB_ITCTRT.VALID_END_DT as VALID_END_DT `;
    var SQL_FROM = 'FROM TB_ITCTRT ';
    var SQL_INNER_JOIN = 'INNER JOIN TB_ITCUST ON TB_ITCUST.CUST_CD = TB_ITCTRT.CUST_CD ';
    var SQL_SEARCH = 'WHERE TB_ITCUST.CUST_GB LIKE :organClassifi OR TB_ITCTRT.CUST_CD LIKE :organCd OR TB_ITCUST.CUST_NM LIKE :organNM OR TB_ITCTRT.GDS_CD LIKE :productCode ';
    var SQL_ORDER_BY = 'ORDER BY CUST_CD ';
    var SQL_LIMIT = 'OFFSET :currentLocation ROWS FETCH NEXT :limitRow ROWS ONLY ';
    if (_.isEmpty(organClassifi) && _.isEmpty(organCd) && _.isEmpty(organNM) && _.isEmpty(productCode)) {
        let sql = SQL_SELECT + SQL_FROM + SQL_INNER_JOIN + SQL_ORDER_BY + SQL_LIMIT;
        let params = {
            currentLocation: { val: currentLocation },
            limitRow: { val: limitRow }
        };
        oracelService.queryOracel(res, sql, params, optionFormatObj)
    } else {
        let sql = SQL_SELECT + SQL_FROM + SQL_INNER_JOIN + SQL_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let params = {
            organClassifi: { val: organClassifi },
            organCd: { val: organCd },
            productCode: { val: productCode },
            organNM: { val: organNM },
            currentLocation: { val: currentLocation },
            limitRow: { val: limitRow }
        };
        oracelService.queryOracel(res, sql, params, optionFormatObj)
    }
};

exports.insertContract = async function (req, res) {
    var cusGB = req.body.cusGB;
    var custCD = req.body.custCD;
    var productCD = req.body.productCD;
    var validStartDt = req.body.validStartDt.replace(/[^0-9 ]/g, "");
    var validEndDt = req.body.validEndDt.replace(/[^0-9 ]/g, "");
    var sysDTim = req.body.sysDTim.replace(/[^0-9 ]/g, "");
    var workID = req.body.workID;

    var SQL = 'INSERT INTO TB_ITCTRT (CUST_GB, CUST_CD, GDS_CD, VALID_START_DT, VALID_END_DT, SYS_DTIM, WORK_ID) VALUES (:cusGB, :custCD, :productCD, :validStartDt, :validEndDt, :sysDTim, :workID)';
    let params = {
        cusGB: { val: cusGB },
        custCD: { val: custCD },
        productCD: { val: productCD },
        validStartDt: { val: validStartDt },
        validEndDt: { val: validEndDt },
        sysDTim: { val: sysDTim },
        workID: { val: workID },
    };
    oracelService.queryOracel(res, SQL, params, optionAutoCommit)
};

exports.updateContract = async function (req, res) {
    var cusGB = req.body.cusGB;
    var custCD = req.body.custCD;
    var gdsCD = req.body.gdsCD;
    var validStartDt = req.body.validStartDt.replace(/[^0-9 ]/g, "");
    var validEndDt = req.body.validEndDt.replace(/[^0-9 ]/g, "");
    var sysDTim = req.body.sysDTim.replace(/[^0-9 ]/g, "");
    var workID = req.body.workID;

    var SQL = 'UPDATE TB_ITCTRT SET CUST_GB = :cusGB, CUST_CD = :custCD, VALID_START_DT = :validStartDt, VALID_END_DT = :validEndDt, SYS_DTIM = :sysDTim, WORK_ID = :workID WHERE GDS_CD = :gdsCD';

    let params = {
        cusGB: { val: cusGB },
        custCD: { val: custCD },
        gdsCD: { val: gdsCD },
        validStartDt: { val: validStartDt },
        validEndDt: { val: validEndDt },
        sysDTim: { val: sysDTim },
        workID: { val: workID },
    };
    oracelService.queryOracel(res, SQL, params, optionAutoCommit)
};



