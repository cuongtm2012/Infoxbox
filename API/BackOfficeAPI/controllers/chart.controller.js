const oracledb = require('oracledb');
var bcrypt = require('bcrypt');
const oracelService = require('../services/oracelQuery.service');
var _ = require('lodash');
const optionFormatObj = { outFormat: oracledb.OUT_FORMAT_OBJECT };
const optionAutoCommit = { autoCommit: true };
const dateFormat = require('dateformat');
const moment = require('moment');

exports.getDataFromDayToDayChartBar = async function (req, res) {
  let fromDate = req.query.fromDate;
  let toDate = req.query.toDate;
  let result = [];
  // Get all day have request
  let SQL_SELECT = `SELECT DISTINCT TB_SCRPLOG.INQ_DTIM AS INQ_DTIM `;
  let SQL_FROM = 'FROM TB_SCRPLOG ';
  let SQL_Where = ` WHERE to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:fromDate, 'YYYY/MM/DD') AND to_date(:toDate, 'YYYY/MM/DD') ORDER BY TB_SCRPLOG.INQ_DTIM ASC`
  let SQL = SQL_SELECT + SQL_FROM + SQL_Where;
  let params  = {
    fromDate,
    toDate
  }
  let daysHaveResult = await oracelService.queryAndReturnData(res,SQL,params,optionFormatObj)
  console.log(daysHaveResult);
  //checking
  if (daysHaveResult[0]) {
    let SQL_10 = `SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) AS COMPLETED FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM =:INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '10'`
    let SQL_00 = `SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) AS SMS FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM =:INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '00'`
    let SQL_01 = `SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) AS RP_IQ_RQ_OK FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM =:INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '01'`
    let SQL_02 = `SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) AS CIC_LOGIN_OK FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM =:INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '02'`
    let SQL_03 = `SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) AS CIC_ID_IQ_OK FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM =:INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '03'`
    let SQL_04 = `SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) AS CIC_RP_IQ_OK FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM =:INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '04'`
    let SQL_20 = `SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) AS LOGIN_ERROR FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM =:INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '20'`
    let SQL_21 = `SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) AS CIC_ID_IQ_ERROR FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM =:INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '21'`
    let SQL_22 = `SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) AS CIC_RP_IQ_ERROR FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM =:INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '22'`
    let SQL_23 = `SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) AS CIC_RQ_RS_IQ_ERROR FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM =:INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '23'`
    let SQL_24 = `SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) AS SCRAP_TG_RP_NOT_EXIST FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM =:INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '24'`
    let SQL_29 = `SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) AS OTHER_ERROR FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM =:INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '29'`
    for (const e of daysHaveResult) {
      let param = {
        INQ_DTIM: e.INQ_DTIM,
      }
      let count_10 = await oracelService.queryAndReturnData(res,SQL_10,param,optionFormatObj);
      let count_00 = await oracelService.queryAndReturnData(res,SQL_00,param,optionFormatObj);
      let count_01 = await oracelService.queryAndReturnData(res,SQL_01,param,optionFormatObj);
      let count_02 = await oracelService.queryAndReturnData(res,SQL_02,param,optionFormatObj);
      let count_03 = await oracelService.queryAndReturnData(res,SQL_03,param,optionFormatObj);
      let count_04 = await oracelService.queryAndReturnData(res,SQL_04,param,optionFormatObj);
      let count_20 = await oracelService.queryAndReturnData(res,SQL_20,param,optionFormatObj);
      let count_21 = await oracelService.queryAndReturnData(res,SQL_21,param,optionFormatObj);
      let count_22 = await oracelService.queryAndReturnData(res,SQL_22,param,optionFormatObj);
      let count_23 = await oracelService.queryAndReturnData(res,SQL_23,param,optionFormatObj);
      let count_24 = await oracelService.queryAndReturnData(res,SQL_24,param,optionFormatObj);
      let count_29 = await oracelService.queryAndReturnData(res,SQL_29,param,optionFormatObj);
      let object = {
        SMS: count_00[0].SMS,
        RP_IQ_RQ_OK: count_01[0].RP_IQ_RQ_OK,
        CIC_LOGIN_OK: count_02[0].CIC_LOGIN_OK,
        CIC_ID_IQ_OK: count_03[0].CIC_ID_IQ_OK,
        CIC_RP_IQ_OK: count_04[0].CIC_RP_IQ_OK,
        COMPLETED: count_10[0].COMPLETED,
        LOGIN_ERROR: count_20[0].LOGIN_ERROR,
        CIC_ID_IQ_ERROR: count_21[0].CIC_ID_IQ_ERROR,
        CIC_RP_IQ_ERROR: count_22[0].CIC_RP_IQ_ERROR,
        CIC_RQ_RS_IQ_ERROR: count_23[0].CIC_RQ_RS_IQ_ERROR,
        SCRAP_TG_RP_NOT_EXIST: count_24[0].SCRAP_TG_RP_NOT_EXIST,
        OTHER_ERROR: count_29[0].OTHER_ERROR,
        DATE: e.INQ_DTIM
      }
      await result.push(object);
    }
    console.log('Day la ket qua: ' + result);
    return res.status(200).send(result);
  } else {
    return res.status(204).send([]);
  }
};

