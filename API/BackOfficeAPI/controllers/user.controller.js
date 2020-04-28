const oracledb = require('oracledb');
var bcrypt = require('bcrypt');
const oracelService = require('../services/oracelQuery.service');
var _ = require('lodash');
const optionFormatObj = { outFormat: oracledb.OUT_FORMAT_OBJECT };
const optionAutoCommit = { autoCommit: true };
const saltRounds = 10;
const defaultPW = 'nice1234';


exports.getUserInfo = async function (req, res) {
    var userClass = req.query.userClass ? '%' + req.query.userClass + '%' : '';
    var userID = req.query.userID ? '%' + req.query.userID + '%' : '';
    var userName = req.query.userName ? '%' + req.query.userName + '%' : '';
    var orgCode = req.query.orgCode ? '%' + req.query.orgCode + '%' : '';
    var active = req.query.active ? req.query.active : '';
    var currentLocation = req.query.currentLocation;
    var limitRow = req.query.limitRow;

    var SQL_SELECT_USER = ` SELECT
    TB_ROLE.ROLE as ROLE,
    TB_ROLE.ROLE_ID as ROLE_ID,
    TB_ITCUST.CUST_NM as CUST_NM,
    TB_ITUSER.USER_ID as USER_ID,
    TB_ITUSER.USER_NM as USER_NM,
    TB_ITUSER.CUST_CD as CUST_CD,
    TB_ITUSER.INOUT_GB as INOUT_GB,
    TB_ITUSER. ADDR as ADDR,
    TB_ITUSER.EMAIL as EMAIL,
    TB_ITUSER.TEL_NO_MOBILE as TEL_NO_MOBILE,
    TB_ITUSER.ACTIVE as ACTIVE,
    to_char(to_date(TB_ITUSER.SYS_DTIM, 'YYYY/MM/DD HH24:MI:SS'),'yyyy/mm/dd hh24:mi:ss') as SYS_DTIM,
    to_char(to_date(TB_ITUSER.VALID_START_DT, 'yyyymmdd'),'yyyy/mm/dd') as VALID_START_DT,
    to_char(to_date(TB_ITUSER.VALID_END_DT, 'yyyymmdd'),'yyyy/mm/dd') as VALID_END_DT,
    TB_ITUSER.WORK_ID as WORK_ID `;
    var SQL_SELECT_USER_HIST = ` SELECT
    TB_ROLE.ROLE as ROLE,
    TB_ROLE.ROLE_ID as ROLE_ID,
    TB_ITCUST.CUST_NM as CUST_NM,
    TB_ITUSER_HIST.USER_ID as USER_ID,
    TB_ITUSER_HIST.USER_NM as USER_NM,
    TB_ITUSER_HIST.CUST_CD as CUST_CD,
    TB_ITUSER_HIST.INOUT_GB as INOUT_GB,
    TB_ITUSER_HIST. ADDR as ADDR,
    TB_ITUSER_HIST.EMAIL as EMAIL,
    TB_ITUSER_HIST.TEL_NO_MOBILE as TEL_NO_MOBILE,
    TB_ITUSER_HIST.ACTIVE as ACTIVE,
    to_char(to_date(TB_ITUSER_HIST.SYS_DTIM, 'YYYY/MM/DD HH24:MI:SS'),'yyyy/mm/dd hh24:mi:ss') as SYS_DTIM,
    to_char(to_date(TB_ITUSER_HIST.VALID_START_DT, 'yyyymmdd'),'yyyy/mm/dd') as VALID_START_DT,
    to_char(to_date(TB_ITUSER_HIST.VALID_END_DT, 'yyyymmdd'),'yyyy/mm/dd') as VALID_END_DT,
    TB_ITUSER_HIST.WORK_ID as WORK_ID `;
    var SQL_SELECT_COUNT = `SELECT COUNT(*) AS total FROM `;
    var UNION_ALL = ' UNION ALL ';
    var SQL_FROM_USER = ' FROM TB_ITUSER ';
    var SQL_FROM_USER_HIST = ' FROM TB_ITUSER_HIST ';
    var SQL_JOIN_USER = ' LEFT JOIN TB_ITCUST ON TB_ITUSER.CUST_CD = TB_ITCUST.CUST_CD INNER JOIN TB_ROLE ON TB_ITUSER.ROLE_ID = TB_ROLE.ROLE_ID ';
    var SQL_JOIN_USER_HIST = ' LEFT JOIN TB_ITCUST ON TB_ITUSER_HIST.CUST_CD = TB_ITCUST.CUST_CD INNER JOIN TB_ROLE ON TB_ITUSER_HIST.ROLE_ID = TB_ROLE.ROLE_ID ';
    var SQL_LIMIT = ' OFFSET :currentLocation ROWS FETCH NEXT :limitRow ROWS ONLY ';

    if (_.isEmpty(userClass) && _.isEmpty(userID) && _.isEmpty(userName) && _.isEmpty(orgCode) && _.isEmpty(active)) {
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_LIMIT;
        let param = {
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + ')';
        let paramSearch = {};
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if ((userClass) && (userID) && (userName) && (orgCode) && (active)) {
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.INOUT_GB LIKE :userClass ' +
            'AND TB_ITUSER.USER_ID LIKE :userID ' +
            'AND LOWER(TB_ITUSER.USER_NM) LIKE LOWER(:userName) ' +
            'AND LOWER(TB_ITUSER.CUST_CD) LIKE LOWER(:orgCode) AND TB_ITUSER.ACTIVE LIKE :active ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE TB_ITUSER_HIST.INOUT_GB LIKE :userClass ' +
            'AND TB_ITUSER_HIST.USER_ID LIKE :userID ' +
            'AND LOWER(TB_ITUSER_HIST.USER_NM) LIKE LOWER(:userName) ' +
            'AND LOWER(TB_ITUSER_HIST.CUST_CD) LIKE LOWER(:orgCode) AND TB_ITUSER_HIST.ACTIVE LIKE :active ';
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST + SQL_LIMIT;
        let param = {
            userClass,
            userID,
            orgCode,
            userName,
            active,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST  + ')';
        let paramSearch = {
            userClass,
            userID,
            orgCode,
            userName,
            active,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if((userClass) && _.isEmpty(userID) && _.isEmpty(userName) && _.isEmpty(orgCode) && _.isEmpty(active)) {
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.INOUT_GB LIKE :userClass ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE TB_ITUSER_HIST.INOUT_GB LIKE :userClass ';
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST + SQL_LIMIT;
        let param = {
            userClass,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST  + ')';
        let paramSearch = {
            userClass,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(userClass) && (userID) && _.isEmpty(userName) && _.isEmpty(orgCode) && _.isEmpty(active)) {
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.USER_ID LIKE :userID ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE TB_ITUSER_HIST.USER_ID LIKE :userID ';
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST + SQL_LIMIT;
        let param = {
            userID,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST  + ')';
        let paramSearch = {
            userID,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(userClass) && _.isEmpty(userID) && _.isEmpty(userName) && (orgCode)  && _.isEmpty(active)) {
        let SQL_WHERE_SEARCH = 'WHERE LOWER(TB_ITUSER.CUST_CD) LIKE LOWER(:orgCode) ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE LOWER(TB_ITUSER_HIST.CUST_CD) LIKE LOWER(:orgCode) ';
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST  + ')';
        let paramSearch = {
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(userClass) && _.isEmpty(userID) && (userName) && _.isEmpty(orgCode)  && _.isEmpty(active)) {
        let SQL_WHERE_SEARCH = 'WHERE LOWER(TB_ITUSER.USER_NM) LIKE LOWER(:userName) ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE LOWER(TB_ITUSER_HIST.USER_NM) LIKE LOWER(:userName) ';
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST + SQL_LIMIT;
        let param = {
            userName,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST  + ')';
        let paramSearch = {
            userName,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(userClass) && _.isEmpty(userID) && _.isEmpty(userName) && _.isEmpty(orgCode)  && (active)) {
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.ACTIVE LIKE :active ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE TB_ITUSER_HIST.ACTIVE LIKE :active ';
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST + SQL_LIMIT;
        let param = {
            active,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST  + ')';
        let paramSearch = {
            active,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if((userClass) && (userID) && _.isEmpty(userName) && _.isEmpty(orgCode) && _.isEmpty(active)) {
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.INOUT_GB LIKE :userClass AND TB_ITUSER.USER_ID LIKE :userID  ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE TB_ITUSER_HIST.INOUT_GB LIKE :userClass AND TB_ITUSER_HIST.USER_ID LIKE :userID  ';
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST + SQL_LIMIT;
        let param = {
            userClass,
            userID,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST  + ')';
        let paramSearch = {
            userID,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if((userClass) && _.isEmpty(userID) && (userName) && _.isEmpty(orgCode) && _.isEmpty(active)) {
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.INOUT_GB LIKE :userClass AND LOWER(TB_ITUSER.USER_NM) LIKE LOWER(:userName)  ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE TB_ITUSER_HIST.INOUT_GB LIKE :userClass AND LOWER(TB_ITUSER_HIST.USER_NM) LIKE LOWER(:userName)  ';
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST + SQL_LIMIT;
        let param = {
            userClass,
            userName,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST  + ')';
        let paramSearch = {
            userClass,
            userName,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if((userClass) && _.isEmpty(userID) && _.isEmpty(userName) && (orgCode) && _.isEmpty(active)) {
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.INOUT_GB LIKE :userClass AND LOWER(TB_ITUSER.CUST_CD) LIKE LOWER(:orgCode)  ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE TB_ITUSER_HIST.INOUT_GB LIKE :userClass AND LOWER(TB_ITUSER_HIST.CUST_CD) LIKE LOWER(:orgCode)  ';
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST + SQL_LIMIT;
        let param = {
            userClass,
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST  + ')';
        let paramSearch = {
            userClass,
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }


    if((userClass) && _.isEmpty(userID) && _.isEmpty(userName) && _.isEmpty(orgCode) && (active)) {
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.INOUT_GB LIKE :userClass AND TB_ITUSER.ACTIVE LIKE :active  ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE TB_ITUSER_HIST.INOUT_GB LIKE :userClass AND TB_ITUSER_HIST.ACTIVE LIKE :active  ';
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST + SQL_LIMIT;
        let param = {
            userClass,
            active,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST  + ')';
        let paramSearch = {
            userClass,
            active,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(userClass) && (userID) && (userName) && _.isEmpty(orgCode) && _.isEmpty(active)) {
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.USER_ID LIKE :userID AND LOWER(TB_ITUSER.USER_NM) LIKE LOWER(:userName)  ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE TB_ITUSER_HIST.USER_ID LIKE :userID AND LOWER(TB_ITUSER_HIST.USER_NM) LIKE LOWER(:userName)  ';
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST + SQL_LIMIT;
        let param = {
            userID,
            userName,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST  + ')';
        let paramSearch = {
            userID,
            userName,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(userClass) && (userID) && _.isEmpty(userName) && (orgCode) && _.isEmpty(active)) {
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.USER_ID LIKE :userID AND LOWER(TB_ITUSER.CUST_CD) LIKE LOWER(:orgCode)  ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE TB_ITUSER_HIST.USER_ID LIKE :userID AND LOWER(TB_ITUSER_HIST.CUST_CD) LIKE LOWER(:orgCode)  ';
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST + SQL_LIMIT;
        let param = {
            userID,
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST  + ')';
        let paramSearch = {
            userID,
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }



    if(_.isEmpty(userClass) && (userID) && _.isEmpty(userName) && _.isEmpty(orgCode) && (active)) {
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.USER_ID LIKE :userID AND TB_ITUSER.ACTIVE LIKE :active  ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE TB_ITUSER_HIST.USER_ID LIKE :userID AND TB_ITUSER_HIST.ACTIVE LIKE :active  ';
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST + SQL_LIMIT;
        let param = {
            userID,
            active,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST  + ')';
        let paramSearch = {
            userID,
            active,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(userClass) && _.isEmpty(userID) && (userName) && (orgCode) && _.isEmpty(active)) {
        let SQL_WHERE_SEARCH = 'WHERE LOWER(TB_ITUSER.USER_NM) LIKE LOWER(:userName) AND LOWER(TB_ITUSER.CUST_CD) LIKE LOWER(:orgCode)  ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE LOWER(TB_ITUSER_HIST.USER_NM) LIKE LOWER(:userName) AND LOWER(TB_ITUSER_HIST.CUST_CD) LIKE LOWER(:orgCode)  ';
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST + SQL_LIMIT;
        let param = {
            userName,
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST  + ')';
        let paramSearch = {
            userName,
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }


    if(_.isEmpty(userClass) && _.isEmpty(userID) && (userName) && _.isEmpty(orgCode) && (active)) {
        let SQL_WHERE_SEARCH = 'WHERE LOWER(TB_ITUSER.USER_NM) LIKE LOWER(:userName) AND TB_ITUSER.ACTIVE LIKE :active  ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE LOWER(TB_ITUSER_HIST.USER_NM) LIKE LOWER(:userName) AND TB_ITUSER_HIST.ACTIVE LIKE :active  ';
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST + SQL_LIMIT;
        let param = {
            userName,
            active,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST  + ')';
        let paramSearch = {
            userName,
            active,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }


    if(_.isEmpty(userClass) && _.isEmpty(userID) && _.isEmpty(userName) && (orgCode) && (active)) {
        let SQL_WHERE_SEARCH = 'WHERE LOWER(TB_ITUSER.CUST_CD) LIKE LOWER(:orgCode) AND TB_ITUSER.ACTIVE LIKE :active  ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE LOWER(TB_ITUSER_HIST.CUST_CD) LIKE LOWER(:orgCode) AND TB_ITUSER_HIST.ACTIVE LIKE :active  ';
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST + SQL_LIMIT;
        let param = {
            orgCode,
            active,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST  + ')';
        let paramSearch = {
            orgCode,
            active,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if((userClass) && (userID) && (userName) && _.isEmpty(orgCode)  && _.isEmpty(active)) {
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.INOUT_GB LIKE :userClass' +
                                ' AND TB_ITUSER.USER_ID LIKE :userID ' +
                                ' AND LOWER(TB_ITUSER.USER_NM) LIKE LOWER(:userName) ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE TB_ITUSER_HIST.INOUT_GB LIKE :userClass' +
                                ' AND TB_ITUSER_HIST.USER_ID LIKE :userID ' +
                                ' AND LOWER(TB_ITUSER_HIST.USER_NM) LIKE LOWER(:userName) ';
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST + SQL_LIMIT;
        let param = {
            userClass,
            userID,
            userName,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST  + ')';
        let paramSearch = {
            userClass,
            userID,
            userName,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if((userClass) && (userID) && _.isEmpty(userName) && (orgCode)  && _.isEmpty(active)) {
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.INOUT_GB LIKE :userClass' +
                                ' AND TB_ITUSER.USER_ID LIKE :userID ' +
                                ' AND LOWER(TB_ITUSER.CUST_CD) LIKE LOWER(:orgCode) ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE TB_ITUSER_HIST.INOUT_GB LIKE :userClass' +
                                ' AND TB_ITUSER_HIST.USER_ID LIKE :userID ' +
                                ' AND LOWER(TB_ITUSER_HIST.CUST_CD) LIKE LOWER(:orgCode) ';
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST + SQL_LIMIT;
        let param = {
            userClass,
            userID,
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST  + ')';
        let paramSearch = {
            userClass,
            userID,
            orgCode
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if((userClass) && (userID) && _.isEmpty(userName) && _.isEmpty(orgCode)  && (active)) {
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.INOUT_GB LIKE :userClass' +
            ' AND TB_ITUSER.USER_ID LIKE :userID ' +
            ' AND TB_ITUSER.ACTIVE LIKE :active ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE TB_ITUSER_HIST.INOUT_GB LIKE :userClass' +
            ' AND TB_ITUSER_HIST.USER_ID LIKE :userID ' +
            ' AND TB_ITUSER_HIST.ACTIVE LIKE :active ';
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST + SQL_LIMIT;
        let param = {
            userClass,
            userID,
            active,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST  + ')';
        let paramSearch = {
            userClass,
            userID,
            active
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if((userClass) && _.isEmpty(userID) && (userName) && (orgCode)  && _.isEmpty(active)) {
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.INOUT_GB LIKE :userClass' +
                                ' AND LOWER(TB_ITUSER.USER_NM) LIKE LOWER(:userName) ' +
                                ' AND LOWER(TB_ITUSER.CUST_CD) LIKE LOWER(:orgCode) ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE TB_ITUSER_HIST.INOUT_GB LIKE :userClass' +
                                ' AND LOWER(TB_ITUSER_HIST.USER_NM) LIKE LOWER(:userName) ' +
                                ' AND LOWER(TB_ITUSER_HIST.CUST_CD) LIKE LOWER(:orgCode) ';
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST + SQL_LIMIT;
        let param = {
            userClass,
            userName,
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST  + ')';
        let paramSearch = {
            userClass,
            userName,
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if((userClass) && _.isEmpty(userID) && (userName) &&  _.isEmpty(orgCode)  && (active)) {
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.INOUT_GB LIKE :userClass' +
            ' AND LOWER(TB_ITUSER.USER_NM) LIKE LOWER(:userName) ' +
            ' AND TB_ITUSER.ACTIVE LIKE :active ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE TB_ITUSER_HIST.INOUT_GB LIKE :userClass' +
            ' AND LOWER(TB_ITUSER_HIST.USER_NM) LIKE LOWER(:userName) ' +
            ' AND TB_ITUSER_HIST.ACTIVE LIKE :active ';
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST + SQL_LIMIT;
        let param = {
            userClass,
            userName,
            active,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST  + ')';
        let paramSearch = {
            userClass,
            userName,
            active,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }


    if((userClass) && _.isEmpty(userID) && _.isEmpty(userName) &&  (orgCode)  && (active)) {
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.INOUT_GB LIKE :userClass' +
            ' AND LOWER(TB_ITUSER.CUST_CD) LIKE LOWER(:orgCode) ' +
            ' AND TB_ITUSER.ACTIVE LIKE :active ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE TB_ITUSER_HIST.INOUT_GB LIKE :userClass' +
            ' AND LOWER(TB_ITUSER_HIST.CUST_CD) LIKE LOWER(:orgCode) ' +
            ' AND TB_ITUSER_HIST.ACTIVE LIKE :active ';
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST + SQL_LIMIT;
        let param = {
            userClass,
            orgCode,
            active,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST  + ')';
        let paramSearch = {
            userClass,
            orgCode,
            active,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(userClass) && (userID) && (userName) && (orgCode) && _.isEmpty(active)) {
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.USER_ID LIKE :userID ' +
                                ' AND LOWER(TB_ITUSER.USER_NM) LIKE LOWER(:userName) ' +
                                ' AND LOWER(TB_ITUSER.CUST_CD) LIKE LOWER(:orgCode) ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE TB_ITUSER_HIST.USER_ID LIKE :userID ' +
                                ' AND LOWER(TB_ITUSER_HIST.USER_NM) LIKE LOWER(:userName) ' +
                                ' AND LOWER(TB_ITUSER_HIST.CUST_CD) LIKE LOWER(:orgCode) ';
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST + SQL_LIMIT;
        let param = {
            userID,
            userName,
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST  + ')';
        let paramSearch = {
            userID,
            userName,
            orgCode,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(userClass) && (userID) && (userName) && _.isEmpty(orgCode) && (active)) {
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.USER_ID LIKE :userID ' +
                                ' AND LOWER(TB_ITUSER.USER_NM) LIKE LOWER(:userName) ' +
                                ' AND TB_ITUSER.ACTIVE LIKE :active ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE TB_ITUSER_HIST.USER_ID LIKE :userID ' +
                                ' AND LOWER(TB_ITUSER_HIST.USER_NM) LIKE LOWER(:userName) ' +
                                ' AND TB_ITUSER_HIST.ACTIVE LIKE :active ';
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST + SQL_LIMIT;
        let param = {
            userID,
            userName,
            active,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST  + ')';
        let paramSearch = {
            userID,
            userName,
            active,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(userClass) && (userID) && _.isEmpty(userName) && (orgCode) && (active)) {
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.USER_ID LIKE :userID ' +
            ' AND LOWER(TB_ITUSER.CUST_CD) LIKE LOWER(:orgCode) ' +
            ' AND TB_ITUSER.ACTIVE LIKE :active ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE TB_ITUSER_HIST.USER_ID LIKE :userID ' +
            ' AND LOWER(TB_ITUSER_HIST.CUST_CD) LIKE LOWER(:orgCode) ' +
            ' AND TB_ITUSER_HIST.ACTIVE LIKE :active ';
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST + SQL_LIMIT;
        let param = {
            userID,
            orgCode,
            active,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST  + ')';
        let paramSearch = {
            userID,
            orgCode,
            active,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(userClass) && _.isEmpty(userID) && (userName) && (orgCode) && (active)) {
        let SQL_WHERE_SEARCH = 'WHERE LOWER(TB_ITUSER.CUST_CD) LIKE LOWER(:orgCode)  ' +
                                ' AND LOWER(TB_ITUSER.USER_NM) LIKE LOWER(:userName) ' +
                                ' AND TB_ITUSER.ACTIVE LIKE :active ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE LOWER(TB_ITUSER_HIST.CUST_CD) LIKE LOWER(:orgCode)  ' +
                                ' AND LOWER(TB_ITUSER_HIST.USER_NM) LIKE LOWER(:userName) ' +
                                ' AND TB_ITUSER_HIST.ACTIVE LIKE :active ';
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST + SQL_LIMIT;
        let param = {
            orgCode,
            userName,
            active,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST  + ')';
        let paramSearch = {
            orgCode,
            userName,
            active,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }


    if((userClass) && (userID) && (userName) && (orgCode) && _.isEmpty(active)) {
        let SQL_WHERE_SEARCH = 'WHERE LOWER(TB_ITUSER.CUST_CD) LIKE LOWER(:orgCode)  ' +
            ' AND LOWER(TB_ITUSER.USER_NM) LIKE LOWER(:userName) ' +
            ' AND TB_ITUSER.INOUT_GB LIKE :userClass ' +
            ' AND TB_ITUSER.USER_ID LIKE :userID ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE LOWER(TB_ITUSER_HIST.CUST_CD) LIKE LOWER(:orgCode)  ' +
            ' AND LOWER(TB_ITUSER_HIST.USER_NM) LIKE LOWER(:userName) ' +
            ' AND TB_ITUSER_HIST.INOUT_GB LIKE :userClass ' +
            ' AND TB_ITUSER_HIST.USER_ID LIKE :userID ';
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST + SQL_LIMIT;
        let param = {
            orgCode,
            userName,
            userID,
            userClass,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST  + ')';
        let paramSearch = {
            orgCode,
            userName,
            userID,
            userClass,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if(_.isEmpty(userClass) && (userID) && (userName) && (orgCode) && (active)) {
        let SQL_WHERE_SEARCH = 'WHERE LOWER(TB_ITUSER.CUST_CD) LIKE LOWER(:orgCode)  ' +
            ' AND LOWER(TB_ITUSER.USER_NM) LIKE LOWER(:userName) ' +
            ' AND TB_ITUSER.ACTIVE LIKE :active ' +
            ' AND TB_ITUSER.USER_ID LIKE :userID ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE LOWER(TB_ITUSER_HIST.CUST_CD) LIKE LOWER(:orgCode)  ' +
            ' AND LOWER(TB_ITUSER_HIST.USER_NM) LIKE LOWER(:userName) ' +
            ' AND TB_ITUSER_HIST.ACTIVE LIKE :active ' +
            ' AND TB_ITUSER_HIST.USER_ID LIKE :userID ';
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST + SQL_LIMIT;
        let param = {
            orgCode,
            userName,
            userID,
            active,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST  + ')';
        let paramSearch = {
            orgCode,
            userName,
            userID,
            active,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if((userClass) && _.isEmpty(userID) && (userName) && (orgCode) && (active)) {
        let SQL_WHERE_SEARCH = 'WHERE LOWER(TB_ITUSER.CUST_CD) LIKE LOWER(:orgCode)  ' +
            ' AND LOWER(TB_ITUSER.USER_NM) LIKE LOWER(:userName) ' +
            ' AND TB_ITUSER.ACTIVE LIKE :active ' +
            ' AND TB_ITUSER.INOUT_GB LIKE :userClass ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE LOWER(TB_ITUSER_HIST.CUST_CD) LIKE LOWER(:orgCode)  ' +
            ' AND LOWER(TB_ITUSER_HIST.USER_NM) LIKE LOWER(:userName) ' +
            ' AND TB_ITUSER_HIST.ACTIVE LIKE :active ' +
            ' AND TB_ITUSER_HIST.INOUT_GB LIKE :userClass ';
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST + SQL_LIMIT;
        let param = {
            orgCode,
            userName,
            userClass,
            active,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST  + ')';
        let paramSearch = {
            orgCode,
            userName,
            userClass,
            active,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if((userClass) && (userID) && _.isEmpty(userName) && (orgCode) && (active)) {
        let SQL_WHERE_SEARCH = 'WHERE LOWER(TB_ITUSER.CUST_CD) LIKE LOWER(:orgCode)  ' +
            ' AND TB_ITUSER.USER_ID LIKE :userID ' +
            ' AND TB_ITUSER.ACTIVE LIKE :active ' +
            ' AND TB_ITUSER.INOUT_GB LIKE :userClass ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE LOWER(TB_ITUSER_HIST.CUST_CD) LIKE LOWER(:orgCode)  ' +
            ' AND TB_ITUSER_HIST.USER_ID LIKE :userID ' +
            ' AND TB_ITUSER_HIST.ACTIVE LIKE :active ' +
            ' AND TB_ITUSER_HIST.INOUT_GB LIKE :userClass ';
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST + SQL_LIMIT;
        let param = {
            orgCode,
            userID,
            userClass,
            active,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST  + ')';
        let paramSearch = {
            orgCode,
            userID,
            userClass,
            active,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if((userClass) && (userID) && (userName) && _.isEmpty(orgCode) && (active)) {
        let SQL_WHERE_SEARCH = 'WHERE LOWER(TB_ITUSER.USER_NM) LIKE LOWER(:userName)  ' +
            ' AND TB_ITUSER.USER_ID LIKE :userID ' +
            ' AND TB_ITUSER.ACTIVE LIKE :active ' +
            ' AND TB_ITUSER.INOUT_GB LIKE :userClass ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE LOWER(TB_ITUSER_HIST.USER_NM) LIKE LOWER(:userName)  ' +
            ' AND TB_ITUSER_HIST.USER_ID LIKE :userID ' +
            ' AND TB_ITUSER_HIST.ACTIVE LIKE :active ' +
            ' AND TB_ITUSER_HIST.INOUT_GB LIKE :userClass ';
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST + SQL_LIMIT;
        let param = {
            userName,
            userID,
            userClass,
            active,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST  + ')';
        let paramSearch = {
            userName,
            userID,
            userClass,
            active,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
};

exports.createUser = async function (req, res) {
    var userID = req.body.userID;
    var userName = req.body.userName;
    var custCd = req.body.orgCode;
    // var password = req.body.password;
    var userClass = req.body.userClass;
    var email = req.body.email;
    var finalOperaDate = req.body.finalOperaDate.replace(/[^0-9 ]/g, "");
    var validStartDT = (_.isEmpty(req.body.validStartDT)) ? null: req.body.validStartDT.replace(/[^0-9 ]/g, "");
    var validEndDT = (_.isEmpty(req.body.validEndDT)) ? null: req.body.validEndDT.replace(/[^0-9 ]/g, "");
    var phone = req.body.phone ? req.body.phone : '';
    var address = req.body.address ? req.body.address : '';
    var workID = req.body.workID ? req.body.workID : '';
    var role = req.body.role;
    var active = req.body.active;
    let params = {
        userID: {val: userID},
        user_name: {val: userName},
        custCd: {val: custCd},
        password: {val: bcrypt.hashSync(defaultPW, saltRounds)},
        typeUser: {val: userClass},
        email: {val: email},
        systemDate: {val: finalOperaDate},
        validStartDT: {val: validStartDT},
        validEndDT: {val: validEndDT},
        phone: {val: phone},
        address: {val: address},
        workID: {val: workID},
        active: {val: active},
        role: {val: role}
    };
    let sqlCheckUserID = `SELECT  * FROM TB_ITUSER WHERE LOWER(USER_ID) = LOWER(:userID) `;
    let paramsCheckUserID = {userID: {val: userID}};
    let isExist = await oracelService.checkIsExistUserID(res, sqlCheckUserID, paramsCheckUserID, optionFormatObj);
    if (isExist[0]) {
        return res.status(500).send({message: "User ID [" + userID + "] has been used!"});
    } else {
        let sql_insert = `INSERT INTO TB_ITUSER (USER_ID , USER_NM, CUST_CD, INOUT_GB,  USER_PW , VALID_START_DT , VALID_END_DT, TEL_NO_MOBILE , ADDR , WORK_ID  , EMAIL, SYS_DTIM , ACTIVE , ROLE_ID)
         VALUES (:userID, :user_name, :custCd, :typeUser, :password, :validStartDT, :validEndDT , :phone, :address , :workID , :email , :systemDate ,:active , :role)`;
        let createAffect = await oracelService.createUser(res, sql_insert, params, optionAutoCommit);
        console.log(createAffect);
        if (createAffect.rowsAffected === 1) {
            return res.status(200).send({message: 'Create User Successful'})
        } else {
            return res.status(500).send({message: "Error when save user!"});
        }
    }
};

exports.updateUser = async function (req, res) {
    var userName = req.body.userName;
    var userClass = req.body.userClass;
    var orgCode = req.body.orgCode;
    var validStartDT = (_.isEmpty(req.body.validStartDT)) ? null: req.body.validStartDT.replace(/[^0-9 ]/g, "");
    var validEndDT = (_.isEmpty(req.body.validEndDT)) ? null: req.body.validEndDT.replace(/[^0-9 ]/g, "");
    var phone = req.body.phone;
    var address = req.body.address;
    var email = req.body.email;
    var userID = req.body.userID;
    var role = req.body.role;
    var active = req.body.active;

        var param = {
            userName,
            userClass,
            orgCode,
            validStartDT,
            validEndDT,
            phone,
            address,
            email,
            userID,
            active,
            role
        };

        let SQL = 'UPDATE ADMIN.TB_ITUSER SET' +
            ' USER_NM=:userName ,  CUST_CD=:orgCode, INOUT_GB=:userClass, VALID_START_DT=:validStartDT, VALID_END_DT=:validEndDT, TEL_NO_MOBILE=:phone, ADDR=:address, EMAIL=:email, ACTIVE=:active , ROLE_ID=:role ' +
            ' WHERE USER_ID=:userID ';
        await oracelService.queryOracel(res, SQL, param, optionAutoCommit);
};

exports.resetPassword = async function (req, res) {
    var userID = req.body.userID;
    var userPW = bcrypt.hashSync(defaultPW, saltRounds);

    if(_.isEmpty(userID)) {
        res.status(500).send({message: 'User ID provide blank!'})
    } else {
        var param = {
            userID,
            userPW
        };

        let SQL = 'UPDATE ADMIN.TB_ITUSER SET USER_PW=:userPW WHERE USER_ID=:userID ';
        await oracelService.queryOracel(res, SQL, param, optionAutoCommit);
    }
};
