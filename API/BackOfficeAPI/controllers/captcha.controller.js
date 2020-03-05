const oracledb = require('oracledb');
var bcrypt = require('bcrypt');
const oracelService = require('../services/oracelQuery.service');
var _ = require('lodash');
const optionFormatObj = { outFormat: oracledb.OUT_FORMAT_OBJECT };
const optionAutoCommit = { autoCommit: true };

exports.getCaptchaInfo = async function (req, res) {
    var userID = req.query.userID ? '%' + req.query.userID + '%' : '';
    var userName = req.query.userName ? '%' + req.query.userName + '%' : '';;
    var currentLocation = req.query.currentLocation;
    var limitRow = req.query.limitRow;

    var SQL_SELECT = `SELECT
    CAPTCHA_USER_ID as CAPTCHA_USER_ID,
    CAPTCHA_USER_NM as CAPTCHA_USER_NM,
    ADDR as ADDR,
    EMAIL as EMAIL,
    TEL_NO_MOBILE as TEL_NO_MOBILE,
    to_char(to_date(SYS_DTIM, 'YYYY/MM/DD HH24:MI:SS'),'mm/dd/yyyy hh24:mi:ss') as SYS_DTIM,
    to_char(to_date(VALID_START_DT, 'yyyymmdd'),'mm/dd/yyyy') as VALID_START_DT,
    to_char(to_date(VALID_END_DT, 'yyyymmdd'),'mm/dd/yyyy') as VALID_END_DT,
    WORK_ID as WORK_ID `;
    var SQL_SELECT_COUNT = `SELECT COUNT(*) AS total `;
    var SQL_FROM = 'FROM TB_CAPTCHA_RSP ';
    var SQL_LIMIT = 'OFFSET :currentLocation ROWS FETCH NEXT :limitRow ROWS ONLY ';

    if (_.isEmpty(userID) && _.isEmpty(userName)) {
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
    if ((userID) && (userName)) {
        let SQL_WHERE_SEARCH = 'WHERE CAPTCHA_USER_ID LIKE :userID ' +
            'AND CAPTCHA_USER_NM LIKE :userName ';
        let sql = SQL_SELECT + SQL_FROM + SQL_WHERE_SEARCH + SQL_LIMIT;
        let param = {
            userID,
            userName,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_WHERE_SEARCH;
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
    if ((userID) && _.isEmpty(userName)) {
        let SQL_WHERE_SEARCH = 'WHERE CAPTCHA_USER_ID LIKE :userID ';
        let sql = SQL_SELECT + SQL_FROM + SQL_WHERE_SEARCH + SQL_LIMIT;
        let param = {
            userID,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_WHERE_SEARCH;
        let paramSearch = {
            userID,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if (_.isEmpty(userID) && (userName)) {
        let SQL_WHERE_SEARCH = 'WHERE CAPTCHA_USER_NM LIKE :userName ';
        let sql = SQL_SELECT + SQL_FROM + SQL_WHERE_SEARCH + SQL_LIMIT;
        let param = {
            userName,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_WHERE_SEARCH;
        let paramSearch = {
            userName,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
};

exports.createCaptcha = async function (req, res) {
    var userID = req.body.userID;
    var userName = req.body.userName;
    var phone = req.body.phone;
    var email = req.body.email;
    var address = req.body.address;
    var validStartDT = (_.isEmpty(req.body.validStartDT)) ? null : req.body.validStartDT.replace(/[^0-9 ]/g, "");
    var validEndDT = (_.isEmpty(req.body.validEndDT)) ? null : req.body.validEndDT.replace(/[^0-9 ]/g, "");
    var finalOperaDate = req.body.finalOperaDate.replace(/[^0-9 ]/g, "");
    var workID = req.body.workID;

    if (_.isEmpty(userName) || _.isEmpty(userID) ||
        _.isEmpty(finalOperaDate)) {
        res.status(500).send({message: 'User Name, Final Operation Date, User ID require not blank'});
    } else {
        var param = {
            userID,
            userName,
            validStartDT,
            validEndDT,
            phone,
            address,
            email,
            finalOperaDate,
            workID
        };
        let SQL = 'INSERT INTO ADMIN.TB_CAPTCHA_RSP (CAPTCHA_USER_ID, CAPTCHA_USER_NM, VALID_START_DT, VALID_END_DT, TEL_NO_MOBILE, ADDR, EMAIL, SYS_DTIM, WORK_ID) ' +
            'VALUES(:userID, :userName, :validStartDT, :validEndDT, :phone, :address, :email, :finalOperaDate, :workID)';

        oracelService.queryOracel(res, SQL, param, optionAutoCommit);
    }
};

exports.updateCaptcha = async function (req, res) {
    var userID = req.body.userID;
    var userName = req.body.userName;
    var phone = req.body.phone;
    var email = req.body.email;
    var address = req.body.address;
    var validStartDT = (_.isEmpty(req.body.validStartDT)) ? null : req.body.validStartDT.replace(/[^0-9 ]/g, "");
    var validEndDT = (_.isEmpty(req.body.validEndDT)) ? null : req.body.validEndDT.replace(/[^0-9 ]/g, "");

    if(_.isEmpty(userName)) {
        res.status(500).send({message: ' User Name require not blank'});
    } else {
        var param = {
            userName,
            validStartDT,
            validEndDT,
            phone,
            address,
            email,
            userID,
        };

        let SQL = 'UPDATE ADMIN.TB_CAPTCHA_RSP SET ' +
            ' CAPTCHA_USER_NM = :userName, VALID_START_DT = :validStartDT, VALID_END_DT = :validEndDT, TEL_NO_MOBILE = :phone, ADDR = :address, EMAIL = :email' +
            ' WHERE CAPTCHA_USER_ID = :userID ';
        oracelService.queryOracel(res, SQL, param, optionAutoCommit);
    }
};
