const oracledb = require('oracledb');
const oracelService = require('../services/oracelQuery.service');
var _ = require('lodash');

const optionFormatObj = { outFormat: oracledb.OUT_FORMAT_OBJECT };
const optionAutoCommit = { autoCommit: true }; ''

exports.getCodeClassification = async function (req, res) {
    var codeClassification = _.isEmpty(req.query.codeClassification) ? '' : req.query.codeClassification;
    var codeClassificationName = _.isEmpty(req.query.codeClassificationName) ? '' : req.query.codeClassificationName;
    var SQL_SELECT = `SELECT CD_CLASS, CODE_NM, CODE_NM_EN `;
    var SQL_FROM = 'FROM TB_ITCODE ';
    if (_.isEmpty(codeClassification) && _.isEmpty(codeClassificationName)) {
        let sql = SQL_SELECT + SQL_FROM;
        let params = {};
        oracelService.queryOracel(res, sql, params, optionFormatObj);
    }
    if ((codeClassification) && (codeClassificationName)) {
        let SEARCH = 'WHERE CD_CLASS = :codeClassification AND CODE_NM = :codeClassificationName';
        let sql = SQL_SELECT + SQL_FROM + SEARCH;
        let params = {
            codeClassification,
            codeClassificationName
        };
        oracelService.queryOracel(res, sql, params, optionFormatObj);
    }
    if ((codeClassification) && _.isEmpty(codeClassificationName)) {
        let SEARCH = 'WHERE CD_CLASS = :codeClassification ';
        let sql = SQL_SELECT + SQL_FROM + SEARCH;
        let params = {
            codeClassification
        };
        oracelService.queryOracel(res, sql, params, optionFormatObj);
    }
    if ((codeClassification) && _.isEmpty(codeClassificationName)) {
        let SEARCH = 'WHERE CODE_NM = :codeClassificationName ';
        let sql = SQL_SELECT + SQL_FROM + SEARCH;
        let params = {
            codeClassificationName
        };
        oracelService.queryOracel(res, sql, params, optionFormatObj);
    }
};



exports.getCode = async function (req, res) {
    var code = _.isEmpty(req.query.code) ? '' : req.query.code;
    var codeClass = _.isEmpty(req.query.codeClass) ? '' : req.query.codeClass;
    var codeNm = _.isEmpty(req.query.codeNm) ? '' : req.query.codeNm;
    var currentLocation = req.query.currentLocation;
    var limitRow = req.query.limitRow;
    var SQL_SELECT = `SELECT TB_ITCODE.CODE as CODE, 
    TB_ITCODE.CD_CLASS as CD_CLASS, 
    TB_ITCODE.CODE_NM as CODENM, 
    TB_ITCODE.CODE_NM_EN as CODENM_EN, 
    TB_ITCODE.PRT_CD_CLASS as PRT_CD_CLASS, 
    TB_ITCODE.PRT_CODE as PRT_CODE, 
    to_char(to_date(SYS_DTIM, 'YYYY/MM/DD HH24:MI:SS'),'yyyy/mm/dd hh24:mi:ss') as SYS_DTIM, 
    WORK_ID as WORK_ID, 
    to_char(to_date(VALID_START_DT, 'yyyymmdd'),'yyyy/mm/dd') AS VALID_START_DT,
    to_char(to_date(VALID_END_DT, 'yyyymmdd'),'yyyy/mm/dd') AS VALID_END_DT `;
    var SQL_FROM = `FROM TB_ITCODE `;
    var SQL_ORDER_BY = 'ORDER BY CODE_NM ';
    var SQL_LIMIT = 'OFFSET :currentLocation ROWS FETCH NEXT :limitRow ROWS ONLY ';
    if (_.isEmpty(code) && _.isEmpty(codeClass) && _.isEmpty(codeNm)) {
        let sql = SQL_SELECT + SQL_FROM + SQL_ORDER_BY + SQL_LIMIT;
        let params = {
            currentLocation,
            limitRow
        };
        oracelService.queryOracel(res, sql, params, optionFormatObj)
    }

    if ((code) && (codeClass) && (codeNm)) {
        var SQL_SEARCH = `WHERE TB_ITCODE.CD_CLASS LIKE :codeClass AND TB_ITCODE.CODE_NM LIKE :codeNm AND TB_ITCODE.CODE LIKE :code `;
        let sql = SQL_SELECT + SQL_FROM + SQL_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let params = {
            code,
            codeClass,
            codeNm,
            currentLocation,
            limitRow
        };
        oracelService.queryOracel(res, sql, params, optionFormatObj)
    }

    if (_.isEmpty(code) && (codeClass) && _.isEmpty(codeNm)) {
        var SQL_SEARCH = `WHERE TB_ITCODE.CD_CLASS LIKE :codeClass  `;
        let sql = SQL_SELECT + SQL_FROM + SQL_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let params = {
            codeClass,
            currentLocation,
            limitRow
        };
        oracelService.queryOracel(res, sql, params, optionFormatObj)
    }

    if ((code) && _.isEmpty(codeClass) && _.isEmpty(codeNm)) {
        var SQL_SEARCH = `WHERE TB_ITCODE.CODE LIKE :code  `;
        let sql = SQL_SELECT + SQL_FROM + SQL_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let params = {
            code,
            currentLocation,
            limitRow
        };
        oracelService.queryOracel(res, sql, params, optionFormatObj)
    }

    if (_.isEmpty(code) && _.isEmpty(codeClass) && (codeNm)) {
        var SQL_SEARCH = `WHERE TB_ITCODE.CODE_NM LIKE :codeNm  `;
        let sql = SQL_SELECT + SQL_FROM + SQL_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let params = {
            codeNm,
            currentLocation,
            limitRow
        };
        oracelService.queryOracel(res, sql, params, optionFormatObj)
    }

    if ((code) && (codeClass) && _.isEmpty(codeNm)) {
        var SQL_SEARCH = `WHERE TB_ITCODE.CD_CLASS LIKE :codeClass AND TB_ITCODE.CODE LIKE :code `;
        let sql = SQL_SELECT + SQL_FROM + SQL_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let params = {
            codeClass,
            code,
            currentLocation,
            limitRow
        };
        oracelService.queryOracel(res, sql, params, optionFormatObj)
    }

    if (_.isEmpty(code) && (codeClass) && (codeNm)) {
        var SQL_SEARCH = `WHERE TB_ITCODE.CD_CLASS LIKE :codeClass AND TB_ITCODE.CODE_NM LIKE :codeNm `;
        let sql = SQL_SELECT + SQL_FROM + SQL_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let params = {
            codeClass,
            codeNm,
            currentLocation,
            limitRow
        };
        oracelService.queryOracel(res, sql, params, optionFormatObj)
    }

    if ((code) && _.isEmpty(codeClass) && (codeNm)) {
        var SQL_SEARCH = `WHERE TB_ITCODE.CODE LIKE :code AND TB_ITCODE.CODE_NM LIKE :codeNm `;
        let sql = SQL_SELECT + SQL_FROM + SQL_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let params = {
            code,
            codeNm,
            currentLocation,
            limitRow
        };
        oracelService.queryOracel(res, sql, params, optionFormatObj)
    }
};

