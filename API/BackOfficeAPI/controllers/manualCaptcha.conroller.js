const oracledb = require('oracledb');
const oracelService = require('../services/oracelQuery.service');
var _ = require('lodash');

const optionFormatObj = { outFormat: oracledb.OUT_FORMAT_OBJECT };
const optionAutoCommit = { autoCommit: true };

exports.getListB003 = async function (req, res) {
    var niceSsID = req.query.niceSsID ? '%' + req.query.niceSsID + '%' : '';
    var currentLocation = req.query.currentLocation;
    var limitRow = req.query.limitRow;
    var SQL_SELECT = `SELECT
    TB_SCRPLOG.NICE_SSIN_ID as NICE_SSIN_ID, 
    TB_SCRPLOG.NATL_ID as NATL_ID,
    TB_SCRPLOG.OLD_NATL_ID as OLD_NATL_ID,
    TB_SCRPLOG.PSPT_NO as PSPT_NO,
    TB_SCRP_TRLOG.S_CIC_NO as S_CIC_NO, 
    TB_SCRP_TRLOG.S_USER_ID as S_USER_ID, 
    TB_SCRP_TRLOG.S_USER_PW as S_USER_PW, 
    TB_SCRPLOG.INQ_DTIM as INQ_DTIM `;
    var SQL_SELECT_COUNT = `SELECT COUNT(*) AS total `;
    var SQL_FROM = 'FROM TB_SCRP_TRLOG ';
    var SQL_JOIN = 'INNER JOIN TB_SCRPLOG ON TB_SCRPLOG.NICE_SSIN_ID = TB_SCRP_TRLOG.NICE_SSIN_ID ';
    var SQL_WHERE = `WHERE TB_SCRPLOG.SCRP_STAT_CD = '04' AND TB_SCRPLOG.SCRP_MOD_CD = '01' AND TB_SCRP_TRLOG.S_SVC_CD = 'B0002' and TB_SCRPLOG.AGR_FG = 'Y' and TB_SCRPLOG.GDS_CD = 'S1001' `;
    var SQL_ORDER_BY = `ORDER BY CASE WHEN TB_SCRPLOG.SYS_DTIM IS NOT NULL THEN 1 ELSE 0 END DESC, TB_SCRPLOG.SYS_DTIM DESC `;
    var SQL_LIMIT = 'OFFSET :currentLocation ROWS FETCH NEXT :limitRow ROWS ONLY ';
    if(_.isEmpty(niceSsID) ) {
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {};
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if( niceSsID) {
        let SQL_WHERE_SSNICE = ` AND TB_SCRPLOG.NICE_SSIN_ID LIKE :niceSsID `;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_WHERE_SSNICE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            niceSsID,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE  + SQL_WHERE_SSNICE;
        let paramSearch = {niceSsID,};
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
};

exports.getListForB001 = async function (req, res) {
    var niceSsID = req.query.niceSsID ? '%' + req.query.niceSsID + '%' : '';
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
    var SQL_SELECT_COUNT = `SELECT COUNT(*) AS total `;
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
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {};
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if( niceSsID) {
        let SQL_WHERE = `WHERE TB_SCRPLOG.NICE_SSIN_ID LIKE :niceSsID AND TB_SCRPLOG.GDS_CD = 'S1002' AND TB_SCRPLOG.SCRP_STAT_CD = '01' `;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            niceSsID,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {niceSsID};
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
};

exports.getListB002 = async function (req, res) {
    var niceSsID = req.query.niceSsID ? '%' + req.query.niceSsID + '%' : '';
    var orgCode = req.query.orgCode ? '%' + req.query.orgCode + '%' : '';
    var productCode = req.query.productCode ? '%' + req.query.productCode + '%' : '';
    var CICNumber = req.query.CICNumber ? '%' + req.query.CICNumber + '%' : '';
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
    to_char(to_date(TB_SCRPLOG.SYS_DTIM, 'YYYY/MM/DD HH24:MI:SS'),'mm/dd/yyyy hh24:mi:ss') as SYS_DTIM,
    to_char(to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD'),'mm/dd/yyyy') as INQ_DTIM,
    TB_SCRPLOG.SCRP_MOD_CD as SCRP_MOD_CD,
    TB_SCRPLOG.SCRP_REQ_DTIM as SCRP_REQ_DTIM,
    TB_SCRPLOG.WORK_ID as WORK_ID  `;
    var SQL_SELECT_COUNT = `SELECT COUNT(*) AS total `;
    var SQL_FROM = 'FROM TB_SCRPLOG ';
    var SQL_JOIN = 'LEFT JOIN TB_ITCUST ON TB_SCRPLOG.CUST_CD = TB_ITCUST.CUST_CD ' +
        'LEFT JOIN TB_ITCODE ON TB_SCRPLOG.GDS_CD = TB_ITCODE.CODE ';
    var SQL_ORDER_BY = `ORDER BY CASE WHEN TB_SCRPLOG.INQ_DTIM IS NOT NULL THEN 1 ELSE 0 END DESC, TB_SCRPLOG.INQ_DTIM DESC `;
    var SQL_LIMIT = 'OFFSET :currentLocation ROWS FETCH NEXT :limitRow ROWS ONLY ';
    var SQL_AND_WHERE = ` AND TB_SCRPLOG.SCRP_STAT_CD= '01' AND TB_SCRPLOG.SCRP_MOD_CD = '01' AND TB_SCRPLOG.GDS_CD = 'S1001' AND TB_SCRPLOG.AGR_FG = 'Y' `;

    if (_.isEmpty(niceSsID) &&_.isEmpty(orgCode) && _.isEmpty(productCode) && _.isEmpty(CICNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE = ` WHERE TB_SCRPLOG.SCRP_STAT_CD= '01' AND TB_SCRPLOG.SCRP_MOD_CD = '01' AND TB_SCRPLOG.GDS_CD = 'S1001' AND TB_SCRPLOG.AGR_FG = 'Y' `;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY  + SQL_LIMIT;
        let param = {
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {};
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if(orgCode && _.isEmpty(productCode) && _.isEmpty(CICNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE = 'WHERE TB_SCRPLOG.CUST_CD LIKE :orgCode ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_AND_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_AND_WHERE ;
        let paramSearch = {orgCode};
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if( niceSsID &&_.isEmpty(orgCode) && _.isEmpty(productCode) && _.isEmpty(CICNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE = 'WHERE TB_SCRPLOG.NICE_SSIN_ID LIKE :niceSsID ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_AND_WHERE  + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            niceSsID,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_AND_WHERE ;
        let paramSearch = {niceSsID};
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(orgCode) && (productCode) && _.isEmpty(CICNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE = 'WHERE TB_SCRPLOG.GDS_CD LIKE :productCode ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_AND_WHERE  + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            productCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_AND_WHERE ;
        let paramSearch = {productCode};
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && (CICNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE = 'WHERE TB_SCRPLOG.CIC_ID LIKE :CICNumber ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_AND_WHERE  + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            CICNumber,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_AND_WHERE ;
        let paramSearch = {CICNumber};
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && _.isEmpty(CICNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE = `WHERE to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') `;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_AND_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            inqDateFrom,
            inqDateTo,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_AND_WHERE;
        let paramSearch = {inqDateFrom,
            inqDateTo};
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if((orgCode) && (productCode) && _.isEmpty(CICNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE = 'WHERE TB_SCRPLOG.CUST_CD LIKE :orgCode AND TB_SCRPLOG.GDS_CD LIKE :productCode ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_AND_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            productCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_AND_WHERE;
        let paramSearch = {
            orgCode,
            productCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if((orgCode) && _.isEmpty(productCode) && (CICNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE = 'WHERE TB_SCRPLOG.CUST_CD LIKE :orgCode AND TB_SCRPLOG.CIC_ID LIKE :CICNumber ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_AND_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            CICNumber,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_AND_WHERE;
        let paramSearch = {
            orgCode,
            CICNumber,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if((orgCode) && _.isEmpty(productCode) && _.isEmpty(CICNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE = `WHERE TB_SCRPLOG.CUST_CD LIKE :orgCode AND to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') `;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_AND_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            inqDateFrom,
            inqDateTo,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_AND_WHERE;
        let paramSearch = {
            orgCode,
            inqDateFrom,
            inqDateTo,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(orgCode) && (productCode) && (CICNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE = 'WHERE TB_SCRPLOG.GDS_CD LIKE :productCode AND TB_SCRPLOG.CIC_ID LIKE :CICNumber ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_AND_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            productCode,
            CICNumber,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_AND_WHERE;
        let paramSearch = {
            productCode,
            CICNumber,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(orgCode) && (productCode) && _.isEmpty(CICNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE = `WHERE TB_SCRPLOG.GDS_CD LIKE :productCode AND 
         to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') `;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_AND_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            productCode,
            inqDateFrom,
            inqDateTo,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_AND_WHERE;
        let paramSearch = {
            productCode,
            inqDateFrom,
            inqDateTo,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && (CICNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE = `WHERE TB_SCRPLOG.CIC_ID LIKE :CICNumber :orgCode AND 
         to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') `;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_AND_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            CICNumber,
            inqDateFrom,
            inqDateTo,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_AND_WHERE;
        let paramSearch = {
            CICNumber,
            inqDateFrom,
            inqDateTo,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if((orgCode) && (productCode) && (CICNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE = `WHERE TB_SCRPLOG.CUST_CD LIKE :orgCode AND 
                               TB_SCRPLOG.GDS_CD LIKE :productCode AND 
                               TB_SCRPLOG.CIC_ID LIKE :CICNumber  `;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_AND_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            productCode,
            CICNumber,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_AND_WHERE;
        let paramSearch = {
            orgCode,
            productCode,
            CICNumber,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if((orgCode) && (productCode) && _.isEmpty(CICNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE = `WHERE TB_SCRPLOG.CUST_CD LIKE :orgCode AND 
                               TB_SCRPLOG.GDS_CD LIKE :productCode AND 
                               to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD')  `;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_AND_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            productCode,
            inqDateFrom,
            inqDateTo,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_AND_WHERE;
        let paramSearch = {
            orgCode,
            productCode,
            inqDateFrom,
            inqDateTo,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if((orgCode) && _.isEmpty(productCode) && (CICNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE = `WHERE TB_SCRPLOG.CUST_CD LIKE :orgCode AND 
                               TB_SCRPLOG.CIC_ID LIKE :CICNumber AND 
                               to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD')  `;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_AND_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            CICNumber,
            inqDateFrom,
            inqDateTo,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_AND_WHERE;
        let paramSearch = {
            orgCode,
            CICNumber,
            inqDateFrom,
            inqDateTo,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(orgCode) && (productCode) && (CICNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE = `WHERE TB_SCRPLOG.GDS_CD LIKE :productCode AND 
                               TB_SCRPLOG.CIC_ID LIKE :CICNumber AND 
                               to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD')  `;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_AND_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            productCode,
            CICNumber,
            inqDateFrom,
            inqDateTo,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_AND_WHERE;
        let paramSearch = {
            productCode,
            CICNumber,
            inqDateFrom,
            inqDateTo,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_(orgCode) && (productCode) && (CICNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE = `WHERE TB_SCRPLOG.CUST_CD LIKE :orgCode AND
                               TB_SCRPLOG.GDS_CD LIKE :productCode AND 
                               TB_SCRPLOG.CIC_ID LIKE :CICNumber AND 
                               to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD')  `;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_AND_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            productCode,
            CICNumber,
            inqDateFrom,
            inqDateTo,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_AND_WHERE;
        let paramSearch = {
            orgCode,
            productCode,
            CICNumber,
            inqDateFrom,
            inqDateTo,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
};
