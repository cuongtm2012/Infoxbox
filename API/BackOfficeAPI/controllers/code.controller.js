const oracledb = require('oracledb');
const dateFormat = require('dateformat');
const oracelService = require('../services/oracelQuery.service');
var _ = require('lodash');

const optionFormatObj = { outFormat: oracledb.OUT_FORMAT_OBJECT };
const optionAutoCommit = { autoCommit: true }; ''

exports.getCodeClassification = async function (req, res) {
    var codeClassification = req.query.codeClassification ? '%' + req.query.codeClassification + '%' : '';
    var codeClassificationName = req.query.codeClassificationName ? '%' + req.query.codeClassificationName + '%' : '';
    var currentLocation = req.query.currentLocation;
    var limitRow = req.query.limitRow;
    var SQL_SELECT = `SELECT CD_CLASS, CODE_NM, CODE_NM_EN , CODE `;
    var SQL_SELECT_COUNT = `SELECT COUNT(*) AS total `;
    var SQL_FROM = 'FROM TB_ITCODE ';
    var SQL_LIMIT = 'OFFSET :currentLocation ROWS FETCH NEXT :limitRow ROWS ONLY ';
    if (_.isEmpty(codeClassification) && _.isEmpty(codeClassificationName)) {
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
    if ((codeClassification) && (codeClassificationName)) {
        let SEARCH = 'WHERE LOWER(CD_CLASS) LIKE LOWER(:codeClassification) AND LOWER(CODE_NM) LIKE LOWER(:codeClassificationName) ';
        let sql = SQL_SELECT + SQL_FROM + SEARCH + SQL_LIMIT;
        let param = {
            codeClassification,
            codeClassificationName,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SEARCH ;
        let paramSearch = {
            codeClassification,
            codeClassificationName};
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if ((codeClassification) && _.isEmpty(codeClassificationName)) {
        let SEARCH = 'WHERE LOWER(CD_CLASS) LIKE LOWER(:codeClassification) ';
        let sql = SQL_SELECT + SQL_FROM + SEARCH + SQL_LIMIT;
        let param = {
            codeClassification,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SEARCH ;
        let paramSearch = {codeClassification,};
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
    if (_.isEmpty(codeClassification) && (codeClassificationName)) {
        let SEARCH = 'WHERE LOWER(CODE_NM) LIKE LOWER(:codeClassificationName) ';
        let sql = SQL_SELECT + SQL_FROM + SEARCH + SQL_LIMIT;
        let param = {
            codeClassificationName,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SEARCH ;
        let paramSearch = {codeClassificationName,};
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }
};



exports.getCode = async function (req, res) {
    var code =  req.query.code ? '%' + req.query.code + '%': '';
    var codeClass = req.query.codeClass ? '%' + req.query.codeClass + '%': '';
    var codeNm = req.query.codeNm ? '%' + req.query.codeNm + '%' : '';
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
    var SQL_SELECT_COUNT = `SELECT COUNT(*) AS total `;
    var SQL_FROM = `FROM TB_ITCODE `;
    var SQL_ORDER_BY = 'ORDER BY CODE_NM ';
    var SQL_LIMIT = 'OFFSET :currentLocation ROWS FETCH NEXT :limitRow ROWS ONLY ';
    if (_.isEmpty(code) && _.isEmpty(codeClass) && _.isEmpty(codeNm)) {
        let sql = SQL_SELECT + SQL_FROM + SQL_ORDER_BY + SQL_LIMIT;
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

    if ((code) && (codeClass) && (codeNm)) {
        var SQL_SEARCH = `WHERE LOWER(TB_ITCODE.CD_CLASS) LIKE LOWER(:codeClass) AND LOWER(TB_ITCODE.CODE_NM) LIKE LOWER(:codeNm) AND LOWER(TB_ITCODE.CODE) LIKE LOWER(:code) `;
        let sql = SQL_SELECT + SQL_FROM + SQL_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            code,
            codeClass,
            codeNm,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_SEARCH;
        let paramSearch = {
            code,
            codeClass,
            codeNm,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if (_.isEmpty(code) && (codeClass) && _.isEmpty(codeNm)) {
        var SQL_SEARCH = `WHERE LOWER(TB_ITCODE.CD_CLASS) LIKE LOWER(:codeClass)  `;
        let sql = SQL_SELECT + SQL_FROM + SQL_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            codeClass,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_SEARCH;
        let paramSearch = {
            codeClass,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if ((code) && _.isEmpty(codeClass) && _.isEmpty(codeNm)) {
        var SQL_SEARCH = `WHERE LOWER(TB_ITCODE.CODE) LIKE LOWER(:code)  `;
        let sql = SQL_SELECT + SQL_FROM + SQL_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            code,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_SEARCH;
        let paramSearch = {
            code,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if (_.isEmpty(code) && _.isEmpty(codeClass) && (codeNm)) {
        var SQL_SEARCH = `WHERE LOWER(TB_ITCODE.CODE_NM) LIKE LOWER(:codeNm)  `;
        let sql = SQL_SELECT + SQL_FROM + SQL_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            codeNm,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_SEARCH;
        let paramSearch = {
            codeNm,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if ((code) && (codeClass) && _.isEmpty(codeNm)) {
        var SQL_SEARCH = `WHERE LOWER(TB_ITCODE.CD_CLASS) LIKE LOWER(:codeClass) AND LOWER(TB_ITCODE.CODE) LIKE LOWER(:code) `;
        let sql = SQL_SELECT + SQL_FROM + SQL_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            codeClass,
            code,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_SEARCH;
        let paramSearch = {
            codeClass,
            code,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if (_.isEmpty(code) && (codeClass) && (codeNm)) {
        var SQL_SEARCH = `WHERE LOWER(TB_ITCODE.CD_CLASS) LIKE LOWER(:codeClass) AND LOWER(TB_ITCODE.CODE_NM) LIKE LOWER(:codeNm) `;
        let sql = SQL_SELECT + SQL_FROM + SQL_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            codeClass,
            codeNm,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_SEARCH;
        let paramSearch = {
            codeClass,
            codeNm,
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
    }

    if ((code) && _.isEmpty(codeClass) && (codeNm)) {
        var SQL_SEARCH = `WHERE LOWER(TB_ITCODE.CODE) LIKE LOWER(:code) AND LOWER(TB_ITCODE.CODE_NM) LIKE LOWER(:codeNm) `;
        let sql = SQL_SELECT + SQL_FROM + SQL_SEARCH + SQL_ORDER_BY + SQL_LIMIT;
        let param = {
            code,
            codeNm,
            currentLocation,
            limitRow
        };
        let sqlSearch = SQL_SELECT_COUNT + SQL_FROM + SQL_SEARCH;
        let paramSearch = {
            code,
            codeNm
        };
        let totalRow;
        let rowRs;

        totalRow = await oracelService.queryGetTotalRow(res, sqlSearch, paramSearch, optionFormatObj);
        rowRs = await oracelService.queryGetTotalRow(res, sql, param, optionFormatObj);
        return res.status(200).send({count: totalRow, rowRs: rowRs});
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
    var sysDt = dateFormat(new Date(), "yyyymmddHHMMss");
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
    await oracelService.queryOracel(res, SQL, params, optionAutoCommit)
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
    var sysDt = dateFormat(new Date(), "yyyymmddHHMMss");

    var SQL = 'UPDATE TB_ITCODE SET  CODE_NM = :codeNm, SYS_DTIM =:sysDt , CODE_NM_EN = :codeNmEn, PRT_CD_CLASS = :prtCdClass, PRT_CODE = :prtCd WHERE CODE = :code AND CD_CLASS = :codeClass AND VALID_START_DT = :validStartDt AND VALID_END_DT = :validEndDt ';
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
    };
    await oracelService.queryOracel(res, SQL, params, optionAutoCommit)
};