exports.getDataMonthFromMonth = async function (req, res) {
  let fromDate = req.query.fromDate
  let toDate = req.query.toDate;
  let result = [];
  // get All month between 2 date
  let d1 = new Date(fromDate);
  let d2 = new Date(toDate);

  let ydiff = d2.getYear() - d1.getYear();
  let mdiff = d2.getMonth() - d1.getMonth();

  let diff = (ydiff * 12 + mdiff);
  let arrAllMonth = []
  for (i = 0; i <= diff; i++) {
    if (i == 0)
      d1.setMonth(d1.getMonth() - 1);
    else
      d1.setMonth(d1.getMonth() + 1);

    arrAllMonth[i] = moment(d1).format("YYYYMM");
  }
//  get all month have request
  let arrMonthHaveRs = [];
  let SQL_SELECT = `SELECT DISTINCT TB_SCRPLOG.INQ_DTIM AS INQ_DTIM `;
  let SQL_FROM = 'FROM TB_SCRPLOG ';
  let SQL_Where = `  WHERE TB_SCRPLOG.INQ_DTIM LIKE :yearMonth ORDER BY TB_SCRPLOG.INQ_DTIM ASC`
  let SQL = SQL_SELECT + SQL_FROM + SQL_Where;
  for (const e of arrAllMonth) {
    let param = {
      yearMonth: '%' + e + '%',
    }
    let isMonthHaveResult = await oracelService.queryAndReturnData(res, SQL, param, optionFormatObj)
    if (isMonthHaveResult[0]) {
      await arrMonthHaveRs.push(e);
    }
  }
  //checking
  if (arrMonthHaveRs[0]) {
    let SQL_10 = `SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) AS COMPLETED FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '10'`
    let SQL_00 = `SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) AS SMS FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '00'`
    let SQL_01 = `SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) AS RP_IQ_RQ_OK FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '01'`
    let SQL_02 = `SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) AS CIC_LOGIN_OK FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '02'`
    let SQL_03 = `SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) AS CIC_ID_IQ_OK FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '03'`
    let SQL_04 = `SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) AS CIC_RP_IQ_OK FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '04'`
    let SQL_20 = `SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) AS LOGIN_ERROR FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '20'`
    let SQL_21 = `SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) AS CIC_ID_IQ_ERROR FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '21'`
    let SQL_22 = `SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) AS CIC_RP_IQ_ERROR FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '22'`
    let SQL_23 = `SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) AS CIC_RQ_RS_IQ_ERROR FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '23'`
    let SQL_24 = `SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) AS SCRAP_TG_RP_NOT_EXIST FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '24'`
    let SQL_29 = `SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) AS OTHER_ERROR FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '29'`
    for (const e of arrMonthHaveRs) {
      let param = {
        INQ_DTIM: '%' + e + '%',
      }
      let count_10 = await oracelService.queryAndReturnData(res, SQL_10, param, optionFormatObj);
      let count_00 = await oracelService.queryAndReturnData(res, SQL_00, param, optionFormatObj);
      let count_01 = await oracelService.queryAndReturnData(res, SQL_01, param, optionFormatObj);
      let count_02 = await oracelService.queryAndReturnData(res, SQL_02, param, optionFormatObj);
      let count_03 = await oracelService.queryAndReturnData(res, SQL_03, param, optionFormatObj);
      let count_04 = await oracelService.queryAndReturnData(res, SQL_04, param, optionFormatObj);
      let count_20 = await oracelService.queryAndReturnData(res, SQL_20, param, optionFormatObj);
      let count_21 = await oracelService.queryAndReturnData(res, SQL_21, param, optionFormatObj);
      let count_22 = await oracelService.queryAndReturnData(res, SQL_22, param, optionFormatObj);
      let count_23 = await oracelService.queryAndReturnData(res, SQL_23, param, optionFormatObj);
      let count_24 = await oracelService.queryAndReturnData(res, SQL_24, param, optionFormatObj);
      let count_29 = await oracelService.queryAndReturnData(res, SQL_29, param, optionFormatObj);
      let object = {
        SMS: count_00[0].SMS,
        RP_IQ_RQ_OK: count_01[0].RP_IQ_RQ_OK,
        CIC_LOGIN_OK: count_02[0].CIC_LOGIN_OK,
        CIC_ID_IQ_OK: count_03[0].CIC_ID_IQ_OK,
        CIC_RP_IQ_OK: count_04[0].CIC_RP_IQ_OK,
        COMPLETED: count_10[0].COMPLETED,
        LOGIN_ERROR: count_20[0].LOGIN_ERROR,
        CIC_ID_IQ_ERROR: count_21[0].CIC_ID_IQ_ERROR,
        CIC_RP_IQ_ERROR: count_22[0].CIC_RP_IQ_ERROR,
        CIC_RQ_RS_IQ_ERROR: count_23[0].CIC_RQ_RS_IQ_ERROR,
        SCRAP_TG_RP_NOT_EXIST: count_24[0].SCRAP_TG_RP_NOT_EXIST,
        OTHER_ERROR: count_29[0].OTHER_ERROR,
        DATE: e
      }
      await result.push(object);
    }
    return res.status(200).send(result);
  } else {
    return res.status(204).send([]);
  }
}
