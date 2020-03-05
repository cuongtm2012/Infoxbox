const oracledb = require('oracledb');
const oracelService = require('../services/oracelQuery.service');
var _ = require('lodash');
const optionFormatObj = { outFormat: oracledb.OUT_FORMAT_OBJECT };
const optionAutoCommit = { autoCommit: true };

exports.getProduct = async function (req, res) {
    var productCode = req.query.productCode ? '%' + req.query.productCode + '%' : '';
    var productNM = req.query.productNM ? '%' + req.query.productNM + '%' : '';
    var currentLocation = req.query.currentLocation;
    var limitRow = req.query.limitRow;
    var SQL_SELECT = `SELECT TB_ITCODE.CODE, TB_ITCODE.CODE_NM `;
    var SQL_SELECT_COUNT = `SELECT COUNT(*) AS total `;
    var SQL_FROM = `FROM TB_ITCODE WHERE TB_ITCODE.CD_CLASS = 'C0005' `;
    var SQL_LIMIT = 'OFFSET :currentLocation ROWS FETCH NEXT :limitRow ROWS ONLY ';

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
        let paramSearch = {};
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
        let paramSearch = {};
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
        let paramSearch = {};
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
};

exports.getContract = async function (req, res) {
    var organClassifi = req.query.organClassifi ? '%' + req.query.organClassifi + '%' : '';
    var organCd = req.query.organCd ? '%' + req.query.organCd + '%' : '';
    var organNM = req.query.organNM ? '%' + req.query.organNM + '%' : '';
    var productCode =req.query.productCode ? '%' + req.query.productCode + '%' : '';
    var currentLocation = req.query.currentLocation;
    var limitRow = req.query.limitRow;
    var SQL_SELECT = `SELECT 
    TB_ITCTRT.CUST_GB as CLASS, 
    TB_ITCTRT.CUST_CD as CUST_CODE, 
    TB_ITCTRT.GDS_CD as PRODUCT_CODE, 
    TB_ITCUST.CUST_NM as CUST_NM,
    TB_ITCUST.BRANCH_NM as BRANCH_NM,
    TB_ITCODE.CODE_NM as CODE_NM,
    to_char(to_date(TB_ITCTRT.VALID_START_DT, 'yyyymmdd'),'yyyy/mm/dd') AS VALID_START_DT ,
    to_char(to_date(TB_ITCTRT.VALID_END_DT, 'yyyymmdd'),'yyyy/mm/dd') AS VALID_END_DT ,
    to_char(to_date(TB_ITCTRT.SYS_DTIM, 'YYYY/MM/DD HH24:MI:SS'),'yyyy/mm/dd hh24:mi:ss') AS SYS_DTIM , 
    TB_ITCTRT.WORK_ID as WORK_ID  `;
    var SQL_SELECT_COUNT = `SELECT COUNT(*) AS total `;
    var SQL_FROM = 'FROM TB_ITCTRT ';
    var SQL_INNER_JOIN = 'LEFT JOIN TB_ITCUST ON TB_ITCUST.CUST_CD = TB_ITCTRT.CUST_CD AND TB_ITCUST.CUST_GB = TB_ITCTRT.CUST_GB LEFT JOIN TB_ITCODE ON TB_ITCTRT.GDS_CD = TB_ITCODE.CODE ';
    var SQL_ORDER_BY = 'ORDER BY TB_ITCTRT.CUST_CD ';
    var SQL_LIMIT = 'OFFSET :currentLocation ROWS FETCH NEXT :limitRow ROWS ONLY ';
    if (_.isEmpty(organClassifi) && _.isEmpty(organCd) && _.isEmpty(organNM) && _.isEmpty(productCode)) {
        let sql = SQL_SELECT + SQL_FROM + SQL_INNER_JOIN + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_INNER_JOIN;
        let paramSearch = {};
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if ((organClassifi) && (organCd) && (organNM) && (productCode)) {
        let SQL_SEARCH = 'WHERE TB_ITCTRT.CUST_GB LIKE :organClassifi AND TB_ITCTRT.CUST_CD LIKE :organCd AND TB_ITCUST.CUST_NM LIKE :organNM AND TB_ITCTRT.GDS_CD LIKE :productCode ';
        let sql = SQL_SELECT + SQL_FROM + SQL_INNER_JOIN + SQL_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            organClassifi,
            organCd,
            productCode,
            organNM,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_INNER_JOIN + SQL_SEARCH;
        let paramSearch = {
            organClassifi,
            organCd,
            productCode,
            organNM,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if ((organClassifi) && _.isEmpty(organCd) && _.isEmpty(organNM) && _.isEmpty(productCode)) {
        let SQL_SEARCH = 'WHERE TB_ITCTRT.CUST_GB LIKE :organClassifi ';
        let sql = SQL_SELECT + SQL_FROM + SQL_INNER_JOIN + SQL_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            organClassifi,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_INNER_JOIN + SQL_SEARCH;
        let paramSearch = {organClassifi,};
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if (_.isEmpty(organClassifi) && (organCd) && _.isEmpty(organNM) && _.isEmpty(productCode)) {
        let SQL_SEARCH = 'WHERE TB_ITCTRT.CUST_CD LIKE :organCd ';
        let sql = SQL_SELECT + SQL_FROM + SQL_INNER_JOIN + SQL_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            organCd,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_INNER_JOIN + SQL_SEARCH;
        let paramSearch = {organCd,};
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if (_.isEmpty(organClassifi) && _.isEmpty(organCd) && (organNM) && _.isEmpty(productCode)) {
        let SQL_SEARCH = 'WHERE TB_ITCUST.CUST_NM LIKE :organNM ';
        let sql = SQL_SELECT + SQL_FROM + SQL_INNER_JOIN + SQL_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            organNM,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_INNER_JOIN + SQL_SEARCH;
        let paramSearch = {organNM,};
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if (_.isEmpty(organClassifi) && _.isEmpty(organCd) && _.isEmpty(organNM) && (productCode)) {
        let SQL_SEARCH = 'WHERE TB_ITCTRT.GDS_CD LIKE :productCode ';
        let sql = SQL_SELECT + SQL_FROM + SQL_INNER_JOIN + SQL_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            productCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_INNER_JOIN + SQL_SEARCH;
        let paramSearch = { productCode,};
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if ((organClassifi) && (organCd) && _.isEmpty(organNM) && _.isEmpty(productCode)) {
        let SQL_SEARCH = 'WHERE TB_ITCTRT.CUST_GB LIKE :organClassifi AND TB_ITCTRT.CUST_CD LIKE :organCd ';
        let sql = SQL_SELECT + SQL_FROM + SQL_INNER_JOIN + SQL_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            organClassifi,
            organCd,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_INNER_JOIN + SQL_SEARCH;
        let paramSearch = { organClassifi,
            organCd,};
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if ((organClassifi) && _.isEmpty(organCd) && (organNM) && _.isEmpty(productCode)) {
        let SQL_SEARCH = 'WHERE TB_ITCTRT.CUST_GB LIKE :organClassifi AND TB_ITCUST.CUST_NM LIKE :organNM ';
        let sql = SQL_SELECT + SQL_FROM + SQL_INNER_JOIN + SQL_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            organClassifi,
            organNM,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_INNER_JOIN + SQL_SEARCH;
        let paramSearch = {organClassifi,
            organNM,};
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if ((organClassifi) && _.isEmpty(organCd) && _.isEmpty(organNM) && (productCode)) {
        let SQL_SEARCH = 'WHERE TB_ITCTRT.CUST_GB LIKE :organClassifi AND TB_ITCTRT.GDS_CD LIKE :productCode ';
        let sql = SQL_SELECT + SQL_FROM + SQL_INNER_JOIN + SQL_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            organClassifi,
            productCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_INNER_JOIN + SQL_SEARCH;
        let paramSearch = { organClassifi,
            productCode,};
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if (_.isEmpty(organClassifi) && (organCd) && (organNM) && _.isEmpty(productCode)) {
        let SQL_SEARCH = 'WHERE TB_ITCTRT.CUST_CD LIKE :organCd AND TB_ITCUST.CUST_NM LIKE :organNM ';
        let sql = SQL_SELECT + SQL_FROM + SQL_INNER_JOIN + SQL_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            organCd,
            organNM,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_INNER_JOIN + SQL_SEARCH;
        let paramSearch = {organCd,
            organNM,};
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if (_.isEmpty(organClassifi) && (organCd) && _.isEmpty(organNM) && (productCode)) {
        let SQL_SEARCH = 'WHERE TB_ITCTRT.CUST_CD LIKE :organCd AND TB_ITCTRT.GDS_CD LIKE :productCode ';
        let sql = SQL_SELECT + SQL_FROM + SQL_INNER_JOIN + SQL_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            organCd,
            productCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_INNER_JOIN + SQL_SEARCH;
        let paramSearch = {organCd,
            productCode,};
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if (_.isEmpty(organClassifi) && _.isEmpty(organCd) && (organNM) && (productCode)) {
        let SQL_SEARCH = 'WHERE TB_ITCUST.CUST_NM LIKE :organNM AND TB_ITCTRT.GDS_CD LIKE :productCode ';
        let sql = SQL_SELECT + SQL_FROM + SQL_INNER_JOIN + SQL_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            organNM,
            productCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_INNER_JOIN + SQL_SEARCH;
        let paramSearch = { organNM,
            productCode,};
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if ((organClassifi) && (organCd) && (organNM) && _.isEmpty(productCode)) {
        let SQL_SEARCH = 'WHERE TB_ITCTRT.CUST_GB LIKE :organClassifi AND TB_ITCTRT.CUST_CD LIKE :organCd AND TB_ITCUST.CUST_NM LIKE :organNM ';
        let sql = SQL_SELECT + SQL_FROM + SQL_INNER_JOIN + SQL_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            organClassifi,
            organCd,
            organNM,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_INNER_JOIN + SQL_SEARCH;
        let paramSearch = {organClassifi,
            organCd,
            organNM,};
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if (_.isEmpty(organClassifi) && (organCd) && (organNM) && (productCode)) {
        let SQL_SEARCH = 'WHERE TB_ITCTRT.CUST_CD LIKE :organCd AND TB_ITCUST.CUST_NM LIKE :organNM AND TB_ITCTRT.GDS_CD LIKE :productCode ';
        let sql = SQL_SELECT + SQL_FROM + SQL_INNER_JOIN + SQL_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            productCode,
            organCd,
            organNM,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_INNER_JOIN + SQL_SEARCH;
        let paramSearch = { productCode,
            organCd,
            organNM,};
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if ((organClassifi) && _.isEmpty(organCd) && (organNM) && (productCode)) {
        let SQL_SEARCH = 'WHERE TB_ITCTRT.CUST_GB LIKE :organClassifi AND TB_ITCUST.CUST_NM LIKE :organNM AND TB_ITCTRT.GDS_CD LIKE :productCode ';
        let sql = SQL_SELECT + SQL_FROM + SQL_INNER_JOIN + SQL_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            productCode,
            organClassifi,
            organNM,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_INNER_JOIN + SQL_SEARCH;
        let paramSearch = {productCode,
            organClassifi,
            organNM,};
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if ((organClassifi) && (organCd) && _.isEmpty(organNM) && (productCode)) {
        let SQL_SEARCH = 'WHERE TB_ITCTRT.CUST_GB LIKE :organClassifi AND TB_ITCTRT.CUST_CD LIKE :organCd AND TB_ITCTRT.GDS_CD LIKE :productCode ';
        let sql = SQL_SELECT + SQL_FROM + SQL_INNER_JOIN + SQL_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            productCode,
            organClassifi,
            organCd,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_INNER_JOIN + SQL_SEARCH;
        let paramSearch = {productCode,
            organClassifi,
            organCd,};
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
};

exports.insertContract = async function (req, res) {
    var cusGB = req.body.cusGB;
    var custCD = req.body.custCD;
    var gdsCD = req.body.gdsCD;
    var validStartDt = (_.isEmpty(req.body.validStartDt) ? null : req.body.validStartDt.replace(/[^0-9 ]/g, ""));
    var validEndDt = (_.isEmpty(req.body.validEndDt) ? null : req.body.validEndDt.replace(/[^0-9 ]/g, ""));
    var sysDTim = req.body.sysDTim.replace(/[^0-9 ]/g, "");
    var workID = req.body.workID;

    var SQL = 'INSERT INTO TB_ITCTRT (CUST_GB, CUST_CD, GDS_CD, VALID_START_DT, VALID_END_DT, SYS_DTIM, WORK_ID) VALUES (:cusGB, :custCD, :gdsCD, :validStartDt, :validEndDt, :sysDTim, :workID)';
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

exports.updateContract = async function (req, res) {
    var gdsCD = req.body.gdsCD;
    var validEndDt = (_.isEmpty(req.body.validEndDt) ? null : req.body.validEndDt.replace(/[^0-9 ]/g, ""));
    var SQL = 'UPDATE TB_ITCTRT SET  VALID_END_DT = :validEndDt WHERE GDS_CD = :gdsCD';

    let params = {
        gdsCD: { val: gdsCD },
        validEndDt: { val: validEndDt },
    };
    oracelService.queryOracel(res, SQL, params, optionAutoCommit)
};



