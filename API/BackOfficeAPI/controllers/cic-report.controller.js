const oracledb = require('oracledb');
const oracelService = require('../services/oracelQuery.service');
var _ = require('lodash');

const optionFormatObj = { outFormat: oracledb.OUT_FORMAT_OBJECT };
const optionAutoCommit = { autoCommit: true };

exports.cicReportManagement = async function (req, res) {
    var organClass = _.isEmpty(req.query.organClass) ? '' : req.query.organClass;
    var organCode = _.isEmpty(req.query.organCode) ? '' : req.query.organCode;
    var productCode = _.isEmpty(req.query.productCode) ? '' : req.query.productCode;
    var organNm = _.isEmpty(req.query.organNm) ? '' : req.query.organNm;
    var cicNumber = _.isEmpty(req.query.cicNumber) ? '' : req.query.cicNumber;
    var inquiryDate = _.isEmpty(req.query.inquiryDate) ? '' : req.query.inquiryDate;
    var SQL_SELECT = `SELECT a.NICE_SSIN_ID, CUST_CD, PSN_NM, GDS_CD, `;
    var SQL_FROM = `FROM TB_SCRP_TRLOG a `;
    var INNER_JOIN = 'INNER JOIN TB_SCRPLOG b ON a.NICE_SSIN_ID  = b.NICE_SSIN_ID ';

    if (_.isEmpty(organClass) && _.isEmpty(organCode) && _.isEmpty(productCode)
        && _.isEmpty(organNm) && _.isEmpty(cicNumber) && _.isEmpty(inquiryDate)) {
    } else {

    }




};