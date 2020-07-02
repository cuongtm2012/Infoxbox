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
  // get All day between 2 date
  let d1 = new Date(fromDate);
  let d2 = new Date(toDate);

  let arrAllDay = [];
  let currentDate = moment(d1);
  let stopDate = moment(d2);
  while (currentDate <= stopDate) {
    await arrAllDay.push( moment(currentDate).format('YYYYMMDD') )
    currentDate = moment(currentDate).add(1, 'days');
  }
  if (arrAllDay.length > 32) {
   return res.status(501).send({notify:'Maximum number of displayed days no more than 31 days'});
  }
  //checking
  if (arrAllDay[0]) {
   let SQL =  `(SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) AS COUNT FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '10')  
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD)  FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '00')
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD)  FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '01') 
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '02')  
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD)  FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '03')
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '04')  
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD)  FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '20')
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD)  FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '21') 
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD)  FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '22')
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD)  FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '23') 
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '24')
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD)  FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '29')`
    for (const e of arrAllDay) {
      let param = {
        INQ_DTIM: e
      }
      let count = await oracelService.queryAndReturnData(res,SQL,param,optionFormatObj);
      let object = {
        COMPLETED: count[0].COUNT,
        SMS: count[1].COUNT,
        RP_IQ_RQ_OK: count[2].COUNT,
        CIC_LOGIN_OK: count[3].COUNT,
        CIC_ID_IQ_OK: count[4].COUNT,
        CIC_RP_IQ_OK: count[5].COUNT,
        LOGIN_ERROR: count[6].COUNT,
        CIC_ID_IQ_ERROR: count[7].COUNT,
        CIC_RP_IQ_ERROR: count[8].COUNT,
        CIC_RQ_RS_IQ_ERROR: count[9].COUNT,
        SCRAP_TG_RP_NOT_EXIST: count[10].COUNT,
        OTHER_ERROR: count[11].COUNT,
        DATE: e
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
  let fromDate = req.query.fromDate;
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
      d1.setMonth(d1.getMonth());
    else
      d1.setMonth(d1.getMonth() + 1);

    arrAllMonth[i] = moment(d1).format("YYYYMM");
  }
  //checking
  if (arrAllMonth[0]) {
    let SQL =
        `(SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) AS COUNT FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '10')  
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD)  FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '00')
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD)  FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '01') 
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '02')  
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD)  FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '03')
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '04')  
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD)  FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '20')
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD)  FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '21') 
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD)  FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '22')
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD)  FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '23') 
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '24')
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD)  FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '29')`
    for (const e of arrAllMonth) {
      let param = {
        INQ_DTIM: e + '%',
      }
      let count = await oracelService.queryAndReturnData(res, SQL, param, optionFormatObj);
      let object = {
        COMPLETED: count[0].COUNT,
        SMS: count[1].COUNT,
        RP_IQ_RQ_OK: count[2].COUNT,
        CIC_LOGIN_OK: count[3].COUNT,
        CIC_ID_IQ_OK: count[4].COUNT,
        CIC_RP_IQ_OK: count[5].COUNT,
        LOGIN_ERROR: count[6].COUNT,
        CIC_ID_IQ_ERROR: count[7].COUNT,
        CIC_RP_IQ_ERROR: count[8].COUNT,
        CIC_RQ_RS_IQ_ERROR: count[9].COUNT,
        SCRAP_TG_RP_NOT_EXIST: count[10].COUNT,
        OTHER_ERROR: count[11].COUNT,
        DATE: e
      }
      await result.push(object);
      console.log(count);
    }
    return res.status(200).send(result);
  } else {
    return res.status(204).send([]);
  }
}

exports.getDataYear = async function (req, res) {
  let fromDate = req.query.fromDate;
  let toDate = req.query.toDate;
  let result = [];

  // get year by 2 date
  let d1 = new Date(fromDate);
  let d2 = new Date(toDate);

  let ydiff = d2.getYear() - d1.getYear();
  let mdiff = d2.getMonth() - d1.getMonth();

  let diff = (ydiff * 12 + mdiff);
  let arrYear = []
  for (i = 0; i <= diff; i++) {
    if (i == 0)
      d1.setMonth(d1.getMonth());
    else
      d1.setMonth(d1.getMonth() + 1);

    arrYear[i] = moment(d1).format("YYYY");
  }
  // filter year unique
  let uniqueYear = arrYear.filter(function(elem, index, self) {
    return index === self.indexOf(elem);
  })
  //checking
  if (uniqueYear[0]) {
    let SQL =
        `(SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) AS COUNT FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '10')  
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD)  FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '00')
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD)  FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '01') 
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '02')  
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD)  FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '03')
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '04')  
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD)  FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '20')
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD)  FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '21') 
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD)  FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '22')
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD)  FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '23') 
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '24')
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD)  FROM TB_SCRPLOG WHERE TB_SCRPLOG.INQ_DTIM LIKE :INQ_DTIM AND TB_SCRPLOG.SCRP_STAT_CD = '29')`
    for (const e of uniqueYear) {
      let param = {
        INQ_DTIM:  e + '%',
      }
      let count= await oracelService.queryAndReturnData(res, SQL, param, optionFormatObj);
      let object = {
        COMPLETED: count[0].COUNT,
        SMS: count[1].COUNT,
        RP_IQ_RQ_OK: count[2].COUNT,
        CIC_LOGIN_OK: count[3].COUNT,
        CIC_ID_IQ_OK: count[4].COUNT,
        CIC_RP_IQ_OK: count[5].COUNT,
        LOGIN_ERROR: count[6].COUNT,
        CIC_ID_IQ_ERROR: count[7].COUNT,
        CIC_RP_IQ_ERROR: count[8].COUNT,
        CIC_RQ_RS_IQ_ERROR: count[9].COUNT,
        SCRAP_TG_RP_NOT_EXIST: count[10].COUNT,
        OTHER_ERROR: count[11].COUNT,
        DATE: e
      }
      await result.push(object);
    }
    return res.status(200).send(result);
  } else {
    return res.status(204).send([]);
  }
}

exports.getDataWeek = async function (req,res) {
  let fromDate = req.query.fromDate;
  let toDate = req.query.toDate;
  let result = [];

  Date.prototype.getWeek = function() {
    let onejan = new Date(this.getFullYear(),0,1);
    return Math.ceil((((this - onejan) / 86400000) + onejan.getDay()+1)/7);
  }

  let date = new Date(fromDate);
  let weekNumber = date.getWeek();
  let startDateOfWeek = moment(date).startOf('week');
  let endDateOfWeek = moment(date).endOf('week');
  let firstDayOfWeek = moment(startDateOfWeek).format('YYYYMMDD');
  let lastDayOfWeek =moment(endDateOfWeek).format('YYYYMMDD');
  console.log(weekNumber,firstDayOfWeek,lastDayOfWeek); // Returns the week number as an integer

  if(firstDayOfWeek && lastDayOfWeek) {
    let SQL =
        `(SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) AS COUNT FROM TB_SCRPLOG WHERE to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:firstDayOfWeek, 'YYYY/MM/DD') AND to_date(:lastDayOfWeek, 'YYYY/MM/DD') AND TB_SCRPLOG.SCRP_STAT_CD = '10')  
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD)  FROM TB_SCRPLOG WHERE  to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:firstDayOfWeek, 'YYYY/MM/DD') AND to_date(:lastDayOfWeek, 'YYYY/MM/DD') AND TB_SCRPLOG.SCRP_STAT_CD = '00')
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD)  FROM TB_SCRPLOG WHERE  to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:firstDayOfWeek, 'YYYY/MM/DD') AND to_date(:lastDayOfWeek, 'YYYY/MM/DD')  AND TB_SCRPLOG.SCRP_STAT_CD = '01') 
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) FROM TB_SCRPLOG WHERE  to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:firstDayOfWeek, 'YYYY/MM/DD') AND to_date(:lastDayOfWeek, 'YYYY/MM/DD') AND TB_SCRPLOG.SCRP_STAT_CD = '02')  
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD)  FROM TB_SCRPLOG WHERE  to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:firstDayOfWeek, 'YYYY/MM/DD') AND to_date(:lastDayOfWeek, 'YYYY/MM/DD')  AND TB_SCRPLOG.SCRP_STAT_CD = '03')
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) FROM TB_SCRPLOG WHERE  to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:firstDayOfWeek, 'YYYY/MM/DD') AND to_date(:lastDayOfWeek, 'YYYY/MM/DD')  AND TB_SCRPLOG.SCRP_STAT_CD = '04')  
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD)  FROM TB_SCRPLOG WHERE  to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:firstDayOfWeek, 'YYYY/MM/DD') AND to_date(:lastDayOfWeek, 'YYYY/MM/DD')  AND TB_SCRPLOG.SCRP_STAT_CD = '20')
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD)  FROM TB_SCRPLOG WHERE  to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:firstDayOfWeek, 'YYYY/MM/DD') AND to_date(:lastDayOfWeek, 'YYYY/MM/DD')  AND TB_SCRPLOG.SCRP_STAT_CD = '21') 
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD)  FROM TB_SCRPLOG WHERE  to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:firstDayOfWeek, 'YYYY/MM/DD') AND to_date(:lastDayOfWeek, 'YYYY/MM/DD')  AND TB_SCRPLOG.SCRP_STAT_CD = '22')
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD)  FROM TB_SCRPLOG WHERE  to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:firstDayOfWeek, 'YYYY/MM/DD') AND to_date(:lastDayOfWeek, 'YYYY/MM/DD') AND TB_SCRPLOG.SCRP_STAT_CD = '23') 
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD) FROM TB_SCRPLOG WHERE  to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:firstDayOfWeek, 'YYYY/MM/DD') AND to_date(:lastDayOfWeek, 'YYYY/MM/DD')  AND TB_SCRPLOG.SCRP_STAT_CD = '24')
          UNION ALL
          (SELECT COUNT (TB_SCRPLOG.SCRP_STAT_CD)  FROM TB_SCRPLOG WHERE to_date(TB_SCRPLOG.INQ_DTIM, 'YYYY/MM/DD') BETWEEN to_date(:firstDayOfWeek, 'YYYY/MM/DD') AND to_date(:lastDayOfWeek, 'YYYY/MM/DD')  AND TB_SCRPLOG.SCRP_STAT_CD = '29')`
      let param = {
        firstDayOfWeek,
        lastDayOfWeek
      }
      let count = await oracelService.queryAndReturnData(res, SQL, param, optionFormatObj);
      let object = {
        COMPLETED: count[0].COUNT,
        SMS: count[1].COUNT,
        RP_IQ_RQ_OK: count[2].COUNT,
        CIC_LOGIN_OK: count[3].COUNT,
        CIC_ID_IQ_OK: count[4].COUNT,
        CIC_RP_IQ_OK: count[5].COUNT,
        LOGIN_ERROR: count[6].COUNT,
        CIC_ID_IQ_ERROR: count[7].COUNT,
        CIC_RP_IQ_ERROR: count[8].COUNT,
        CIC_RQ_RS_IQ_ERROR: count[9].COUNT,
        SCRAP_TG_RP_NOT_EXIST: count[10].COUNT,
        OTHER_ERROR: count[11].COUNT,
        DATE: weekNumber
      }
      await result.push(object);
    return res.status(200).send(result);
  } else {
    return res.status(204).send([]);
  }
}
