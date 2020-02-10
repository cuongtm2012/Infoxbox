const oracledb = require('oracledb');
var bcrypt = require('bcrypt');
const oracelService = require('../services/oracelQuery.service');
var _ = require('lodash');
const optionFormatObj = { outFormat: oracledb.OUT_FORMAT_OBJECT };
const optionAutoCommit = { autoCommit: true };
const saltRounds = 10;
const defaultPW = 'nice1234';


exports.getUserInfo = async function (req, res) {
    var userClass = req.query.userClass;
    var userID = req.query.userID;
    var userName = req.query.userName;
    var orgCode = req.query.orgCode;
    var currentLocation = req.query.currentLocation;
    var limitRow = req.query.limitRow;

    var SQL_SELECT = `SELECT
    USER_ID as USER_ID,
    USER_NM as USER_NM,
    CUST_CD as CUST_CD,
    INOUT_GB as INOUT_GB,
    ADDR as ADDR,
    EMAIL as EMAIL,
    TEL_NO_MOBILE as TEL_NO_MOBILE,
    to_char(to_date(SYS_DTIM, 'YYYY/MM/DD HH24:MI:SS'),'yyyy/mm/dd hh24:mi:ss') as SYS_DTIM,
    to_char(to_date(VALID_START_DT, 'yyyymmdd'),'yyyy/mm/dd') as VALID_START_DT,
    to_char(to_date(VALID_END_DT, 'yyyymmdd'),'yyyy/mm/dd') as VALID_END_DT,
    WORK_ID as WORK_ID `;
    var SQL_FROM = 'FROM TB_ITUSER ';
    var SQL_WHERE_SEARCH = 'WHERE INOUT_GB LIKE :userClass ' +
                                'OR USER_ID LIKE :userID ' +
                                'OR USER_NM LIKE :userName ' +
                                'OR CUST_CD LIKE :orgCode ';
    var SQL_LIMIT = 'OFFSET :currentLocation ROWS FETCH NEXT :limitRow ROWS ONLY ';

    if (_.isEmpty(userClass) && _.isEmpty(userID) && _.isEmpty(userName) && _.isEmpty(orgCode)) {
        let sql = SQL_SELECT + SQL_FROM + SQL_LIMIT;
        let param = {
            currentLocation,
            limitRow
        };
        oracelService.queryOracel(res, sql, param, optionFormatObj);
    } else {
        let sql = SQL_SELECT + SQL_FROM + SQL_WHERE_SEARCH + SQL_LIMIT;
        let param = {
            userClass,
            userID,
            orgCode,
            userName,
            currentLocation,
            limitRow
        };
        oracelService.queryOracel(res, sql, param, optionFormatObj);
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
