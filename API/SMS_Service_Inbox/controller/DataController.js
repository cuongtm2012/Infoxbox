const dateService = require('../service/date.service');
const queryOracle = require('../service/oracleConnect.service');
const oracledb = require('oracledb');

const optionSelect = { outFormat: oracledb.OUT_FORMAT_OBJECT };
const optionCommit = { autoCommit: true};
const params = {};

const moment = require('moment-timezone');
let timeOutput = moment().tz("Asia/Bangkok").format();

exports.getPhoneNumber = async function () {
    let SELECT = 'SELECT TEL_NO_MOBILE AS PHONE FROM TB_SCRPLOG ';
    let WHERE = ` WHERE GDS_CD = 'S1003' AND SCRP_MOD_CD = '00' AND SCRP_STAT_CD = '01' AND AGR_FG = 'Y' AND LOGIN_PW is null FETCH NEXT 1 ROWS ONLY `;
    let sql = SELECT + WHERE;
    return await queryOracle(sql, params, optionSelect);

};

exports.updateRegisteredMSG = async function (RSLT, STATUS_SMS, phone) {
    const rslt_date = dateService.formatDate();
    let sql = "UPDATE MSG_TABLE SET RSLT_DATE = TO_DATE('" + rslt_date + "', 'yyyy/mm/dd hh24:mi:ss')" +
        ", RSLT = " + RSLT +
        ", STATUS_SMS = " + STATUS_SMS +
        " WHERE MSGKEY = '" + phone.MSGKEY + "'";
    return await queryOracle(sql, params, optionCommit);
};

exports.updateSCRP_MOD_CD = async function(phone) {
    let sql = ` UPDATE TB_SCRPLOG SET SCRP_MOD_CD = '05' WHERE TEL_NO_MOBILE = :phone `;
    let params = {
        phone
    };
    return await queryOracle(sql, params, optionCommit);
};

exports.selectTable = async function () {
    const dateSelect = dateService.formatDateForTable();
    let sql = "select tname from tab where tname = 'MSG_TABLE_" + dateSelect + "'";
    return await queryOracle(sql, params, optionSelect);
};

exports.getRow = async function(phone) {
    let sql = "select*from MSG_TABLE where MSGKEY = " + phone.MSGKEY;
    return await queryOracle(sql, params, optionSelect);
};

exports.insertMSG = async function (reslt) {
    const dateInsert = dateService.formatDateForTable();
    let sql = 'INSERT INTO MSG_TABLE_' + dateInsert + ' VALUES (:MSGKEY, :COMPKEY, :PHONE, :STATUS_SMS, :INPUT_DATE, :SEND_DATE, :RSLT_DATE, :RSLT, :MSG, :TYPE_SMS)';
    let values = {
        MSGKEY: {val: reslt.MSGKEY },
        COMPKEY: {val: reslt.COMPKEY},
        PHONE: {val: reslt.PHONE},
        STATUS_SMS: {val: reslt.STATUS_SMS},
        INPUT_DATE: {val: reslt.INPUT_DATE},
        SEND_DATE: {val: reslt.SEND_DATE},
        RSLT_DATE: {val: reslt.RSLT_DATE},
        RSLT: {val: reslt.RSLT},
        MSG: {val: reslt.MSG},
        TYPE_SMS: {val: reslt.TYPE_SMS}

    };
    return await queryOracle(sql, values, optionCommit);
};

exports.deleteMSG = async function (phone) {
    let DELETE = "DELETE FROM MSG_TABLE";
    let WHERE = " WHERE MSGKEY = " + phone.MSGKEY;
    let sql = DELETE + WHERE;
    return await queryOracle(sql, params, optionCommit);
};

exports.createTable = async function () {
    const dateCreate = dateService.formatDateForTable(timeOutput);
    let sql = "CREATE TABLE " + "MSG_TABLE_" + dateCreate
    + " (MSGKEY INT NOT NULL PRIMARY KEY, COMPKEY VARCHAR(20) NOT NULL, PHONE VARCHAR(12) NOT NULL, STATUS_SMS INT NOT NULL, INPUT_DATE TIMESTAMP NULL, SEND_DATE TIMESTAMP NULL, RSLT_DATE TIMESTAMP NULL, RSLT INT NULL, MSG VARCHAR(500) NULL, TYPE_SMS INT NOT NULL)";
    return queryOracle(sql, params, optionCommit);
};


