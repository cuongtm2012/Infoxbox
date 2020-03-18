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
    var currentLocation = req.query.currentLocation;
    var limitRow = req.query.limitRow;

    var SQL_SELECT = `SELECT
    TB_ITCUST.CUST_NM as CUST_NM,
    TB_ITUSER.USER_ID as USER_ID,
    TB_ITUSER.USER_NM as USER_NM,
    TB_ITUSER.CUST_CD as CUST_CD,
    TB_ITUSER.INOUT_GB as INOUT_GB,
    TB_ITUSER. ADDR as ADDR,
    TB_ITUSER.EMAIL as EMAIL,
    TB_ITUSER.TEL_NO_MOBILE as TEL_NO_MOBILE,
    to_char(to_date(TB_ITUSER.SYS_DTIM, 'YYYY/MM/DD HH24:MI:SS'),'yyyy/mm/dd hh24:mi:ss') as SYS_DTIM,
    to_char(to_date(TB_ITUSER.VALID_START_DT, 'yyyymmdd'),'yyyy/mm/dd') as VALID_START_DT,
    to_char(to_date(TB_ITUSER.VALID_END_DT, 'yyyymmdd'),'yyyy/mm/dd') as VALID_END_DT,
    TB_ITUSER.WORK_ID as WORK_ID `;
    var SQL_SELECT_COUNT = `SELECT COUNT(*) AS total `;
    var SQL_FROM = 'FROM TB_ITUSER ';
    var SQL_JOIN = 'LEFT JOIN TB_ITCUST ON TB_ITUSER.CUST_CD = TB_ITCUST.CUST_CD ';
    var SQL_LIMIT = 'OFFSET :currentLocation ROWS FETCH NEXT :limitRow ROWS ONLY ';

    if (_.isEmpty(userClass) && _.isEmpty(userID) && _.isEmpty(userName) && _.isEmpty(orgCode)) {
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
    if ((userClass) && (userID) && (userName) && (orgCode)) {
        let SQL_WHERE_SEARCH = 'WHERE TB_ITUSER.INOUT_GB LIKE :userClass ' +
            'AND TB_ITUSER.USER_ID LIKE :userID ' +
            'AND TB_ITUSER.USER_NM LIKE :userName ' +
            'AND TB_ITUSER.CUST_CD LIKE :orgCode ';
        let sql = SQL_SELECT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH + SQL_LIMIT;
        let param = {
            userClass,
            userID,
            orgCode,
            userName,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_JOIN + SQL_WHERE_SEARCH;
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

    if((userClass) && _.isEmpty(userID) && _.isEmpty(userName) && _.isEmpty(orgCode)) {
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

    if(_.isEmpty(userClass) && (userID) && _.isEmpty(userName) && _.isEmpty(orgCode)) {
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

    if(_.isEmpty(userClass) && _.isEmpty(userID) && _.isEmpty(userName) && (orgCode)) {
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

    if(_.isEmpty(userClass) && _.isEmpty(userID) && (userName) && _.isEmpty(orgCode)) {
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

    if((userClass) && (userID) && _.isEmpty(userName) && _.isEmpty(orgCode)) {
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

    if((userClass) && _.isEmpty(userID) && (userName) && _.isEmpty(orgCode)) {
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

    if((userClass) && _.isEmpty(userID) && _.isEmpty(userName) && (orgCode)) {
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

    if(_.isEmpty(userClass) && (userID) && (userName) && _.isEmpty(orgCode)) {
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

    if(_.isEmpty(userClass) && (userID) && _.isEmpty(userName) && (orgCode)) {
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

    if(_.isEmpty(userClass) && _.isEmpty(userID) && (userName) && (orgCode)) {
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

    if((userClass) && (userID) && (userName) && _.isEmpty(orgCode)) {
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

    if((userClass) && (userID) && _.isEmpty(userName) && (orgCode)) {
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

    if((userClass) && _.isEmpty(userID) && (userName) && (orgCode)) {
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

    if(_.isEmpty(userClass) && (userID) && (userName) && (orgCode)) {
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
};

exports.createUser = async function (req, res) {
    try {
    var userClass = req.body.userClass;
    var userName = req.body.userName;
    var orgCode = req.body.orgCode;
    var validStartDT = (_.isEmpty(req.body.validStartDT)) ? null: req.body.validStartDT.replace(/[^0-9 ]/g, "");
    var validEndDT = (_.isEmpty(req.body.validEndDT)) ? null: req.body.validEndDT.replace(/[^0-9 ]/g, "");
    var phone = req.body.phone;
    var address = req.body.address;
    var email = req.body.email;
    var finalOperaDate = req.body.finalOperaDate.replace(/[^0-9 ]/g, "");;
    var workID = req.body.workID;
    var userPW = bcrypt.hashSync(defaultPW, saltRounds);


    if(_.isEmpty(userName) || _.isEmpty(orgCode) ||
        _.isEmpty(finalOperaDate) || _.isEmpty(userClass)) {
        res.status(500).send({message: 'User Classification, User Name, Final Operation Date, Organization Code require not blank'});
    } else {
            var param = {
                userName,
                orgCode,
                userClass,
                userPW,
                validStartDT,
                validEndDT,
                phone,
                address,
                email,
                finalOperaDate,
                workID
            };
            let SQL = 'INSERT INTO ADMIN.TB_ITUSER (USER_NM, CUST_CD, INOUT_GB, USER_PW, VALID_START_DT, VALID_END_DT, TEL_NO_MOBILE, ADDR, EMAIL, SYS_DTIM, WORK_ID) ' +
                'VALUES(:userName, :orgCode, :userClass, :userPW, :validStartDT, :validEndDT, :phone, :address, :email, :finalOperaDate, :workID)';

            oracelService.queryOracel(res, SQL, param, optionAutoCommit);
        }
    } catch (e) {
        throw e;
    }
};
exports.updateUser = async function (req, res) {
    var userClass = req.body.userClass;
    var userName = req.body.userName;
    var orgCode = req.body.orgCode;
    var validStartDT = (_.isEmpty(req.body.validStartDT)) ? null: req.body.validStartDT.replace(/[^0-9 ]/g, "");
    var validEndDT = (_.isEmpty(req.body.validEndDT)) ? null: req.body.validEndDT.replace(/[^0-9 ]/g, "");
    var phone = req.body.phone;
    var address = req.body.address;
    var email = req.body.email;
    var userID = req.body.userID;

    if(_.isEmpty(userName) || _.isEmpty(orgCode) ||
         _.isEmpty(userClass)) {
        res.status(500).send({message: 'User Classification, User Name, Organization Code require not blank'});
    } else {
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
        };

        let SQL = 'UPDATE ADMIN.TB_ITUSER SET' +
            ' USER_NM=:userName, CUST_CD=:orgCode, INOUT_GB=:userClass, VALID_START_DT=:validStartDT, VALID_END_DT=:validEndDT, TEL_NO_MOBILE=:phone, ADDR=:address, EMAIL=:email' +
            ' WHERE USER_ID=:userID ';
        oracelService.queryOracel(res, SQL, param, optionAutoCommit);
    }
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
        oracelService.queryOracel(res, SQL, param, optionAutoCommit);
    }
};
