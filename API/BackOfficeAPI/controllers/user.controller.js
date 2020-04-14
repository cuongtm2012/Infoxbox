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

    var SQL_SELECT = `SELECT
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
    var SQL_SELECT_COUNT = `SELECT COUNT(*) AS total `;
    var SQL_FROM = 'FROM TB_ITUSER ';
    var SQL_JOIN = 'LEFT JOIN TB_ITCUST ON TB_ITUSER.CUST_CD = TB_ITCUST.CUST_CD INNER JOIN TB_ROLE ON TB_ITUSER.ROLE_ID = TB_ROLE.ROLE_ID ';
    var SQL_LIMIT = ' OFFSET :currentLocation ROWS FETCH NEXT :limitRow ROWS ONLY ';

    if (_.isEmpty(userClass) && _.isEmpty(userID) && _.isEmpty(userName) && _.isEmpty(orgCode) && _.isEmpty(active)) {
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_LIMIT;
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
    if ((userClass) && (userID) && (userName) && (orgCode) && (active)) {
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.INOUT_GB LIKE :userClass ' +
            'AND TB_ITUSER.USER_ID LIKE :userID ' +
            'AND TB_ITUSER.USER_NM LIKE :userName ' +
            'AND TB_ITUSER.CUST_CD LIKE :orgCode AND TB_ITUSER.ACTIVE LIKE :active ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH + SQL_LIMIT;
        let param = {
            userClass,
            userID,
            orgCode,
            userName,
            active,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH;
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
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH + SQL_LIMIT;
        let param = {
            userClass,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH;
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
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH + SQL_LIMIT;
        let param = {
            userID,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH;
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
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.CUST_CD LIKE :orgCode ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH + SQL_LIMIT;
        let param = {
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH;
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
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.USER_NM LIKE :userName ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH + SQL_LIMIT;
        let param = {
            userName,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH;
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
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH + SQL_LIMIT;
        let param = {
            active,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH;
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
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH + SQL_LIMIT;
        let param = {
            userClass,
            userID,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH;
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
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.INOUT_GB LIKE :userClass AND TB_ITUSER.USER_NM LIKE :userName  ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH + SQL_LIMIT;
        let param = {
            userClass,
            userName,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH;
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
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.INOUT_GB LIKE :userClass AND TB_ITUSER.CUST_CD LIKE :orgCode  ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH + SQL_LIMIT;
        let param = {
            userClass,
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH;
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
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH + SQL_LIMIT;
        let param = {
            userClass,
            active,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH;
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
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.USER_ID LIKE :userID AND TB_ITUSER.USER_NM LIKE :userName  ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH + SQL_LIMIT;
        let param = {
            userID,
            userName,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH;
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
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.USER_ID LIKE :userID AND TB_ITUSER.CUST_CD LIKE :orgCode  ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH + SQL_LIMIT;
        let param = {
            userID,
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH;
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
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH + SQL_LIMIT;
        let param = {
            userID,
            active,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH;
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
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.USER_NM LIKE :userName AND TB_ITUSER.CUST_CD LIKE :orgCode  ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH + SQL_LIMIT;
        let param = {
            userName,
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH;
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
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.USER_NM LIKE :userName AND TB_ITUSER.ACTIVE LIKE :active  ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH + SQL_LIMIT;
        let param = {
            userName,
            active,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH;
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
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.CUST_CD LIKE :orgCode AND TB_ITUSER.ACTIVE LIKE :active  ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH + SQL_LIMIT;
        let param = {
            orgCode,
            active,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH;
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
                                ' AND TB_ITUSER.USER_NM LIKE :userName ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH + SQL_LIMIT;
        let param = {
            userClass,
            userID,
            userName,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH;
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
                                ' AND TB_ITUSER.CUST_CD LIKE :orgCode ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH + SQL_LIMIT;
        let param = {
            userClass,
            userID,
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH;
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
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH + SQL_LIMIT;
        let param = {
            userClass,
            userID,
            active,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH;
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
                                ' AND TB_ITUSER.USER_NM LIKE :userName ' +
                                ' AND TB_ITUSER.CUST_CD LIKE :orgCode ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH + SQL_LIMIT;
        let param = {
            userClass,
            userName,
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH;
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
            ' AND TB_ITUSER.USER_NM LIKE :userName ' +
            ' AND TB_ITUSER.ACTIVE LIKE :active ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH + SQL_LIMIT;
        let param = {
            userClass,
            userName,
            active,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH;
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
            ' AND TB_ITUSER.CUST_CD LIKE :orgCode ' +
            ' AND TB_ITUSER.ACTIVE LIKE :active ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH + SQL_LIMIT;
        let param = {
            userClass,
            orgCode,
            active,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH;
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
                                ' AND TB_ITUSER.USER_NM LIKE :userName ' +
                                ' AND TB_ITUSER.CUST_CD LIKE :orgCode ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH + SQL_LIMIT;
        let param = {
            userID,
            userName,
            orgCode,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH;
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
                                ' AND TB_ITUSER.USER_NM LIKE :userName ' +
                                ' AND TB_ITUSER.ACTIVE LIKE :active ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH + SQL_LIMIT;
        let param = {
            userID,
            userName,
            active,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH;
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
            ' AND TB_ITUSER.CUST_CD LIKE :orgCode ' +
            ' AND TB_ITUSER.ACTIVE LIKE :active ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH + SQL_LIMIT;
        let param = {
            userID,
            orgCode,
            active,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH;
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
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.CUST_CD LIKE :orgCode  ' +
                                ' AND TB_ITUSER.USER_NM LIKE :userName ' +
                                ' AND TB_ITUSER.ACTIVE LIKE :active ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH + SQL_LIMIT;
        let param = {
            orgCode,
            userName,
            active,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH;
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
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.CUST_CD LIKE :orgCode  ' +
            ' AND TB_ITUSER.USER_NM LIKE :userName ' +
            ' AND TB_ITUSER.INOUT_GB LIKE :userClass ' +
            ' AND TB_ITUSER.USER_ID LIKE :userID ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH + SQL_LIMIT;
        let param = {
            orgCode,
            userName,
            userID,
            userClass,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH;
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
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.CUST_CD LIKE :orgCode  ' +
            ' AND TB_ITUSER.USER_NM LIKE :userName ' +
            ' AND TB_ITUSER.ACTIVE LIKE :active ' +
            ' AND TB_ITUSER.USER_ID LIKE :userID ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH + SQL_LIMIT;
        let param = {
            orgCode,
            userName,
            userID,
            active,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH;
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
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.CUST_CD LIKE :orgCode  ' +
            ' AND TB_ITUSER.USER_NM LIKE :userName ' +
            ' AND TB_ITUSER.ACTIVE LIKE :active ' +
            ' AND TB_ITUSER.INOUT_GB LIKE :userClass ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH + SQL_LIMIT;
        let param = {
            orgCode,
            userName,
            userClass,
            active,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH;
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
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.CUST_CD LIKE :orgCode  ' +
            ' AND TB_ITUSER.USER_ID LIKE :userID ' +
            ' AND TB_ITUSER.ACTIVE LIKE :active ' +
            ' AND TB_ITUSER.INOUT_GB LIKE :userClass ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH + SQL_LIMIT;
        let param = {
            orgCode,
            userID,
            userClass,
            active,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH;
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
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.USER_NM LIKE :userName  ' +
            ' AND TB_ITUSER.USER_ID LIKE :userID ' +
            ' AND TB_ITUSER.ACTIVE LIKE :active ' +
            ' AND TB_ITUSER.INOUT_GB LIKE :userClass ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH + SQL_LIMIT;
        let param = {
            userName,
            userID,
            userClass,
            active,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH;
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
        user_id: {val: null},
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
    let sqlCheckUser = `SELECT  * FROM TB_ITUSER WHERE USER_NM = :user_name`;
    let paramsCheckUserName = {user_name: {val: userName}};
    let isExit = await oracelService.checkIsExistUserName(res, sqlCheckUser, paramsCheckUserName, optionFormatObj);
    if (isExit[0]) {
        return res.status(500).send({message: "User Name [" + userName + "] has been used!"});
    } else {
        let sql_insert = `INSERT INTO TB_ITUSER (USER_ID , USER_NM, CUST_CD, INOUT_GB,  USER_PW , VALID_START_DT , VALID_END_DT, TEL_NO_MOBILE , ADDR , WORK_ID  , EMAIL, SYS_DTIM , ACTIVE , ROLE_ID)
         VALUES (:user_id, :user_name, :custCd, :typeUser, :password, :validStartDT, :validEndDT , :phone, :address , :workID , :email , :systemDate ,:active , :role)`;
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
            '  CUST_CD=:orgCode, INOUT_GB=:userClass, VALID_START_DT=:validStartDT, VALID_END_DT=:validEndDT, TEL_NO_MOBILE=:phone, ADDR=:address, EMAIL=:email, ACTIVE=:active , ROLE_ID=:role ' +
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