exports.insertCode = async function (req, res) {
    var code = req.body.code;
    var codeClass = req.body.codeClass;
    var validStartDt = (_.isEmpty(req.body.validStartDt) ? null : req.body.validStartDt.replace(/[^0-9 ]/g, ""));
    var validEndDt = (_.isEmpty(req.body.validEndDt) ? null : req.body.validEndDt.replace(/[^0-9 ]/g, ""));
    var codeNm = _.isEmpty(req.body.codeNm) ? '' : req.body.codeNm;
    var codeNmEn = _.isEmpty(req.body.codeNmEn) ? '' : req.body.codeNmEn;
    var prtCdClass = _.isEmpty(req.body.prtCdClass) ? '' : req.body.prtCdClass;
    var prtCd = _.isEmpty(req.body.prtCd) ? '' : req.body.prtCd;
    var sysDt = req.body.sysDt.replace(/[^0-9 ]/g, "");
    var workID = _.isEmpty(req.body.workID) ? '' : req.body.workID;

    var SQL = 'INSERT INTO TB_ITCODE (CODE, CD_CLASS, VALID_START_DT, VALID_END_DT, CODE_NM, CODE_NM_EN, PRT_CD_CLASS, PRT_CODE, SYS_DTIM, WORK_ID) VALUES (:code, :codeClass, :validStartDt, :validEndDt, :codeNm, :codeNmEn, :prtCdClass, :prtCd, :sysDt, :workID)';
    let params = {
        code: { val: code },
        codeClass: { val: codeClass },
        validStartDt: { val: validStartDt },
        validEndDt: { val: validEndDt },
        codeNm: { val: codeNm },
        codeNmEn: { val: codeNmEn },
        prtCdClass: { val: prtCdClass },
        prtCd: { val: prtCd },
        sysDt: { val: sysDt },
        workID: { val: workID }
    };
    oracelService.queryOracel(res, SQL, params, optionAutoCommit)
};


exports.editCode = async function (req, res) {
    var code = req.body.code;
    var codeClass = req.body.codeClass;
    var validStartDt = (_.isEmpty(req.body.validStartDt) ? null : req.body.validStartDt.replace(/[^0-9 ]/g, ""));
    var validEndDt = (_.isEmpty(req.body.validEndDt) ? null : req.body.validEndDt.replace(/[^0-9 ]/g, ""));
    var codeNm = req.body.codeNm;
    var codeNmEn = req.body.codeNmEn;
    var prtCdClass = req.body.prtCdClass;
    var prtCd = req.body.prtCd;

    var SQL = 'UPDATE TB_ITCODE SET  CODE_NM = :codeNm, CODE_NM_EN = :codeNmEn, PRT_CD_CLASS = :prtCdClass, PRT_CODE = :prtCd WHERE CODE = :code AND CD_CLASS = :codeClass AND VALID_START_DT = :validStartDt AND VALID_END_DT = :validEndDt ';
    let params = {
        code: { val: code },
        codeClass: { val: codeClass },
        validStartDt: { val: validStartDt },
        validEndDt: { val: validEndDt },
        codeNm: { val: codeNm },
        codeNmEn: { val: codeNmEn },
        prtCdClass: { val: prtCdClass },
        prtCd: { val: prtCd },
    };
    oracelService.queryOracel(res, SQL, params, optionAutoCommit)
};
