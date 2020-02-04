const oracledb = require('oracledb');
var bcrypt = require('bcrypt');
const oracelService = require('../services/oracelQuery.service');
var _ = require('lodash');
const optionFormatObj = { outFormat: oracledb.OUT_FORMAT_OBJECT };
const optionAutoCommit = { autoCommit: true };
const saltRounds = 10;
const defaultPW = 'nice1234';


exports.getUserInfo = async function (req, res) {
    var INOUT_GB = req.query.userClass;
    var USER_ID = req.query.userID;
    var USER_NM = req.query.userName;
    var CUST_CD = req.query.orgCode;
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
    to_char(to_date(SYS_DTIM, 'YYYY/MM/DD HH:MI:SS'),'mm/dd/yyyy hh:mi:ss') as SYS_DTIM,
    to_char(to_date(VALID_START_DT, 'yyyymmdd'),'mm/dd/yyyy') as VALID_START_DT,
    to_char(to_date(VALID_END_DT, 'yyyymmdd'),'mm/dd/yyyy') as VALID_END_DT,
    WORK_ID as WORK_ID `;
    var SQL_FROM = 'FROM TB_ITUSER ';
    var SQL_WHERE_SEARCH = 'WHERE INOUT_GB LIKE :INOUT_GB ' +
                                'OR USER_ID LIKE :USER_ID ' +
                                'OR USER_NM LIKE :USER_NM ' +
                                'OR CUST_CD LIKE :CUST_CD ';
    var SQL_LIMIT = 'OFFSET :currentLocation ROWS FETCH NEXT :limitRow ROWS ONLY ';

    if (_.isEmpty(INOUT_GB) && _.isEmpty(USER_ID) && _.isEmpty(USER_NM) && _.isEmpty(CUST_CD)) {
        let sql = SQL_SELECT + SQL_FROM + SQL_LIMIT;
        let param = {
            currentLocation,
            limitRow
        };
        oracelService.queryOracel(res, sql, param, optionFormatObj);
    } else {
        let sql = SQL_SELECT + SQL_FROM + SQL_WHERE_SEARCH + SQL_LIMIT;
        let param = {
            INOUT_GB,
            USER_ID,
            USER_NM,
            CUST_CD,
            currentLocation,
            limitRow
        };
        oracelService.queryOracel(res, sql, param, optionFormatObj);
    }
};

exports.createUser = async function (req, res) {
    try {
    var INOUT_GB = req.body.userClass;
    var USER_NM = req.body.userName;
    var CUST_CD = req.body.orgCode;
    var VALID_START_DT = (_.isEmpty(req.body.validStartDT)) ? null: req.body.validStartDT.replace(/[^0-9 ]/g, "");
    var VALID_END_DT = (_.isEmpty(req.body.validEndDT)) ? null: req.body.validEndDT.replace(/[^0-9 ]/g, "");
    var TEL_NO_MOBILE = req.body.phone;
    var ADDR = req.body.address;
    var EMAIL = req.body.email;
    var SYS_DTIM = req.body.finalOperaDate.replace(/[^0-9 ]/g, "");;
    var WORK_ID = req.body.workID;
    var USER_PW = bcrypt.hashSync(defaultPW, saltRounds);


    if(_.isEmpty(USER_NM) || _.isEmpty(CUST_CD) ||
        _.isEmpty(SYS_DTIM) || _.isEmpty(INOUT_GB)) {
        res.status(500).send({message: 'User Classification, User Name, Final Operation Date, Organization Code require not blank'});
    } else {
            var param = {
                USER_NM,
                CUST_CD,
                INOUT_GB,
                USER_PW,
                VALID_START_DT,
                VALID_END_DT,
                TEL_NO_MOBILE,
                ADDR,
                EMAIL,
                SYS_DTIM,
                WORK_ID
            };
            let SQL = 'INSERT INTO ADMIN.TB_ITUSER (USER_NM, CUST_CD, INOUT_GB, USER_PW, VALID_START_DT, VALID_END_DT, TEL_NO_MOBILE, ADDR, EMAIL, SYS_DTIM, WORK_ID) ' +
                'VALUES(:USER_NM, :CUST_CD, :INOUT_GB, :USER_PW, :VALID_START_DT, :VALID_END_DT, :TEL_NO_MOBILE, :ADDR, :EMAIL, :SYS_DTIM, :WORK_ID)';

            oracelService.queryOracel(res, SQL, param, optionAutoCommit);
        }
    } catch (e) {
        throw e;
    }
};
exports.updateUser = async function (req, res) {
    var INOUT_GB = req.body.userClass;
    var USER_NM = req.body.userName;
    var CUST_CD = req.body.orgCode;
    var VALID_START_DT = (_.isEmpty(req.body.validStartDT)) ? null: req.body.validStartDT.replace(/[^0-9 ]/g, "");
    var VALID_END_DT = (_.isEmpty(req.body.validEndDT)) ? null: req.body.validEndDT.replace(/[^0-9 ]/g, "");
    var TEL_NO_MOBILE = req.body.phone;
    var ADDR = req.body.address;
    var EMAIL = req.body.email;
    var USER_ID = req.body.userID;

    if(_.isEmpty(USER_NM) || _.isEmpty(CUST_CD) ||
         _.isEmpty(INOUT_GB)) {
        res.status(500).send({message: 'User Classification, User Name, Organization Code require not blank'});
    } else {
        var param = {
            USER_NM,
            INOUT_GB,
            CUST_CD,
            VALID_START_DT,
            VALID_END_DT,
            TEL_NO_MOBILE,
            ADDR,
            EMAIL,
            USER_ID,
        };

        let SQL = 'UPDATE ADMIN.TB_ITUSER SET' +
            ' USER_NM=:USER_NM, CUST_CD=:CUST_CD, INOUT_GB=:INOUT_GB, VALID_START_DT=:VALID_START_DT, VALID_END_DT=:VALID_END_DT, TEL_NO_MOBILE=:TEL_NO_MOBILE, ADDR=:ADDR, EMAIL=:EMAIL' +
            ' WHERE USER_ID=:USER_ID ';
        oracelService.queryOracel(res, SQL, param, optionAutoCommit);
    }
};

exports.resetPassword = async function (req, res) {
    var USER_ID = req.body.userID;
    var USER_PW = bcrypt.hashSync(defaultPW, saltRounds);

    if(_.isEmpty(USER_ID)) {
        res.status(500).send({message: 'User ID provide blank!'})
    } else {
        var param = {
            USER_ID,
            USER_PW
        };

        let SQL = 'UPDATE ADMIN.TB_ITUSER SET USER_PW=:USER_PW WHERE USER_ID=:USER_ID ';
        oracelService.queryOracel(res, SQL, param, optionAutoCommit);
    }
};
