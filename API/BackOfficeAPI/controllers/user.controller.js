let oracledb = require('oracledb');
const dateFormat = require('dateformat');
let dbconfig = require('../../shared/config/dbconfig');
let bcrypt = require('bcrypt');
const oracelService = require('../services/oracelQuery.service');
let _ = require('lodash');
const optionFormatObj = { outFormat: oracledb.OUT_FORMAT_OBJECT };
const optionAutoCommit = { autoCommit: true };
const saltRounds = 10;
const defaultPW = 'nice1234';

exports.getUserInfo = async function (req, res) {
    let userClass = req.body.userClass ? '%' + req.body.userClass + '%' : '';
    let userID = req.body.userID ? '%' + req.body.userID + '%' : '';
    let userName = req.body.userName ? '%' + req.body.userName + '%' : '';
    let orgCode = req.body.orgCode ? '%' + req.body.orgCode + '%' : '';
    let active = req.body.active ? req.body.active : '';
    let currentLocation = req.body.currentLocation;
    let limitRow = req.body.limitRow;

    let SQL_SELECT_USER = ` SELECT
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
    let SQL_SELECT_USER_HIST = ` SELECT
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
    let SQL_SELECT_COUNT = `SELECT COUNT(*) AS total FROM `;
    let UNION_ALL = ' UNION ALL ';
    let SQL_FROM_USER = ' FROM TB_ITUSER ';
    let SQL_FROM_USER_HIST = ' FROM TB_ITUSER_HIST ';
    let SQL_JOIN_USER = ' LEFT JOIN TB_ITCUST ON TB_ITUSER.CUST_CD = TB_ITCUST.CUST_CD  ';
    let SQL_JOIN_USER_HIST = ' LEFT JOIN TB_ITCUST ON TB_ITUSER_HIST.CUST_CD = TB_ITCUST.CUST_CD ';
    let SQL_LIMIT = ' OFFSET :currentLocation ROWS FETCH NEXT :limitRow ROWS ONLY ';

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
    // IN (${listNiceSskey.map((name, index) => `'${name}'`).join(", ")}) 
    if ((userClass) && (userID) && (userName) && (orgCode) && (active)) {
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.INOUT_GB LIKE :userClass ' +
            'AND LOWER(TB_ITUSER.USER_ID) LIKE LOWER(:userID) ' +
            'AND LOWER(TB_ITUSER.USER_NM) LIKE LOWER(:userName) ' +
            `AND LOWER(TB_ITUSER.CUST_CD) LIKE LOWER(:orgCode) AND TB_ITUSER.ACTIVE IN (${active.map((name, index) => `'${name}'`).join(", ")}) `;
        let SQL_WHERE_SEARCH_HIST = 'WHERE TB_ITUSER_HIST.INOUT_GB LIKE :userClass ' +
            'AND LOWER(TB_ITUSER_HIST.USER_ID) LIKE LOWER(:userID) ' +
            'AND LOWER(TB_ITUSER_HIST.USER_NM) LIKE LOWER(:userName) ' +
            `AND LOWER(TB_ITUSER_HIST.CUST_CD) LIKE LOWER(:orgCode) AND TB_ITUSER_HIST.ACTIVE IN (${active.map((name, index) => `'${name}'`).join(", ")}) `;
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST + SQL_LIMIT;
        let param = {
            userClass,
            userID,
            orgCode,
            userName,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST  + ')';
        let paramSearch = {
            userClass,
            userID,
            orgCode,
            userName,
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
        let SQL_WHERE_SEARCH = 'WHERE LOWER(TB_ITUSER.USER_ID) LIKE LOWER(:userID) ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE LOWER(TB_ITUSER_HIST.USER_ID) LIKE LOWER(:userID) ';
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
        let SQL_WHERE_SEARCH = `WHERE TB_ITUSER.ACTIVE IN (${active.map((name, index) => `'${name}'`).join(", ")}) `;
        let SQL_WHERE_SEARCH_HIST = `WHERE TB_ITUSER_HIST.ACTIVE IN (${active.map((name, index) => `'${name}'`).join(", ")}) `;
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST + SQL_LIMIT;
        let param = {
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST  + ')';
        let paramSearch = {
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if((userClass) && (userID) && _.isEmpty(userName) && _.isEmpty(orgCode) && _.isEmpty(active)) {
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.INOUT_GB LIKE :userClass AND LOWER(TB_ITUSER.USER_ID) LIKE LOWER(:userID)  ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE TB_ITUSER_HIST.INOUT_GB LIKE :userClass AND LOWER(TB_ITUSER_HIST.USER_ID) LIKE LOWER(:userID)  ';
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
        let SQL_WHERE_SEARCH = ` WHERE TB_ITUSER.INOUT_GB LIKE :userClass AND TB_ITUSER.ACTIVE IN (${active.map((name, index) => `'${name}'`).join(", ")})  `;
        let SQL_WHERE_SEARCH_HIST = ` WHERE TB_ITUSER_HIST.INOUT_GB LIKE :userClass AND TB_ITUSER_HIST.ACTIVE IN (${active.map((name, index) => `'${name}'`).join(", ")})  `;
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

    if(_.isEmpty(userClass) && (userID) && (userName) && _.isEmpty(orgCode) && _.isEmpty(active)) {
        let SQL_WHERE_SEARCH = 'WHERE LOWER(TB_ITUSER.USER_ID) LIKE LOWER(:userID) AND LOWER(TB_ITUSER.USER_NM) LIKE LOWER(:userName)  ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE LOWER(TB_ITUSER_HIST.USER_ID) LIKE LOWER(:userID) AND LOWER(TB_ITUSER_HIST.USER_NM) LIKE LOWER(:userName)  ';
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
        let SQL_WHERE_SEARCH = 'WHERE LOWER(TB_ITUSER.USER_ID) LIKE LOWER(:userID) AND LOWER(TB_ITUSER.CUST_CD) LIKE LOWER(:orgCode)  ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE LOWER(TB_ITUSER_HIST.USER_ID) LIKE LOWER(:userID) AND LOWER(TB_ITUSER_HIST.CUST_CD) LIKE LOWER(:orgCode)  ';
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
        let SQL_WHERE_SEARCH = ` WHERE LOWER(TB_ITUSER.USER_ID) LIKE LOWER(:userID) AND TB_ITUSER.ACTIVE IN (${active.map((name, index) => `'${name}'`).join(", ")})  `;
        let SQL_WHERE_SEARCH_HIST = ` WHERE LOWER(TB_ITUSER_HIST.USER_ID) LIKE LOWER(:userID) AND TB_ITUSER_HIST.ACTIVE IN (${active.map((name, index) => `'${name}'`).join(", ")})  `;
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
        let SQL_WHERE_SEARCH = ` WHERE LOWER(TB_ITUSER.USER_NM) LIKE LOWER(:userName) AND TB_ITUSER.ACTIVE IN (${active.map((name, index) => `'${name}'`).join(", ")})  `;
        let SQL_WHERE_SEARCH_HIST = `WHERE LOWER(TB_ITUSER_HIST.USER_NM) LIKE LOWER(:userName) AND TB_ITUSER_HIST.ACTIVE IN (${active.map((name, index) => `'${name}'`).join(", ")})  `;
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


    if(_.isEmpty(userClass) && _.isEmpty(userID) && _.isEmpty(userName) && (orgCode) && (active)) {
        let SQL_WHERE_SEARCH = ` WHERE LOWER(TB_ITUSER.CUST_CD) LIKE LOWER(:orgCode) AND TB_ITUSER.ACTIVE IN (${active.map((name, index) => `'${name}'`).join(", ")})  `;
        let SQL_WHERE_SEARCH_HIST = ` WHERE LOWER(TB_ITUSER_HIST.CUST_CD) LIKE LOWER(:orgCode) AND TB_ITUSER_HIST.ACTIVE IN (${active.map((name, index) => `'${name}'`).join(", ")})  `;
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

    if((userClass) && (userID) && (userName) && _.isEmpty(orgCode)  && _.isEmpty(active)) {
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.INOUT_GB LIKE :userClass' +
            ' AND LOWER(TB_ITUSER.USER_ID) LIKE LOWER(:userID) ' +
            ' AND LOWER(TB_ITUSER.USER_NM) LIKE LOWER(:userName) ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE TB_ITUSER_HIST.INOUT_GB LIKE :userClass' +
            ' AND LOWER(TB_ITUSER_HIST.USER_ID) LIKE LOWER(:userID) ' +
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
            ' AND LOWER(TB_ITUSER.USER_ID) LIKE LOWER(:userID) ' +
            ' AND LOWER(TB_ITUSER.CUST_CD) LIKE LOWER(:orgCode) ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE TB_ITUSER_HIST.INOUT_GB LIKE :userClass' +
            ' AND LOWER(TB_ITUSER_HIST.USER_ID) LIKE LOWER(:userID) ' +
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
            ' AND LOWER(TB_ITUSER.USER_ID) LIKE LOWER(:userID) ' +
            ` AND TB_ITUSER.ACTIVE IN (${active.map((name, index) => `'${name}'`).join(", ")}) `;
        let SQL_WHERE_SEARCH_HIST = 'WHERE TB_ITUSER_HIST.INOUT_GB LIKE :userClass' +
            ' AND LOWER(TB_ITUSER_HIST.USER_ID) LIKE LOWER(:userID) ' +
            ` AND TB_ITUSER_HIST.ACTIVE IN (${active.map((name, index) => `'${name}'`).join(", ")}) `;
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST + SQL_LIMIT;
        let param = {
            userClass,
            userID,
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
            ` AND TB_ITUSER.ACTIVE IN (${active.map((name, index) => `'${name}'`).join(", ")}) `;
        let SQL_WHERE_SEARCH_HIST = 'WHERE TB_ITUSER_HIST.INOUT_GB LIKE :userClass' +
            ' AND LOWER(TB_ITUSER_HIST.USER_NM) LIKE LOWER(:userName) ' +
            ` AND TB_ITUSER_HIST.ACTIVE IN (${active.map((name, index) => `'${name}'`).join(", ")}) `;
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


    if((userClass) && _.isEmpty(userID) && _.isEmpty(userName) &&  (orgCode)  && (active)) {
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.INOUT_GB LIKE :userClass' +
            ' AND LOWER(TB_ITUSER.CUST_CD) LIKE LOWER(:orgCode) ' +
            ` AND TB_ITUSER.ACTIVE IN (${active.map((name, index) => `'${name}'`).join(", ")}) `;
        let SQL_WHERE_SEARCH_HIST = 'WHERE TB_ITUSER_HIST.INOUT_GB LIKE :userClass' +
            ' AND LOWER(TB_ITUSER_HIST.CUST_CD) LIKE LOWER(:orgCode) ' +
            ` AND TB_ITUSER_HIST.ACTIVE IN (${active.map((name, index) => `'${name}'`).join(", ")}) `;
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

    if(_.isEmpty(userClass) && (userID) && (userName) && (orgCode) && _.isEmpty(active)) {
        let SQL_WHERE_SEARCH = 'WHERE LOWER(TB_ITUSER.USER_ID) LIKE LOWER(:userID) ' +
            ' AND LOWER(TB_ITUSER.USER_NM) LIKE LOWER(:userName) ' +
            ' AND LOWER(TB_ITUSER.CUST_CD) LIKE LOWER(:orgCode) ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE LOWER(TB_ITUSER_HIST.USER_ID) LIKE LOWER(:userID) ' +
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
        let SQL_WHERE_SEARCH = 'WHERE LOWER(TB_ITUSER.USER_ID) LIKE LOWER(:userID) ' +
            ' AND LOWER(TB_ITUSER.USER_NM) LIKE LOWER(:userName) ' +
            ` AND TB_ITUSER.ACTIVE IN (${active.map((name, index) => `'${name}'`).join(", ")}) `;
        let SQL_WHERE_SEARCH_HIST = 'WHERE LOWER(TB_ITUSER_HIST.USER_ID) LIKE LOWER(:userID) ' +
            ' AND LOWER(TB_ITUSER_HIST.USER_NM) LIKE LOWER(:userName) ' +
            ` AND TB_ITUSER_HIST.ACTIVE IN (${active.map((name, index) => `'${name}'`).join(", ")}) `;
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

    if(_.isEmpty(userClass) && (userID) && _.isEmpty(userName) && (orgCode) && (active)) {
        let SQL_WHERE_SEARCH = 'WHERE LOWER(TB_ITUSER.USER_ID) LIKE LOWER(:userID) ' +
            ' AND LOWER(TB_ITUSER.CUST_CD) LIKE LOWER(:orgCode) ' +
            ` AND TB_ITUSER.ACTIVE IN (${active.map((name, index) => `'${name}'`).join(", ")}) `;
        let SQL_WHERE_SEARCH_HIST = 'WHERE LOWER(TB_ITUSER_HIST.USER_ID) LIKE LOWER(:userID) ' +
            ' AND LOWER(TB_ITUSER_HIST.CUST_CD) LIKE LOWER(:orgCode) ' +
            ` AND TB_ITUSER_HIST.ACTIVE IN (${active.map((name, index) => `'${name}'`).join(", ")}) `;
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

    if(_.isEmpty(userClass) && _.isEmpty(userID) && (userName) && (orgCode) && (active)) {
        let SQL_WHERE_SEARCH = 'WHERE LOWER(TB_ITUSER.CUST_CD) LIKE LOWER(:orgCode)  ' +
            ' AND LOWER(TB_ITUSER.USER_NM) LIKE LOWER(:userName) ' +
            ` AND TB_ITUSER.ACTIVE IN (${active.map((name, index) => `'${name}'`).join(", ")}) `;
        let SQL_WHERE_SEARCH_HIST = 'WHERE LOWER(TB_ITUSER_HIST.CUST_CD) LIKE LOWER(:orgCode)  ' +
            ' AND LOWER(TB_ITUSER_HIST.USER_NM) LIKE LOWER(:userName) ' +
            ` AND TB_ITUSER_HIST.ACTIVE IN (${active.map((name, index) => `'${name}'`).join(", ")}) `;
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST + SQL_LIMIT;
        let param = {
            orgCode,
            userName,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST  + ')';
        let paramSearch = {
            orgCode,
            userName,
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
            ' AND LOWER(TB_ITUSER.USER_ID) LIKE LOWER(:userID) ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE LOWER(TB_ITUSER_HIST.CUST_CD) LIKE LOWER(:orgCode)  ' +
            ' AND LOWER(TB_ITUSER_HIST.USER_NM) LIKE LOWER(:userName) ' +
            ' AND TB_ITUSER_HIST.INOUT_GB LIKE :userClass ' +
            ' AND LOWER(TB_ITUSER_HIST.USER_ID) LIKE LOWER(:userID) ';
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
            ` AND TB_ITUSER.ACTIVE IN (${active.map((name, index) => `'${name}'`).join(", ")}) ` +
            ' AND LOWER(TB_ITUSER.USER_ID) LIKE LOWER(:userID) ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE LOWER(TB_ITUSER_HIST.CUST_CD) LIKE LOWER(:orgCode)  ' +
            ' AND LOWER(TB_ITUSER_HIST.USER_NM) LIKE LOWER(:userName) ' +
            ` AND TB_ITUSER_HIST.ACTIVE IN (${active.map((name, index) => `'${name}'`).join(", ")}) ` +
            ' AND LOWER(TB_ITUSER_HIST.USER_ID) LIKE LOWER(:userID) ';
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST + SQL_LIMIT;
        let param = {
            orgCode,
            userName,
            userID,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST  + ')';
        let paramSearch = {
            orgCode,
            userName,
            userID,
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
            ` AND TB_ITUSER.ACTIVE IN (${active.map((name, index) => `'${name}'`).join(", ")}) ` +
            ' AND TB_ITUSER.INOUT_GB LIKE :userClass ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE LOWER(TB_ITUSER_HIST.CUST_CD) LIKE LOWER(:orgCode)  ' +
            ' AND LOWER(TB_ITUSER_HIST.USER_NM) LIKE LOWER(:userName) ' +
            ` AND TB_ITUSER_HIST.ACTIVE IN (${active.map((name, index) => `'${name}'`).join(", ")}) ` +
            ' AND TB_ITUSER_HIST.INOUT_GB LIKE :userClass ';
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST + SQL_LIMIT;
        let param = {
            orgCode,
            userName,
            userClass,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST  + ')';
        let paramSearch = {
            orgCode,
            userName,
            userClass,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if((userClass) && (userID) && _.isEmpty(userName) && (orgCode) && (active)) {
        let SQL_WHERE_SEARCH = 'WHERE LOWER(TB_ITUSER.CUST_CD) LIKE LOWER(:orgCode)  ' +
            ' AND LOWER(TB_ITUSER.USER_ID) LIKE LOWER(:userID) ' +
            ` AND TB_ITUSER.ACTIVE IN (${active.map((name, index) => `'${name}'`).join(", ")}) ` +
            ' AND TB_ITUSER.INOUT_GB LIKE :userClass ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE LOWER(TB_ITUSER_HIST.CUST_CD) LIKE LOWER(:orgCode)  ' +
            ' AND LOWER(TB_ITUSER_HIST.USER_ID) LIKE LOWER(:userID) ' +
            ` AND TB_ITUSER_HIST.ACTIVE IN (${active.map((name, index) => `'${name}'`).join(", ")}) ` +
            ' AND TB_ITUSER_HIST.INOUT_GB LIKE :userClass ';
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST + SQL_LIMIT;
        let param = {
            orgCode,
            userID,
            userClass,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST  + ')';
        let paramSearch = {
            orgCode,
            userID,
            userClass,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if((userClass) && (userID) && (userName) && _.isEmpty(orgCode) && (active)) {
        let SQL_WHERE_SEARCH = 'WHERE LOWER(TB_ITUSER.USER_NM) LIKE LOWER(:userName)  ' +
            ' AND LOWER(TB_ITUSER.USER_ID) LIKE LOWER(:userID) ' +
            ` AND TB_ITUSER.ACTIVE IN (${active.map((name, index) => `'${name}'`).join(", ")}) ` +
            ' AND TB_ITUSER.INOUT_GB LIKE :userClass ';
        let SQL_WHERE_SEARCH_HIST = 'WHERE LOWER(TB_ITUSER_HIST.USER_NM) LIKE LOWER(:userName)  ' +
            ' AND LOWER(TB_ITUSER_HIST.USER_ID) LIKE LOWER(:userID) ' +
            ` AND TB_ITUSER_HIST.ACTIVE IN (${active.map((name, index) => `'${name}'`).join(", ")}) ` +
            ' AND TB_ITUSER_HIST.INOUT_GB LIKE :userClass ';
        let sql = SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST + SQL_LIMIT;
        let param = {
            userName,
            userID,
            userClass,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + '(' + SQL_SELECT_USER + SQL_FROM_USER + SQL_JOIN_USER + SQL_WHERE_SEARCH + UNION_ALL + SQL_SELECT_USER_HIST + SQL_FROM_USER_HIST + SQL_JOIN_USER_HIST + SQL_WHERE_SEARCH_HIST  + ')';
        let paramSearch = {
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
};

exports.createUser = async function (req, res) {
    let userID = req.body.userID;
    let userName = req.body.userName;
    let custCd = req.body.orgCode;
    // let password = req.body.password;
    let userClass = req.body.userClass;
    let email = req.body.email;
    let finalOperaDate = dateFormat(new Date(), "yyyymmddHHMMss");
    let validStartDT = (_.isEmpty(req.body.validStartDT)) ? null: req.body.validStartDT.replace(/[^0-9 ]/g, "");
    let validEndDT = (_.isEmpty(req.body.validEndDT)) ? null: req.body.validEndDT.replace(/[^0-9 ]/g, "");
    let phone = req.body.phone ? req.body.phone : '';
    let address = req.body.address ? req.body.address : '';
    let workID = req.body.workID ? req.body.workID : '';
    let roles = req.body.role;
    let active = req.body.active;
    let paramInsertRole = [];
    let sqlCheckUserID = `SELECT  * FROM TB_ITUSER WHERE LOWER(USER_ID) = LOWER(:userID) `;
    let sql_insert = `INSERT INTO TB_ITUSER (USER_ID , USER_NM, CUST_CD, INOUT_GB,  USER_PW , VALID_START_DT , VALID_END_DT, TEL_NO_MOBILE , ADDR , WORK_ID  , EMAIL, SYS_DTIM , ACTIVE)
             VALUES (:userID, :user_name, :custCd, :typeUser, :password, :validStartDT, :validEndDT , :phone, :address , :workID , :email , :systemDate ,:active)`;
    let paramsCheckUserID = {userID: {val: userID}};
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
    };
    let sqlInsertRoleUser = ` INSERT INTO TB_ROLE_USER( ROLE_ID , USER_ID) VALUES (:1 , :2) `;
    if (roles[0]) {
        for (let roleID of roles) {
            let param = [roleID , userID];
            paramInsertRole.push(param);
        };
    }
    let isExist = await oracelService.checkIsExistUserID(res, sqlCheckUserID, paramsCheckUserID, optionFormatObj);
    if (isExist[0]) {
        return res.status(500).send({message: "User ID [" + userID + "] has been used!"});
    } else {
        let connection;
        try {
            connection = await oracledb.getConnection(dbconfig);
            let resultInsertUser = await connection.execute(sql_insert, params, {autoCommit: true});
            if (resultInsertUser.rowsAffected == 1) {
                let resultSetRole = await connection.executeMany(sqlInsertRoleUser, paramInsertRole, {autoCommit: true});
                if (resultSetRole.rowsAffected >= 1) {
                    res.status(201).send({message: 'Created account successfully'});
                } else {
                    res.status(500).send({message: 'Error when set Role for account'});
                }
            } else {
                res.status(500).send({message: 'Error when save information account'});
            }
        } catch (err) {
            return err;
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }
};

exports.updateUser = async function (req, res) {
    let userName = req.body.userName;
    let userClass = req.body.userClass;
    let orgCode = req.body.orgCode;
    let validStartDT = (_.isEmpty(req.body.validStartDT)) ? null: req.body.validStartDT.replace(/[^0-9 ]/g, "");
    let validEndDT = (_.isEmpty(req.body.validEndDT)) ? null: req.body.validEndDT.replace(/[^0-9 ]/g, "");
    let phone = req.body.phone;
    let address = req.body.address;
    let email = req.body.email;
    let userID = req.body.userID;
    let roles = req.body.role;
    let active = req.body.active;
    let finalOperaDate = dateFormat(new Date(), "yyyymmddHHMMss");
    let paramInsertRole = [];
    let param = {
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
        finalOperaDate
    };

    let SQL = 'UPDATE TB_ITUSER SET' +
        ' USER_NM=:userName ,  CUST_CD=:orgCode, INOUT_GB=:userClass, VALID_START_DT=:validStartDT, VALID_END_DT=:validEndDT, TEL_NO_MOBILE=:phone, ADDR=:address, EMAIL=:email, ACTIVE=:active , SYS_DTIM =:finalOperaDate   ' +
        ' WHERE USER_ID=:userID ';
    if (roles[0]) {
        for (let roleID of roles) {
            let param = [roleID , userID];
            paramInsertRole.push(param);
        };
        let sqlInsertRoleUser = ` INSERT INTO TB_ROLE_USER( ROLE_ID , USER_ID) VALUES (:1 , :2) `;
        let sqlDeleteRole = `DELETE FROM TB_ROLE_USER WHERE USER_ID = :userID `;
        let paramDeleteRole = {
            userID
        };
        let connection;
        try {
            connection = await oracledb.getConnection(dbconfig);
            let resultDeleteRole = await connection.execute(sqlDeleteRole, paramDeleteRole, {autoCommit: false});
            let resultInsertRoleUser = await connection.executeMany(sqlInsertRoleUser, paramInsertRole, {autoCommit: false});
            let resultUpdateUser = await connection.execute(SQL, param, {autoCommit: true});
            res.status(200).send(resultUpdateUser);
        } catch (err) {
            return res.status(500).send(err)
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (error) {
                    console.log(error);
                }
            }
        }
    } else {
        await oracelService.queryOracel(res, SQL, param, optionAutoCommit);
    }
};

exports.resetPassword = async function (req, res) {
    let userID = req.body.userID;
    let userPW = bcrypt.hashSync(defaultPW, saltRounds);
    let finalOperaDate = dateFormat(new Date(), "yyyymmddHHMMss");

    if(!userID) {
        res.status(500).send({message: 'User ID provide blank!'})
    } else {
        let param = {
            userID,
            userPW,
            finalOperaDate
        };

        let SQL = 'UPDATE ADMIN.TB_ITUSER SET USER_PW=:userPW, SYS_DTIM =:finalOperaDate WHERE USER_ID=:userID ';
        await oracelService.queryOracel(res, SQL, param, optionAutoCommit);
    }
};

exports.changePassword = async function (req, res) {
    let userID = req.body.userID;
    let userPW = bcrypt.hashSync(req.body.password, saltRounds);

    if(_.isEmpty(userID)) {
        res.status(500).send({message: 'User ID provide blank!'})
    } else {
        let param = {
            userID,
            userPW
        };

        let SQL = 'UPDATE TB_ITUSER SET USER_PW=:userPW WHERE USER_ID=:userID ';
        await oracelService.queryOracel(res, SQL, param, optionAutoCommit);
    }
};

exports.getRoleAccount = async function (req, res) {
    let userID = req.query.userID;
    if(_.isEmpty(userID)) {
        res.status(500).send({message: 'User ID provide blank!'})
    } else {
        let param = {
            userID
        };

        let SQL = 'SELECT ROLE_ID FROM TB_ROLE_USER WHERE USER_ID = :userID ';
        await oracelService.queryOracel(res, SQL, param, optionFormatObj);
    }
};
