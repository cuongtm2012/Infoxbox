const oracledb = require('oracledb');
const oracelService = require('../services/oracelQuery.service');
var _ = require('lodash');

const optionFormatObj = { outFormat: oracledb.OUT_FORMAT_OBJECT };
const optionAutoCommit = { autoCommit: true };

exports.viewHistoryCICReport = async function (req, res) {
    var orgCode = req.query.orgCode ? '%' + req.query.orgCode + '%' : '';
    var productCode = req.query.productCode ? '%' + req.query.productCode + '%' : '';
    var taxCode = req.query.taxCode ? '%' + req.query.taxCode + '%' : '';
    var nationalID = req.query.nationalID ? '%' + req.query.nationalID + '%' : '';
    var oldNationalID = req.query.oldNationalID ? '%' + req.query.oldNationalID + '%' : '';
    var passportNO = req.query.passportNO ? '%' + req.query.passportNO + '%' : '';
    var phoneNumber = req.query.phoneNumber ? '%' + req.query.phoneNumber + '%' : '';
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

    if (_.isEmpty(orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_ORDER_BY  + SQL_LIMIT;
        let param = {
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN;
        let paramSearch = {};
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if((orgCode) && (productCode) && (taxCode) && (nationalID) && (oldNationalID) && (passportNO) && (phoneNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE =
            ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' LOWER(TB_SCRPLOG.GDS_CD) LIKE LOWER(:productCode) AND ' +
            ' LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) AND ' +
            ' TB_SCRPLOG.NATL_ID LIKE :nationalID AND ' +
            ' TB_SCRPLOG.OLD_NATL_ID LIKE :oldNationalID AND ' +
            ' TB_SCRPLOG.PSPT_NO LIKE :passportNO AND ' +
            ' TB_SCRPLOG.TEL_NO_MOBILE LIKE :phoneNumber AND ' +
            ` to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') ` ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if((orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE = ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(orgCode) && (productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE = ' WHERE LOWER(TB_SCRPLOG.GDS_CD) LIKE LOWER(:productCode) ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && (taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE = ' WHERE LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && (nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE = ' WHERE TB_SCRPLOG.NATL_ID LIKE :nationalID ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && (oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE = ' WHERE TB_SCRPLOG.OLD_NATL_ID LIKE :oldNationalID ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && (passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE = ' WHERE TB_SCRPLOG.PSPT_NO LIKE :passportNO ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && (phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE = ' WHERE TB_SCRPLOG.TEL_NO_MOBILE LIKE :phoneNumber ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE =  ` WHERE to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') `;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if((orgCode) && (productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' LOWER(TB_SCRPLOG.GDS_CD) LIKE LOWER(:productCode) ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }


    if((orgCode) && _.isEmpty(productCode) && (taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if((orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && (nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' TB_SCRPLOG.NATL_ID LIKE :nationalID ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if((orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && (oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' TB_SCRPLOG.OLD_NATL_ID LIKE :oldNationalID ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if((orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && (passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' TB_SCRPLOG.PSPT_NO LIKE :passportNO ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if((orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && (phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' TB_SCRPLOG.TEL_NO_MOBILE LIKE :phoneNumber ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if((orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ` to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') ` ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(orgCode) && (productCode) && (taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.GDS_CD) LIKE LOWER(:productCode) AND ' +
            ` LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) ` ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(orgCode) && (productCode) && _.isEmpty(taxCode) && (nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.GDS_CD) LIKE LOWER(:productCode) AND ' +
            ` TB_SCRPLOG.NATL_ID LIKE :nationalID ` ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(orgCode) && (productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && (oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.GDS_CD) LIKE LOWER(:productCode) AND ' +
            ` TB_SCRPLOG.OLD_NATL_ID LIKE :oldNationalID ` ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(orgCode) && (productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && (passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.GDS_CD) LIKE LOWER(:productCode) AND ' +
            ` TB_SCRPLOG.PSPT_NO LIKE :passportNO ` ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(orgCode) && (productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && (phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.GDS_CD) LIKE LOWER(:productCode) AND ' +
            ` TB_SCRPLOG.TEL_NO_MOBILE LIKE :phoneNumber ` ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(orgCode) && (productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.GDS_CD) LIKE LOWER(:productCode) AND ' +
            ` to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') ` ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && (taxCode) && (nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE  LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) AND ' +
            ' TB_SCRPLOG.NATL_ID LIKE :nationalID ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && (taxCode) && _.isEmpty(nationalID) && (oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE  LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) AND ' +
            ' TB_SCRPLOG.OLD_NATL_ID LIKE :oldNationalID ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && (taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && (passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) AND ' +
            ' TB_SCRPLOG.PSPT_NO LIKE :passportNO ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && (taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && (phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) AND ' +
            ' TB_SCRPLOG.TEL_NO_MOBILE LIKE :phoneNumber ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && (taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) AND ' +
            ` to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') ` ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && (nationalID) && (oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE TB_SCRPLOG.NATL_ID LIKE :nationalID AND ' +
            ' TB_SCRPLOG.OLD_NATL_ID LIKE :oldNationalID ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && (nationalID) && _.isEmpty(oldNationalID) && (passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE TB_SCRPLOG.NATL_ID LIKE :nationalID AND ' +
            ' TB_SCRPLOG.PSPT_NO LIKE :passportNO ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && (nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && (phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE TB_SCRPLOG.NATL_ID LIKE :nationalID AND ' +
            ' TB_SCRPLOG.TEL_NO_MOBILE LIKE :phoneNumber ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && (nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE =   ' WHERE TB_SCRPLOG.NATL_ID LIKE :nationalID AND ' +
            ` to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') ` ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && (oldNationalID) && (passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE TB_SCRPLOG.OLD_NATL_ID LIKE :oldNationalID AND ' +
            ' TB_SCRPLOG.PSPT_NO LIKE :passportNO ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && (oldNationalID) && _.isEmpty(passportNO) && (phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE TB_SCRPLOG.OLD_NATL_ID LIKE :oldNationalID AND ' +
            ' TB_SCRPLOG.TEL_NO_MOBILE LIKE :phoneNumber ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && (oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE =   ' WHERE TB_SCRPLOG.OLD_NATL_ID LIKE :oldNationalID AND ' +
            ` to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') ` ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && (passportNO) && (phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE TB_SCRPLOG.PSPT_NO LIKE :passportNO AND ' +
            ' TB_SCRPLOG.TEL_NO_MOBILE LIKE :phoneNumber ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && (passportNO) && _.isEmpty(phoneNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE =   ' WHERE TB_SCRPLOG.PSPT_NO LIKE :passportNO AND ' +
            ` to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') ` ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && (phoneNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE =   ' WHERE TB_SCRPLOG.TEL_NO_MOBILE LIKE :phoneNumber AND ' +
            ` to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') ` ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if((orgCode) && (productCode) && (taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' LOWER(TB_SCRPLOG.GDS_CD) LIKE LOWER(:productCode) AND ' +
            ' LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if((orgCode) && (productCode) && _.isEmpty(taxCode) && (nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' LOWER(TB_SCRPLOG.GDS_CD) LIKE LOWER(:productCode) AND ' +
            ' TB_SCRPLOG.NATL_ID LIKE :nationalID ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if((orgCode) && (productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && (oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' LOWER(TB_SCRPLOG.GDS_CD) LIKE LOWER(:productCode) AND ' +
            ' TB_SCRPLOG.OLD_NATL_ID LIKE :oldNationalID ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if((orgCode) && (productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && (passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' LOWER(TB_SCRPLOG.GDS_CD) LIKE LOWER(:productCode) AND ' +
            ' TB_SCRPLOG.PSPT_NO LIKE :passportNO ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if((orgCode) && (productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && (phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' LOWER(TB_SCRPLOG.GDS_CD) LIKE LOWER(:productCode) AND ' +
            ' TB_SCRPLOG.TEL_NO_MOBILE LIKE :phoneNumber ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if((orgCode) && (productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' LOWER(TB_SCRPLOG.GDS_CD) LIKE LOWER(:productCode) AND ' +
            ` to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') ` ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if((orgCode) && _.isEmpty(productCode) && (taxCode) && (nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) AND ' +
            ' TB_SCRPLOG.NATL_ID LIKE :nationalID ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if((orgCode) && _.isEmpty(productCode) && (taxCode) && _.isEmpty(nationalID) && (oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) AND ' +
            ' TB_SCRPLOG.OLD_NATL_ID LIKE :oldNationalID ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if((orgCode) && _.isEmpty(productCode) && (taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && (passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) AND ' +
            ' TB_SCRPLOG.PSPT_NO LIKE :passportNO ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if((orgCode) && _.isEmpty(productCode) && (taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && (phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) AND ' +
            ' TB_SCRPLOG.TEL_NO_MOBILE LIKE :phoneNumber ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if((orgCode) && _.isEmpty(productCode) && (taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) AND ' +
            ` to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') ` ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if((orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && (nationalID) && (oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' TB_SCRPLOG.NATL_ID LIKE :nationalID AND ' +
            ' TB_SCRPLOG.OLD_NATL_ID LIKE :oldNationalID ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if((orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && (nationalID) && _.isEmpty(oldNationalID) && (passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' TB_SCRPLOG.NATL_ID LIKE :nationalID AND ' +
            ' TB_SCRPLOG.PSPT_NO LIKE :passportNO ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if((orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && (nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && (phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' TB_SCRPLOG.NATL_ID LIKE :nationalID AND ' +
            ' TB_SCRPLOG.TEL_NO_MOBILE LIKE :phoneNumber ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if((orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && (nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' TB_SCRPLOG.NATL_ID LIKE :nationalID AND ' +
            ` to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') ` ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if((orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && (oldNationalID) && _.isEmpty(passportNO) && (phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' TB_SCRPLOG.OLD_NATL_ID LIKE :oldNationalID AND ' +
            ' TB_SCRPLOG.TEL_NO_MOBILE LIKE :phoneNumber ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if((orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && (oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' TB_SCRPLOG.OLD_NATL_ID LIKE :oldNationalID AND ' +
            ` to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') ` ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if((orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && (passportNO) && (phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' TB_SCRPLOG.PSPT_NO LIKE :passportNO AND ' +
            ' TB_SCRPLOG.TEL_NO_MOBILE LIKE :phoneNumber ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if((orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && (passportNO) && _.isEmpty(phoneNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' TB_SCRPLOG.PSPT_NO LIKE :passportNO AND ' +
            ` to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') ` ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if((orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && (phoneNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' TB_SCRPLOG.TEL_NO_MOBILE LIKE :phoneNumber AND ' +
            ` to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') ` ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if(_.isEmpty(orgCode) && (productCode) && (taxCode) && (nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.GDS_CD) LIKE LOWER(:productCode) AND ' +
            ' LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) AND ' +
            ' TB_SCRPLOG.NATL_ID LIKE :nationalID ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if(_.isEmpty(orgCode) && (productCode) && (taxCode) && _.isEmpty(nationalID) && (oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.GDS_CD) LIKE LOWER(:productCode) AND ' +
            ' LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) AND ' +
            ' TB_SCRPLOG.OLD_NATL_ID LIKE :oldNationalID ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if(_.isEmpty(orgCode) && (productCode) && (taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && (passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.GDS_CD) LIKE LOWER(:productCode) AND ' +
            ' LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) AND ' +
            ' TB_SCRPLOG.PSPT_NO LIKE :passportNO ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if(_.isEmpty(orgCode) && (productCode) && (taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && (phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.GDS_CD) LIKE LOWER(:productCode) AND ' +
            ' LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) AND ' +
            ' TB_SCRPLOG.TEL_NO_MOBILE LIKE :phoneNumber ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if(_.isEmpty(orgCode) && (productCode) && (taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.GDS_CD) LIKE LOWER(:productCode) AND ' +
            ' LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) AND ' +
            ` to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') ` ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if(_.isEmpty(orgCode) && (productCode) && _.isEmpty(taxCode) && (nationalID) && (oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.GDS_CD) LIKE LOWER(:productCode) AND ' +
            ' TB_SCRPLOG.NATL_ID LIKE :nationalID AND ' +
            ' TB_SCRPLOG.OLD_NATL_ID LIKE :oldNationalID ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if(_.isEmpty(orgCode) && (productCode) && _.isEmpty(taxCode) && (nationalID) && _.isEmpty(oldNationalID) && (passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.GDS_CD) LIKE LOWER(:productCode) AND ' +
            ' TB_SCRPLOG.NATL_ID LIKE :nationalID AND ' +
            ' TB_SCRPLOG.PSPT_NO LIKE :passportNO ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if(_.isEmpty(orgCode) && (productCode) && _.isEmpty(taxCode) && (nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && (phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.GDS_CD) LIKE LOWER(:productCode) AND ' +
            ' TB_SCRPLOG.NATL_ID LIKE :nationalID AND ' +
            ' TB_SCRPLOG.TEL_NO_MOBILE LIKE :phoneNumber ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if(_.isEmpty(orgCode) && (productCode) && _.isEmpty(taxCode) && (nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.GDS_CD) LIKE LOWER(:productCode) AND ' +
            ' TB_SCRPLOG.NATL_ID LIKE :nationalID AND ' +
            ` to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') ` ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if(_.isEmpty(orgCode) && (productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && (oldNationalID) && (passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.GDS_CD) LIKE LOWER(:productCode) AND ' +
            ' TB_SCRPLOG.OLD_NATL_ID LIKE :oldNationalID AND ' +
            ' TB_SCRPLOG.PSPT_NO LIKE :passportNO ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if(_.isEmpty(orgCode) && (productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && (oldNationalID) && _.isEmpty(passportNO) && (phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.GDS_CD) LIKE LOWER(:productCode) AND ' +
            ' TB_SCRPLOG.OLD_NATL_ID LIKE :oldNationalID AND ' +
            ' TB_SCRPLOG.TEL_NO_MOBILE LIKE :phoneNumber ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if(_.isEmpty(orgCode) && (productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && (oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.GDS_CD) LIKE LOWER(:productCode) AND ' +
            ' TB_SCRPLOG.OLD_NATL_ID LIKE :oldNationalID AND ' +
            ` to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') ` ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if(_.isEmpty(orgCode) && (productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && (passportNO) && (phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.GDS_CD) LIKE LOWER(:productCode) AND ' +
            ' TB_SCRPLOG.PSPT_NO LIKE :passportNO AND ' +
            ' TB_SCRPLOG.TEL_NO_MOBILE LIKE :phoneNumber ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if(_.isEmpty(orgCode) && (productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && (passportNO) && _.isEmpty(phoneNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.GDS_CD) LIKE LOWER(:productCode) AND ' +
            ' TB_SCRPLOG.PSPT_NO LIKE :passportNO AND ' +
            ` to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') ` ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if(_.isEmpty(orgCode) && (productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && (phoneNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.GDS_CD) LIKE LOWER(:productCode) AND ' +
            ' TB_SCRPLOG.TEL_NO_MOBILE LIKE :phoneNumber AND ' +
            ` to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') ` ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && (taxCode) && (nationalID) && (oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) AND ' +
            ' TB_SCRPLOG.NATL_ID LIKE :nationalID AND ' +
            ' TB_SCRPLOG.OLD_NATL_ID LIKE :oldNationalID ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && (taxCode) && (nationalID) && _.isEmpty(oldNationalID) && (passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) AND ' +
            ' TB_SCRPLOG.NATL_ID LIKE :nationalID AND ' +
            ' TB_SCRPLOG.PSPT_NO LIKE :passportNO ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && (taxCode) && (nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && (phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) AND ' +
            ' TB_SCRPLOG.NATL_ID LIKE :nationalID AND ' +
            ' TB_SCRPLOG.TEL_NO_MOBILE LIKE :phoneNumber ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && (taxCode) && (nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) AND ' +
            ' TB_SCRPLOG.NATL_ID LIKE :nationalID AND ' +
            ` to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') ` ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && (taxCode) && _.isEmpty(nationalID) && (oldNationalID) && (passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) AND ' +
            ' TB_SCRPLOG.OLD_NATL_ID LIKE :oldNationalID AND ' +
            ' TB_SCRPLOG.PSPT_NO LIKE :passportNO ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && (taxCode) && _.isEmpty(nationalID) && (oldNationalID) && _.isEmpty(passportNO) && (phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) AND ' +
            ' TB_SCRPLOG.OLD_NATL_ID LIKE :oldNationalID AND ' +
            ' TB_SCRPLOG.TEL_NO_MOBILE LIKE :phoneNumber ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && (taxCode) && _.isEmpty(nationalID) && (oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) AND ' +
            ' TB_SCRPLOG.OLD_NATL_ID LIKE :oldNationalID AND ' +
            ` to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') ` ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && (taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && (passportNO) && (phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) AND ' +
            ' TB_SCRPLOG.PSPT_NO LIKE :passportNO AND ' +
            ' TB_SCRPLOG.TEL_NO_MOBILE LIKE :phoneNumber ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && (taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && (passportNO) && _.isEmpty(phoneNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) AND ' +
            ' TB_SCRPLOG.PSPT_NO LIKE :passportNO AND ' +
            ` to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') `  ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && (taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && (phoneNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) AND ' +
            ' TB_SCRPLOG.TEL_NO_MOBILE LIKE :phoneNumber AND ' +
            ` to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') `  ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && (nationalID) && (oldNationalID) && (passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE TB_SCRPLOG.NATL_ID LIKE :nationalID AND ' +
            ' TB_SCRPLOG.OLD_NATL_ID LIKE :oldNationalID AND ' +
            ' TB_SCRPLOG.PSPT_NO LIKE :passportNO '  ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && (nationalID) && (oldNationalID) && _.isEmpty(passportNO) && (phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE TB_SCRPLOG.NATL_ID LIKE :nationalID AND ' +
            ' TB_SCRPLOG.OLD_NATL_ID LIKE :oldNationalID AND ' +
            ' TB_SCRPLOG.TEL_NO_MOBILE LIKE :phoneNumber '  ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if(_.isEmpty(orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && (nationalID) && (oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE =   ' WHERE TB_SCRPLOG.NATL_ID LIKE :nationalID AND ' +
            ' TB_SCRPLOG.OLD_NATL_ID LIKE :oldNationalID AND ' +
            ` to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') `  ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
   if(_.isEmpty(orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && (nationalID) && _.isEmpty(oldNationalID) && (passportNO) && (phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE TB_SCRPLOG.NATL_ID LIKE :nationalID AND ' +
            ' TB_SCRPLOG.PSPT_NO LIKE :passportNO AND ' +
            ' TB_SCRPLOG.TEL_NO_MOBILE LIKE :phoneNumber '  ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
   if(_.isEmpty(orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && (nationalID) && _.isEmpty(oldNationalID) && (passportNO) && _.isEmpty(phoneNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE =   ' WHERE TB_SCRPLOG.NATL_ID LIKE :nationalID AND ' +
            ' TB_SCRPLOG.PSPT_NO LIKE :passportNO AND ' +
            ` to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') `  ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
   if(_.isEmpty(orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && (nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && (phoneNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE =   ' WHERE TB_SCRPLOG.NATL_ID LIKE :nationalID AND ' +
            ' TB_SCRPLOG.TEL_NO_MOBILE LIKE :phoneNumber AND ' +
            ` to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') `  ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
   if(_.isEmpty(orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && (oldNationalID) && (passportNO) && (phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE TB_SCRPLOG.OLD_NATL_ID LIKE :oldNationalID AND ' +
            ' TB_SCRPLOG.PSPT_NO LIKE :passportNO AND ' +
            ' TB_SCRPLOG.TEL_NO_MOBILE LIKE :phoneNumber '  ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
   if(_.isEmpty(orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && (oldNationalID) && (passportNO) && _.isEmpty(phoneNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE =   ' WHERE TB_SCRPLOG.OLD_NATL_ID LIKE :oldNationalID AND ' +
            ' TB_SCRPLOG.PSPT_NO LIKE :passportNO AND ' +
            ` to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') ` ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
   if(_.isEmpty(orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && (oldNationalID) && _.isEmpty(passportNO) && (phoneNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE =   ' WHERE TB_SCRPLOG.OLD_NATL_ID LIKE :oldNationalID AND ' +
            ' TB_SCRPLOG.TEL_NO_MOBILE LIKE :phoneNumber AND ' +
            ` to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') ` ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
   if(_.isEmpty(orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && (passportNO) && (phoneNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE =   ' WHERE TB_SCRPLOG.PSPT_NO LIKE :passportNO AND ' +
            ' TB_SCRPLOG.TEL_NO_MOBILE LIKE :phoneNumber AND ' +
            ` to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') ` ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
   if((orgCode) && (productCode) &&(taxCode) && (nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' LOWER(TB_SCRPLOG.GDS_CD) LIKE LOWER(:productCode) AND ' +
            ' LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) AND ' +
            ' TB_SCRPLOG.NATL_ID LIKE :nationalID ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
   if((orgCode) && (productCode) &&(taxCode) && _.isEmpty(nationalID) && (oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' LOWER(TB_SCRPLOG.GDS_CD) LIKE LOWER(:productCode) AND ' +
            ' LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) AND ' +
            ' TB_SCRPLOG.OLD_NATL_ID LIKE :oldNationalID ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
   if((orgCode) && (productCode) &&(taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && (passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' LOWER(TB_SCRPLOG.GDS_CD) LIKE LOWER(:productCode) AND ' +
            ' LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) AND ' +
            ' TB_SCRPLOG.PSPT_NO LIKE :passportNO ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
   if((orgCode) && (productCode) &&(taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && (phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' LOWER(TB_SCRPLOG.GDS_CD) LIKE LOWER(:productCode) AND ' +
            ' LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) AND ' +
            ' TB_SCRPLOG.TEL_NO_MOBILE LIKE :phoneNumber ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
   if((orgCode) && (productCode) &&(taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' LOWER(TB_SCRPLOG.GDS_CD) LIKE LOWER(:productCode) AND ' +
            ' LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) AND ' +
            ` to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') ` ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
   if((orgCode) && _.isEmpty(productCode) && (taxCode) && (nationalID) && (oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) AND ' +
            ' TB_SCRPLOG.NATL_ID LIKE :nationalID AND ' +
            ' TB_SCRPLOG.OLD_NATL_ID LIKE :oldNationalID ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
   if((orgCode) && _.isEmpty(productCode) && (taxCode) && (nationalID) && _.isEmpty(oldNationalID) && (passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) AND ' +
            ' TB_SCRPLOG.NATL_ID LIKE :nationalID AND ' +
            ' TB_SCRPLOG.PSPT_NO LIKE :passportNO ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
   if((orgCode) && _.isEmpty(productCode) && (taxCode) && (nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && (phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) AND ' +
            ' TB_SCRPLOG.NATL_ID LIKE :nationalID AND ' +
            ' TB_SCRPLOG.TEL_NO_MOBILE LIKE :phoneNumber ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
   if((orgCode) && _.isEmpty(productCode) && (taxCode) && (nationalID) && _.isEmpty(oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) AND ' +
            ' TB_SCRPLOG.NATL_ID LIKE :nationalID AND ' +
            ` to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') ` ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
   if((orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && (nationalID) && (oldNationalID) && (passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' TB_SCRPLOG.NATL_ID LIKE :nationalID AND ' +
            ' TB_SCRPLOG.OLD_NATL_ID LIKE :oldNationalID AND ' +
            ' TB_SCRPLOG.PSPT_NO LIKE :passportNO ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
   if((orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && (nationalID) && (oldNationalID) && _.isEmpty(passportNO) && (phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' TB_SCRPLOG.NATL_ID LIKE :nationalID AND ' +
            ' TB_SCRPLOG.OLD_NATL_ID LIKE :oldNationalID AND ' +
            ' TB_SCRPLOG.TEL_NO_MOBILE LIKE :phoneNumber ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
   if((orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && (nationalID) && (oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' TB_SCRPLOG.NATL_ID LIKE :nationalID AND ' +
            ' TB_SCRPLOG.OLD_NATL_ID LIKE :oldNationalID AND ' +
            ` to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') ` ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
   if((orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && (oldNationalID) && (passportNO) && (phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' TB_SCRPLOG.OLD_NATL_ID LIKE :oldNationalID AND ' +
            ' TB_SCRPLOG.PSPT_NO LIKE :passportNO AND ' +
            ' TB_SCRPLOG.TEL_NO_MOBILE LIKE :phoneNumber ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
   if((orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && (oldNationalID) && (passportNO) && _.isEmpty(phoneNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' TB_SCRPLOG.OLD_NATL_ID LIKE :oldNationalID AND ' +
            ' TB_SCRPLOG.PSPT_NO LIKE :passportNO AND ' +
            ` to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') ` ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
   if((orgCode) && _.isEmpty(productCode) && _.isEmpty(taxCode) && _.isEmpty(nationalID) && _.isEmpty(oldNationalID) && (passportNO) && (phoneNumber) && (inqDateFrom) && (inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
            ' TB_SCRPLOG.PSPT_NO LIKE :passportNO AND ' +
            ' TB_SCRPLOG.TEL_NO_MOBILE LIKE :phoneNumber AND ' +
            ` to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') ` ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
   if(_.isEmpty(orgCode) && (productCode) && (taxCode) && (nationalID) && (oldNationalID) && _.isEmpty(passportNO) && _.isEmpty(phoneNumber) && _.isEmpty(inqDateFrom) && _.isEmpty(inqDateTo)) {
        let SQL_WHERE =   ' WHERE LOWER(TB_SCRPLOG.GDS_CD) LIKE LOWER(:productCode) AND ' +
            ' LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) AND ' +
            ' TB_SCRPLOG.NATL_ID LIKE :nationalID AND ' +
            ' TB_SCRPLOG.OLD_NATL_ID LIKE :oldNationalID ' ;
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE;
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

};
' WHERE LOWER(TB_SCRPLOG.CUST_CD) LIKE LOWER(:orgCode) AND ' +
' LOWER(TB_SCRPLOG.GDS_CD) LIKE LOWER(:productCode) AND ' +
' LOWER(TB_SCRPLOG.TAX_ID) LIKE LOWER(:taxCode) AND ' +
' TB_SCRPLOG.NATL_ID LIKE :nationalID AND ' +
' TB_SCRPLOG.OLD_NATL_ID LIKE :oldNationalID AND ' +
' TB_SCRPLOG.PSPT_NO LIKE :passportNO AND ' +
' TB_SCRPLOG.TEL_NO_MOBILE LIKE :phoneNumber AND ' +
` to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:inqDateFrom, 'YYYY/MM/DD') AND to_date(:inqDateTo, 'YYYY/MM/DD') ` ;

exports.handledViewReportCIC = async function (req, res) {
    var niceSsID = req.query.niceSsID;
    var SQL_SELECT = ` SELECT * `;
    var SQL_FROM = `FROM TB_SCRPLOG `;
    var WHERE = 'WHERE NICE_SSIN_ID = :niceSsID ';

    let sql = SQL_SELECT + SQL_FROM + WHERE;
    let params = {
        niceSsID
    };
    oracelService.queryOracel(res, sql, params, optionFormatObj)
};
