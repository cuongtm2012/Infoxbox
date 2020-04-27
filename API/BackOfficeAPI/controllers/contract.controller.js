const oracledb = require('oracledb');
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
    let organClassifi = req.query.organClassifi ? '%' + req.query.organClassifi + '%' : '';
    let organCd = req.query.organCd ? '%' + req.query.organCd + '%' : '';
    let productCode =req.query.productCode ? '%' + req.query.productCode + '%' : '';
    let status = req.query.status ? req.query.status : '';
    let currentLocation = req.query.currentLocation;
    let limitRow = req.query.limitRow;
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
    let SQL_LIMIT = ' OFFSET :currentLocation ROWS FETCH NEXT :limitRow ROWS ONLY ';
    if (_.isEmpty(organClassifi) && _.isEmpty(organCd) && _.isEmpty(productCode) && _.isEmpty(status)) {
        let sql = SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT + SQL_INNER_JOIN_IT_CTRT + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_LIMIT;
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
        let SQL_SEARCH = 'WHERE TB_ITCTRT.CUST_GB LIKE :organClassifi AND TB_ITCTRT.STATUS LIKE :status AND LOWER(TB_ITCTRT.CUST_CD) LIKE LOWER(:organCd)  AND LOWER(TB_ITCTRT.GDS_CD) LIKE LOWER(:productCode) ';
        let SQL_SEARCH_HIST = 'WHERE TB_ITCTRT_HIST.CUST_GB LIKE :organClassifi AND TB_ITCTRT_HIST.STATUS LIKE :status AND LOWER(TB_ITCTRT_HIST.CUST_CD) LIKE LOWER(:organCd)  AND LOWER(TB_ITCTRT_HIST.GDS_CD) LIKE LOWER(:productCode) ';
        let sql = SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT + SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + SQL_LIMIT;
        let param = {
            organClassifi,
            organCd,
            productCode,
            status,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT +  SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + ')';
        let paramSearch = {
            organClassifi,
            organCd,
            productCode,
            status,
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
        let sql = SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT + SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + SQL_LIMIT;
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
        let sql = SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT + SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + SQL_LIMIT;
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
        let sql = SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT + SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + SQL_LIMIT;
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
        let SQL_SEARCH = 'WHERE TB_ITCTRT.STATUS LIKE :status ';
        let SQL_SEARCH_HIST = 'WHERE TB_ITCTRT_HIST.STATUS LIKE :status ';
        let sql = SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT + SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + SQL_LIMIT;
        let param = {
            status,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT +  SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + ')';
        let paramSearch = {
            status,
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
        let sql = SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT + SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + SQL_LIMIT;
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
        let sql = SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT + SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + SQL_LIMIT;
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
        let SQL_SEARCH = 'WHERE TB_ITCTRT.CUST_GB LIKE :organClassifi AND TB_ITCTRT.STATUS LIKE :status ';
        let SQL_SEARCH_HIST = 'WHERE TB_ITCTRT_HIST.CUST_GB LIKE :organClassifi AND TB_ITCTRT_HIST.STATUS LIKE :status ';
        let sql = SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT + SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + SQL_LIMIT;
        let param = {
            organClassifi,
            status,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT +  SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + ')';
        let paramSearch = {
            organClassifi,
            status,
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
        let sql = SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT + SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + SQL_LIMIT;
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
        let SQL_SEARCH = 'WHERE LOWER(TB_ITCTRT.CUST_CD) LIKE LOWER(:organCd)  AND TB_ITCTRT.STATUS LIKE :status ';
        let SQL_SEARCH_HIST = 'WHERE LOWER(TB_ITCTRT_HIST.CUST_CD) LIKE LOWER(:organCd)  AND TB_ITCTRT_HIST.STATUS LIKE :status ';
        let sql = SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT + SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + SQL_LIMIT;
        let param = {
            organCd,
            status,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT +  SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + ')';
        let paramSearch = {
            organCd,
            status,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if ( _.isEmpty(organClassifi) && _.isEmpty(organCd) && (productCode) && (status)) {
        let SQL_SEARCH = 'WHERE LOWER(TB_ITCTRT.GDS_CD) LIKE LOWER(:productCode)  AND TB_ITCTRT.STATUS LIKE :status ';
        let SQL_SEARCH_HIST = 'WHERE LOWER(TB_ITCTRT_HIST.GDS_CD) LIKE LOWER(:productCode)  AND TB_ITCTRT_HIST.STATUS LIKE :status ';
        let sql = SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT + SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + SQL_LIMIT;
        let param = {
            productCode,
            status,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT +  SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + ')';
        let paramSearch = {
            productCode,
            status,
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
        let sql = SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT + SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + SQL_LIMIT;
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
        let SQL_SEARCH = 'WHERE TB_ITCTRT.STATUS LIKE :status  AND LOWER(TB_ITCTRT.CUST_CD) LIKE LOWER(:organCd)  AND LOWER(TB_ITCTRT.GDS_CD) LIKE LOWER(:productCode) ';
        let SQL_SEARCH_HIST = 'WHERE TB_ITCTRT_HIST.STATUS LIKE :status AND LOWER(TB_ITCTRT_HIST.CUST_CD) LIKE LOWER(:organCd)  AND LOWER(TB_ITCTRT_HIST.GDS_CD) LIKE LOWER(:productCode) ';
        let sql = SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT + SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + SQL_LIMIT;
        let param = {
            status,
            organCd,
            productCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT +  SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + ')';
        let paramSearch = {
            status,
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
        let SQL_SEARCH = 'WHERE TB_ITCTRT.STATUS LIKE :status  AND TB_ITCTRT.CUST_GB LIKE :organClassifi  AND LOWER(TB_ITCTRT.GDS_CD) LIKE LOWER(:productCode) ';
        let SQL_SEARCH_HIST = 'WHERE TB_ITCTRT_HIST.STATUS LIKE :status AND TB_ITCTRT_HIST.CUST_GB LIKE :organClassifi  AND LOWER(TB_ITCTRT_HIST.GDS_CD) LIKE LOWER(:productCode) ';
        let sql = SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT + SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + SQL_LIMIT;
        let param = {
            status,
            organClassifi,
            productCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT +  SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + ')';
        let paramSearch = {
            status,
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
        let SQL_SEARCH = 'WHERE TB_ITCTRT.STATUS LIKE :status  AND TB_ITCTRT.CUST_GB LIKE :organClassifi  AND LOWER(TB_ITCTRT.CUST_CD) LIKE LOWER(:organCd) ';
        let SQL_SEARCH_HIST = 'WHERE TB_ITCTRT_HIST.STATUS LIKE :status AND TB_ITCTRT_HIST.CUST_GB LIKE :organClassifi  AND LOWER(TB_ITCTRT_HIST.CUST_CD) LIKE LOWER(:organCd) ';
        let sql = SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT + SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + SQL_LIMIT;
        let param = {
            status,
            organClassifi,
            organCd,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_ITCTRT + SQL_FROM_TB_ITCTRT +  SQL_INNER_JOIN_IT_CTRT + SQL_SEARCH + UNION_ALL + SQL_SELECT_ITCTRT_HIST + SQL_FROM_TB_ITCTRT_HIST + SQL_INNER_JOIN_IT_CTRT_HIST + SQL_SEARCH_HIST + ')';
        let paramSearch = {
            status,
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
exports.insertContract = async function (req, res) {
    let cusGB = req.body.cusGB;
    let custCD = req.body.custCD;
    let gdsCD = req.body.gdsCD;
    let validStartDt = (_.isEmpty(req.body.validStartDt) ? null : req.body.validStartDt.replace(/[^0-9 ]/g, ""));
    let validEndDt = (_.isEmpty(req.body.validEndDt) ? null : req.body.validEndDt.replace(/[^0-9 ]/g, ""));
    let sysDTim = req.body.sysDTim.replace(/[^0-9 ]/g, "");
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
    let status = req.body.status;
    let SQL = 'UPDATE TB_ITCTRT SET  VALID_END_DT = :validEndDt, STATUS = :status WHERE GDS_CD = :gdsCD AND CUST_GB = :cusGB AND CUST_CD =:custCD AND VALID_START_DT =:validStartDt ' ;

    let params = {
        gdsCD: { val: gdsCD },
        cusGB: { val: cusGB },
        custCD: { val: custCD },
        validStartDt: { val: validStartDt },
        validEndDt: { val: validEndDt },
        status: {val: status}
    };
    await oracelService.queryOracel(res, SQL, params, optionAutoCommit)
};



