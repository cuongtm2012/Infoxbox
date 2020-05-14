const oracledb = require('oracledb');
const dateFormat = require('dateformat');
const oracelService = require('../services/oracelQuery.service');
let _ = require('lodash');
const optionFormatObj = { outFormat: oracledb.OUT_FORMAT_OBJECT };
const optionAutoCommit = { autoCommit: true };

exports.getProduct = async function (req, res) {
    let productCode = req.query.productCode ? '%' + req.query.productCode + '%' : '';
    let productNM = req.query.productNM ? '%' + req.query.productNM + '%' : '';
    let currentLocation = req.query.currentLocation;
    let limitRow = req.query.limitRow;
    let SQL_SELECT = `SELECT TB_ITCODE.CODE, TB_ITCODE.CODE_NM `;
    let SQL_SELECT_COUNT = `SELECT COUNT(*) AS total `;
    let SQL_FROM = `FROM TB_ITCODE WHERE TB_ITCODE.CD_CLASS = 'C0005' `;
    let SQL_LIMIT = 'OFFSET :currentLocation ROWS FETCH NEXT :limitRow ROWS ONLY ';

    if (_.isEmpty(productCode) && _.isEmpty(productNM)) {
        let sql = SQL_SELECT + SQL_FROM + SQL_LIMIT;
        let param = {
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM;
        let paramSearch = {};
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if ((productCode) && (productNM)){
        let SQL_SEARCH = 'AND TB_ITCODE.CODE LIKE :productCode AND TB_ITCODE.CODE_NM LIKE :productNM ';
        let sql = SQL_SELECT + SQL_FROM + SQL_SEARCH + SQL_LIMIT;
        let param = {
            productCode,
            productNM,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_SEARCH;
        let paramSearch = {
            productCode,
            productNM,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if ((productCode) && _.isEmpty(productNM)){
        let SQL_SEARCH = 'AND TB_ITCODE.CODE LIKE :productCode ';
        let sql = SQL_SELECT + SQL_FROM + SQL_SEARCH + SQL_LIMIT;
        let param = {
            productCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_SEARCH;
        let paramSearch = {
            productCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if (_.isEmpty(productCode) && (productNM)){
        let SQL_SEARCH = 'AND TB_ITCODE.CODE_NM LIKE :productNM ';
        let sql = SQL_SELECT + SQL_FROM + SQL_SEARCH + SQL_LIMIT;
        let param = {
            productNM,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_SEARCH;
        let paramSearch = {
            productNM,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
};

exports.getContract = async function (req, res) {
    let organClassifi = req.body.organClassifi ? '%' + req.body.organClassifi + '%' : '';
    let organCd = req.body.organCd ? '%' + req.body.organCd + '%' : '';
    let productCode =req.body.productCode ? '%' + req.body.productCode + '%' : '';
    let status = req.body.status ? req.body.status : '';
    let currentLocation = req.body.currentLocation;
    let limitRow = req.body.limitRow;
    let SQL_SELECT_ITCTRT = `SELECT 
    TB_ITCTRT.CUST_GB as CUST_GB, 
    TB_ITCTRT.CUST_CD as CUST_CODE, 
    TB_ITCTRT.GDS_CD as PRODUCT_CODE, 
    TB_ITCTRT.STATUS as STATUS, 
    TB_ITCUST.CUST_NM_ENG as CUST_NM_ENG,
    TB_ITCUST.BRANCH_NM as BRANCH_NM,
    TB_ITCODE.CODE_NM as CODE_NM,
    to_char(to_date(TB_ITCTRT.VALID_START_DT, 'yyyymmdd'),'yyyy/mm/dd') AS VALID_START_DT ,
    to_char(to_date(TB_ITCTRT.VALID_END_DT, 'yyyymmdd'),'yyyy/mm/dd') AS VALID_END_DT ,
    to_char(to_date(TB_ITCTRT.SYS_DTIM, 'YYYY/MM/DD HH24:MI:SS'),'yyyy/mm/dd hh24:mi:ss') AS SYS_DTIM , 
    TB_ITCTRT.WORK_ID as WORK_ID  `;
    let SQL_SELECT_ITCTRT_HIST = `SELECT 
    TB_ITCTRT_HIST.CUST_GB as CUST_GB, 
    TB_ITCTRT_HIST.CUST_CD as CUST_CODE, 
    TB_ITCTRT_HIST.GDS_CD as PRODUCT_CODE, 
    TB_ITCTRT_HIST.STATUS as STATUS, 
    TB_ITCUST.CUST_NM_ENG as CUST_NM_ENG,
    TB_ITCUST.BRANCH_NM as BRANCH_NM,
    TB_ITCODE.CODE_NM as CODE_NM,
    to_char(to_date(TB_ITCTRT_HIST.VALID_START_DT, 'yyyymmdd'),'yyyy/mm/dd') AS VALID_START_DT ,
    to_char(to_date(TB_ITCTRT_HIST.VALID_END_DT, 'yyyymmdd'),'yyyy/mm/dd') AS VALID_END_DT ,
    to_char(to_date(TB_ITCTRT_HIST.SYS_DTIM, 'YYYY/MM/DD HH24:MI:SS'),'yyyy/mm/dd hh24:mi:ss') AS SYS_DTIM , 
    TB_ITCTRT_HIST.WORK_ID as WORK_ID  `;
    let SQL_SELECT_COUNT = ` SELECT COUNT(*) AS total FROM   `;
    var UNION_ALL = ' UNION ALL ';
    let SQL_FROM_TB_ITCTRT = ' FROM TB_ITCTRT ';
    let SQL_FROM_TB_ITCTRT_HIST = ' FROM TB_ITCTRT_HIST ';
    let SQL_INNER_JOIN_IT_CTRT = ' LEFT JOIN TB_ITCUST ON TB_ITCUST.CUST_CD = TB_ITCTRT.CUST_CD AND TB_ITCUST.CUST_GB = TB_ITCTRT.CUST_GB LEFT JOIN TB_ITCODE ON TB_ITCTRT.GDS_CD = TB_ITCODE.CODE ';
    let SQL_INNER_JOIN_IT_CTRT_HIST = ' LEFT JOIN TB_ITCUST ON TB_ITCUST.CUST_CD = TB_ITCTRT_HIST.CUST_CD AND TB_ITCUST.CUST_GB = TB_ITCTRT_HIST.CUST_GB LEFT JOIN TB_ITCODE ON TB_ITCTRT_HIST.GDS_CD = TB_ITCODE.CODE ';
    let SQL_ORDER_BY = ` ORDER BY CUST_NM_ENG, PRODUCT_CODE `
    let SQL_LIMIT = ' OFFSET :currentLocation ROWS FETCH NEXT :limitRow ROWS ONLY ';
    if (_.isEmpty(organClassifi) && _.isEmpty(organCd) && _.isEmpty(productCode) && _.isEmpty(status)) {
        let sql = SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT + SQL_INNER_JOIN_IT_CTRT + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT +  SQL_INNER_JOIN_IT_CTRT + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + ')';
        let paramSearch = {};
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if ((organClassifi) && (organCd) && (productCode) && (status)) {
        let SQL_SEARCH;
        let SQL_SEARCH_HIST;
        if (status[0] == 0) {
            SQL_SEARCH = `WHERE TB_ITCTRT.CUST_GB LIKE :organClassifi AND (TB_ITCTRT.STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) OR TB_ITCTRT.STATUS IS NULL) AND LOWER(TB_ITCTRT.CUST_CD) LIKE LOWER(:organCd)  AND LOWER(TB_ITCTRT.GDS_CD) LIKE LOWER(:productCode) `;
            SQL_SEARCH_HIST = `WHERE TB_ITCTRT_HIST.CUST_GB LIKE :organClassifi AND (TB_ITCTRT_HIST.STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) OR TB_ITCTRT_HIST.STATUS IS NULL) AND LOWER(TB_ITCTRT_HIST.CUST_CD) LIKE LOWER(:organCd)  AND LOWER(TB_ITCTRT_HIST.GDS_CD) LIKE LOWER(:productCode) `;
        } else {
            SQL_SEARCH = `WHERE TB_ITCTRT.CUST_GB LIKE :organClassifi AND TB_ITCTRT.STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) AND LOWER(TB_ITCTRT.CUST_CD) LIKE LOWER(:organCd)  AND LOWER(TB_ITCTRT.GDS_CD) LIKE LOWER(:productCode) `;
            SQL_SEARCH_HIST = `WHERE TB_ITCTRT_HIST.CUST_GB LIKE :organClassifi AND TB_ITCTRT_HIST.STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) AND LOWER(TB_ITCTRT_HIST.CUST_CD) LIKE LOWER(:organCd)  AND LOWER(TB_ITCTRT_HIST.GDS_CD) LIKE LOWER(:productCode) `;
        }
        let sql = SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT + SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + SQL_ORDER_BY  + SQL_LIMIT;
        let param = {
            organClassifi,
            organCd,
            productCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT +  SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + ')';
        let paramSearch = {
            organClassifi,
            organCd,
            productCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if ((organClassifi) && _.isEmpty(organCd) && _.isEmpty(productCode) && _.isEmpty(status)) {
        let SQL_SEARCH = 'WHERE TB_ITCTRT.CUST_GB LIKE :organClassifi ';
        let SQL_SEARCH_HIST = 'WHERE TB_ITCTRT_HIST.CUST_GB LIKE :organClassifi ';
        let sql = SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT + SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + SQL_ORDER_BY + SQL_ORDER_BY  + SQL_LIMIT;
        let param = {
            organClassifi,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT +  SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + ')';
        let paramSearch = {
            organClassifi,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if (_.isEmpty(organClassifi) && (organCd) && _.isEmpty(productCode) && _.isEmpty(status)) {
        let SQL_SEARCH = 'WHERE LOWER(TB_ITCTRT.CUST_CD) LIKE LOWER(:organCd) ';
        let SQL_SEARCH_HIST = 'WHERE LOWER(TB_ITCTRT_HIST.CUST_CD) LIKE LOWER(:organCd) ';
        let sql = SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT + SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + SQL_ORDER_BY  + SQL_LIMIT;
        let param = {
            organCd,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT +  SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + ')';
        let paramSearch = {
            organCd,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if (_.isEmpty(organClassifi) && _.isEmpty(organCd) && (productCode) && _.isEmpty(status)) {
        let SQL_SEARCH = 'WHERE LOWER(TB_ITCTRT.GDS_CD) LIKE LOWER(:productCode) ';
        let SQL_SEARCH_HIST = 'WHERE LOWER(TB_ITCTRT_HIST.GDS_CD) LIKE LOWER(:productCode) ';
        let sql = SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT + SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + SQL_ORDER_BY  + SQL_LIMIT;
        let param = {
            productCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT +  SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + ')';
        let paramSearch = {
            productCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if (_.isEmpty(organClassifi) && _.isEmpty(organCd) && _.isEmpty(productCode) && (status)) {
        let SQL_SEARCH;
        let SQL_SEARCH_HIST;
        if (status[0] == 0) {
            SQL_SEARCH = `WHERE TB_ITCTRT.STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) OR TB_ITCTRT.STATUS IS NULL `;
            SQL_SEARCH_HIST = `WHERE TB_ITCTRT_HIST.STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) OR TB_ITCTRT_HIST.STATUS IS NULL `;
        } else {
            SQL_SEARCH = `WHERE TB_ITCTRT.STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) `;
            SQL_SEARCH_HIST = `WHERE TB_ITCTRT_HIST.STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) `;
        }
        let sql = SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT + SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + SQL_ORDER_BY  + SQL_LIMIT;
        let param = {
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT +  SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + ')';
        let paramSearch = {
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if ((organClassifi) && (organCd) && _.isEmpty(productCode) && _.isEmpty(status)) {
        let SQL_SEARCH = 'WHERE TB_ITCTRT.CUST_GB LIKE :organClassifi AND LOWER(TB_ITCTRT.CUST_CD) LIKE LOWER(:organCd) ';
        let SQL_SEARCH_HIST = 'WHERE TB_ITCTRT_HIST.CUST_GB LIKE :organClassifi AND LOWER(TB_ITCTRT_HIST.CUST_CD) LIKE LOWER(:organCd) ';
        let sql = SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT + SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + SQL_ORDER_BY  + SQL_LIMIT;
        let param = {
            organClassifi,
            organCd,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT +  SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + ')';
        let paramSearch = {
            organClassifi,
            organCd,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if ((organClassifi) && _.isEmpty(organCd) && (productCode) && _.isEmpty(status)) {
        let SQL_SEARCH = 'WHERE TB_ITCTRT.CUST_GB LIKE :organClassifi AND LOWER(TB_ITCTRT.GDS_CD) LIKE LOWER(:productCode) ';
        let SQL_SEARCH_HIST = 'WHERE TB_ITCTRT_HIST.CUST_GB LIKE :organClassifi AND LOWER(TB_ITCTRT_HIST.GDS_CD) LIKE LOWER(:productCode) ';
        let sql = SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT + SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + SQL_ORDER_BY  + SQL_LIMIT;
        let param = {
            organClassifi,
            productCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT +  SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + ')';
        let paramSearch = {
            organClassifi,
            productCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if ((organClassifi) && _.isEmpty(organCd) && _.isEmpty(productCode) && (status)) {
        let SQL_SEARCH;
        let SQL_SEARCH_HIST;
        if (status[0] == 0) {
             SQL_SEARCH = `WHERE TB_ITCTRT.CUST_GB LIKE :organClassifi AND (TB_ITCTRT.STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) OR TB_ITCTRT.STATUS IS NULL) `;
             SQL_SEARCH_HIST = `WHERE TB_ITCTRT_HIST.CUST_GB LIKE :organClassifi AND (TB_ITCTRT_HIST.STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) OR TB_ITCTRT_HIST.STATUS IS NULL ) `;
        } else {
            SQL_SEARCH = `WHERE TB_ITCTRT.CUST_GB LIKE :organClassifi AND TB_ITCTRT.STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) `;
            SQL_SEARCH_HIST = `WHERE TB_ITCTRT_HIST.CUST_GB LIKE :organClassifi AND TB_ITCTRT_HIST.STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) `;
        }
        let sql = SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT + SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + SQL_ORDER_BY  + SQL_LIMIT;
        let param = {
            organClassifi,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT +  SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + ')';
        let paramSearch = {
            organClassifi,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if ( _.isEmpty(organClassifi) && (organCd) && (productCode) && _.isEmpty(status)) {
        let SQL_SEARCH = 'WHERE LOWER(TB_ITCTRT.CUST_CD) LIKE LOWER(:organCd)  AND LOWER(TB_ITCTRT.GDS_CD) LIKE LOWER(:productCode) ';
        let SQL_SEARCH_HIST = 'WHERE LOWER(TB_ITCTRT_HIST.CUST_CD) LIKE LOWER(:organCd)  AND LOWER(TB_ITCTRT_HIST.GDS_CD) LIKE LOWER(:productCode) ';
        let sql = SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT + SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + SQL_ORDER_BY  + SQL_LIMIT;
        let param = {
            organCd,
            productCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT +  SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + ')';
        let paramSearch = {
            organCd,
            productCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if ( _.isEmpty(organClassifi) && (organCd) && _.isEmpty(productCode) && (status)) {
        let SQL_SEARCH;
        let SQL_SEARCH_HIST;
        if (status[0] == 0) {
             SQL_SEARCH = `WHERE LOWER(TB_ITCTRT.CUST_CD) LIKE LOWER(:organCd)  AND (TB_ITCTRT.STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) OR TB_ITCTRT.STATUS IS NULL ) `;
             SQL_SEARCH_HIST = `WHERE LOWER(TB_ITCTRT_HIST.CUST_CD) LIKE LOWER(:organCd)  AND (TB_ITCTRT_HIST.STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) OR TB_ITCTRT_HIST.STATUS IS NULL ) `;
        } else {
            SQL_SEARCH = `WHERE LOWER(TB_ITCTRT.CUST_CD) LIKE LOWER(:organCd)  AND TB_ITCTRT.STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) `;
            SQL_SEARCH_HIST = `WHERE LOWER(TB_ITCTRT_HIST.CUST_CD) LIKE LOWER(:organCd)  AND TB_ITCTRT_HIST.STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) `;
        }
        let sql = SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT + SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + SQL_ORDER_BY  + SQL_LIMIT;
        let param = {
            organCd,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT +  SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + ')';
        let paramSearch = {
            organCd,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if ( _.isEmpty(organClassifi) && _.isEmpty(organCd) && (productCode) && (status)) {
        let SQL_SEARCH;
        let SQL_SEARCH_HIST;
        if (status[0] == 0) {
             SQL_SEARCH = `WHERE LOWER(TB_ITCTRT.GDS_CD) LIKE LOWER(:productCode)  AND (TB_ITCTRT.STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) OR TB_ITCTRT.STATUS IS NULL) `;
             SQL_SEARCH_HIST = `WHERE LOWER(TB_ITCTRT_HIST.GDS_CD) LIKE LOWER(:productCode)  AND (TB_ITCTRT_HIST.STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) OR TB_ITCTRT_HIST.STATUS IS NULL ) `;
        } else {
            SQL_SEARCH = `WHERE LOWER(TB_ITCTRT.GDS_CD) LIKE LOWER(:productCode)  AND TB_ITCTRT.STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) `;
            SQL_SEARCH_HIST = `WHERE LOWER(TB_ITCTRT_HIST.GDS_CD) LIKE LOWER(:productCode)  AND TB_ITCTRT_HIST.STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) `;
        }
        let sql = SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT + SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + SQL_ORDER_BY  + SQL_LIMIT;
        let param = {
            productCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT +  SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + ')';
        let paramSearch = {
            productCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if ( (organClassifi) && (organCd) && (productCode) && _.isEmpty(status)) {
        let SQL_SEARCH = 'WHERE TB_ITCTRT.CUST_GB LIKE :organClassifi  AND LOWER(TB_ITCTRT.CUST_CD) LIKE LOWER(:organCd)  AND LOWER(TB_ITCTRT.GDS_CD) LIKE LOWER(:productCode) ';
        let SQL_SEARCH_HIST = 'WHERE TB_ITCTRT_HIST.CUST_GB LIKE :organClassifi AND LOWER(TB_ITCTRT_HIST.CUST_CD) LIKE LOWER(:organCd)  AND LOWER(TB_ITCTRT_HIST.GDS_CD) LIKE LOWER(:productCode) ';
        let sql = SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT + SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + SQL_ORDER_BY  + SQL_LIMIT;
        let param = {
            organClassifi,
            organCd,
            productCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT +  SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + ')';
        let paramSearch = {
            organClassifi,
            organCd,
            productCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if ( _.isEmpty(organClassifi) && (organCd) && (productCode) && (status)) {
        let SQL_SEARCH;
        let SQL_SEARCH_HIST;
        if (status[0] == 0) {
             SQL_SEARCH = `WHERE (TB_ITCTRT.STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) OR TB_ITCTRT.STATUS IS NULL ) AND LOWER(TB_ITCTRT.CUST_CD) LIKE LOWER(:organCd)  AND LOWER(TB_ITCTRT.GDS_CD) LIKE LOWER(:productCode) `;
             SQL_SEARCH_HIST = `WHERE (TB_ITCTRT_HIST.STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) OR TB_ITCTRT_HIST.STATUS IS NULL ) AND LOWER(TB_ITCTRT_HIST.CUST_CD) LIKE LOWER(:organCd)  AND LOWER(TB_ITCTRT_HIST.GDS_CD) LIKE LOWER(:productCode) `;
        } else {
            SQL_SEARCH = `WHERE TB_ITCTRT.STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")})  AND LOWER(TB_ITCTRT.CUST_CD) LIKE LOWER(:organCd)  AND LOWER(TB_ITCTRT.GDS_CD) LIKE LOWER(:productCode) `;
            SQL_SEARCH_HIST = `WHERE TB_ITCTRT_HIST.STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) AND LOWER(TB_ITCTRT_HIST.CUST_CD) LIKE LOWER(:organCd)  AND LOWER(TB_ITCTRT_HIST.GDS_CD) LIKE LOWER(:productCode) `;
        }
        let sql = SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT + SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + SQL_ORDER_BY  + SQL_LIMIT;
        let param = {
            organCd,
            productCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT +  SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + ')';
        let paramSearch = {
            organCd,
            productCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if ( (organClassifi) && _.isEmpty(organCd) && (productCode) && (status)) {
        let SQL_SEARCH;
        let SQL_SEARCH_HIST;
        if (status[0] == 0) {
             SQL_SEARCH = `WHERE (TB_ITCTRT.STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) OR TB_ITCTRT.STATUS IS NULL ) AND TB_ITCTRT.CUST_GB LIKE :organClassifi  AND LOWER(TB_ITCTRT.GDS_CD) LIKE LOWER(:productCode) `;
             SQL_SEARCH_HIST = `WHERE ( TB_ITCTRT_HIST.STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) OR TB_ITCTRT_HIST.STATUS IS NULL ) AND TB_ITCTRT_HIST.CUST_GB LIKE :organClassifi  AND LOWER(TB_ITCTRT_HIST.GDS_CD) LIKE LOWER(:productCode) `;
        } else {
            SQL_SEARCH = `WHERE TB_ITCTRT.STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")})  AND TB_ITCTRT.CUST_GB LIKE :organClassifi  AND LOWER(TB_ITCTRT.GDS_CD) LIKE LOWER(:productCode) `;
            SQL_SEARCH_HIST = `WHERE TB_ITCTRT_HIST.STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) AND TB_ITCTRT_HIST.CUST_GB LIKE :organClassifi  AND LOWER(TB_ITCTRT_HIST.GDS_CD) LIKE LOWER(:productCode) `;
        }
        let sql = SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT + SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + SQL_ORDER_BY  + SQL_LIMIT;
        let param = {
            organClassifi,
            productCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT +  SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + ')';
        let paramSearch = {
            organClassifi,
            productCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if ( (organClassifi) && (organCd) && _.isEmpty(productCode) && (status)) {
        let SQL_SEARCH;
        let SQL_SEARCH_HIST;
        if (status[0] == 0) {
             SQL_SEARCH = `WHERE (TB_ITCTRT.STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) OR TB_ITCTRT.STATUS IS NULL ) AND TB_ITCTRT.CUST_GB LIKE :organClassifi  AND LOWER(TB_ITCTRT.CUST_CD) LIKE LOWER(:organCd) `;
             SQL_SEARCH_HIST = `WHERE (TB_ITCTRT_HIST.STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) OR TB_ITCTRT_HIST.STATUS IS NULL ) AND TB_ITCTRT_HIST.CUST_GB LIKE :organClassifi  AND LOWER(TB_ITCTRT_HIST.CUST_CD) LIKE LOWER(:organCd) `;
        } else {
            SQL_SEARCH = `WHERE TB_ITCTRT.STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")})  AND TB_ITCTRT.CUST_GB LIKE :organClassifi  AND LOWER(TB_ITCTRT.CUST_CD) LIKE LOWER(:organCd) `;
            SQL_SEARCH_HIST = `WHERE TB_ITCTRT_HIST.STATUS IN (${status.map((name, index) => `'${name}'`).join(", ")}) AND TB_ITCTRT_HIST.CUST_GB LIKE :organClassifi  AND LOWER(TB_ITCTRT_HIST.CUST_CD) LIKE LOWER(:organCd) `;
        }
        let sql = SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT + SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + SQL_ORDER_BY  + SQL_LIMIT;
        let param = {
            organClassifi,
            organCd,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT +  SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + ')';
        let paramSearch = {
            organClassifi,
            organCd,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
};
exports.checkExistContract = async function(req, res) {
    let cusGB = req.body.cusGB;
    let custCD = req.body.custCD;
    let gdsCD = req.body.gdsCD;
    let validStartDt = (_.isEmpty(req.body.validStartDt) ? null : req.body.validStartDt.replace(/[^0-9 ]/g, ""));
    let sqlCheckErrorContractExist = `SELECT * FROM TB_ITCTRT WHERE CUST_GB =:cusGB AND CUST_CD =:custCD AND GDS_CD =:gdsCD AND VALID_START_DT =:validStartDt AND STATUS = 1 `;
    let sqlCheckExistContract = `SELECT * FROM TB_ITCTRT WHERE CUST_GB =:cusGB AND CUST_CD =:custCD AND GDS_CD =:gdsCD AND STATUS = 1 `;
    let paramCheckExistContract = {
        cusGB,
        custCD,
        gdsCD
    }
    let paramCheckErrorContractExist = {
        cusGB,
        custCD,
        gdsCD,
        validStartDt
    }
    let resultCheckErrorContractExist = await oracelService.checkExistContract(res,sqlCheckErrorContractExist,paramCheckErrorContractExist,optionFormatObj);
    if (resultCheckErrorContractExist[0]) {
        return res.status(500).send({message: 'Contract already exist.Please check and try again later'});
    }
    let resultCheckExistContract = await oracelService.checkExistContract(res, sqlCheckExistContract , paramCheckExistContract ,optionFormatObj);
    if (resultCheckExistContract[0]) {
        return res.status(200).send({message: 'The contract already exist'});
    } else {
        return res.status(200).send({saveContract: 'Saving contract'});
    }
}

exports.insertContract = async function (req, res) {
    let cusGB = req.body.cusGB;
    let custCD = req.body.custCD;
    let gdsCD = req.body.gdsCD;
    let validStartDt = (_.isEmpty(req.body.validStartDt) ? null : req.body.validStartDt.replace(/[^0-9 ]/g, ""));
    let validEndDt = (_.isEmpty(req.body.validEndDt) ? null : req.body.validEndDt.replace(/[^0-9 ]/g, ""));
    let sysDTim = dateFormat(new Date(), "yyyymmddHHMMss");
    let workID = req.body.workID;
    let status = 1;

    let SQL = 'INSERT INTO TB_ITCTRT (CUST_GB, CUST_CD, GDS_CD, VALID_START_DT, VALID_END_DT, SYS_DTIM, WORK_ID, STATUS) VALUES (:cusGB, :custCD, :gdsCD, :validStartDt, :validEndDt, :sysDTim, :workID , :status)';
    let params = {
        cusGB: { val: cusGB },
        custCD: { val: custCD },
        gdsCD: { val: gdsCD },
        validStartDt: { val: validStartDt },
        validEndDt: { val: validEndDt },
        sysDTim: { val: sysDTim },
        workID: { val: workID },
        status: { val: status },
    };
    await oracelService.queryOracel(res, SQL, params, optionAutoCommit)
};

exports.updateContract = async function (req, res) {
    let cusGB = req.body.cusGB;
    let custCD = req.body.custCD;
    let gdsCD = req.body.gdsCD;
    let validStartDt = (_.isEmpty(req.body.validStartDt) ? null : req.body.validStartDt.replace(/[^0-9 ]/g, ""));
    let validEndDt = (_.isEmpty(req.body.validEndDt) ? null : req.body.validEndDt.replace(/[^0-9 ]/g, ""));
    let sysDTim = dateFormat(new Date(), "yyyymmddHHMMss");
    let status = req.body.status;
    if (status == 2) {
        status = null;
    }
    let SQL = 'UPDATE TB_ITCTRT SET  VALID_END_DT = :validEndDt, STATUS = :status , SYS_DTIM = :sysDTim WHERE GDS_CD = :gdsCD AND CUST_GB = :cusGB AND CUST_CD =:custCD AND VALID_START_DT =:validStartDt ' ;

    let params = {
        gdsCD: { val: gdsCD },
        cusGB: { val: cusGB },
        custCD: { val: custCD },
        validStartDt: { val: validStartDt },
        validEndDt: { val: validEndDt },
        sysDTim: { val: sysDTim },
        status: {val: status}
    };
    await oracelService.queryOracel(res, SQL, params, optionAutoCommit)
};



