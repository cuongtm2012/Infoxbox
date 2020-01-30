const oracledb = require('oracledb');
const oracelService = require('../services/oracelQuery.service');
var _ = require('lodash');

const optionFormatObj = { outFormat: oracledb.OUT_FORMAT_OBJECT };
const optionAutoCommit = { autoCommit: true };''

exports.getCodeClassification = async function (req, res) {
    var code_classification = _.isEmpty(req.query.code_classification) ? '' : req.query.code_classification;
    var code_classification_name = _.isEmpty(req.query.code_classification_name) ? '' : req.query.code_classification_name;
    var SQL_SELECT = `SELECT CD_CLASS, CODE_NM, CODE_NM_EN `;
    var SQL_FROM = 'FROM TB_ITCODE ';
    var SEARCH = 'WHERE CD_CLASS = :code_classification AND CODE_NM = :code_classification_name';
    if (_.isEmpty(code_classification) && _.isEmpty(code_classification_name)) {
        let sql = SQL_SELECT + SQL_FROM;
        let params = {};
        oracelService.queryOracel(res, sql, params, optionFormatObj);
    } else {
        let sql = SQL_SELECT + SQL_FROM + SEARCH;
        let params = {
            code_classification: { val: code_classification },
            code_classification_name: { val: code_classification_name }
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
    to_date(SYS_DTIM, 'YYYY/MM/DD HH:MI:SS') as SYS_DTIM, 
    WORK_ID as WORK_ID, 
    to_char(to_date(VALID_START_DT, 'yyyymmdd'),'mm/dd/yyyy') AS VALID_START_DT,
    to_char(to_date(VALID_END_DT, 'yyyymmdd'),'mm/dd/yyyy') AS VALID_END_DT `;
    var SQL_FROM = `FROM TB_ITCODE `;
    var SQL_SEARCH_CODE = `WHERE TB_ITCODE.CD_CLASS LIKE :codeClass AND TB_ITCODE.CODE_NM LIKE :codeNm `;
    var SQL_SEARCH_ALL = `WHERE TB_ITCODE.CD_CLASS LIKE :codeClass AND TB_ITCODE.CODE_NM LIKE :codeNm AND TB_ITCODE.CODE LIKE :code `;
    var SQL_ORDER_BY = 'ORDER BY CODE_NM ';
    var SQL_LIMIT = 'OFFSET :currentLocation ROWS FETCH NEXT :limitRow ROWS ONLY ';
    if (_.isEmpty(code) && _.isEmpty(codeClass) && _.isEmpty(codeNm)) {
        let sql = SQL_SELECT + SQL_FROM + SQL_ORDER_BY + SQL_LIMIT;
        console.log(sql);
        let params = {
            currentLocation: { val: currentLocation },
            limitRow: { val: limitRow }
        };
        oracelService.queryOracel(res, sql, params, optionFormatObj);
    } else if (_.isEmpty(code) && !_.isEmpty(codeClass) && !_.isEmpty(codeNm)) {
        let sql = SQL_SELECT + SQL_FROM + SQL_SEARCH_CODE + SQL_ORDER_BY + SQL_LIMIT;
        let params = {
            codeClass: { val: codeClass },
            codeNm: { val: codeNm },
            currentLocation: { val: currentLocation },
            limitRow: { val: limitRow }
        };
        oracelService.queryOracel(res, sql, params, optionFormatObj)
    } else {
        let sql = SQL_SELECT + SQL_FROM + SQL_SEARCH_ALL + SQL_ORDER_BY + SQL_LIMIT;
        let params = {
            code: { val: code },
            codeClass: { val: codeClass },
            codeNm: { val: codeNm },
            currentLocation: { val: currentLocation },
            limitRow: { val: limitRow }
        };
        oracelService.queryOracel(res, sql, params, optionFormatObj)
    }
};

exports.insertCode = async function (req, res) {
    var code = req.body.code;
    var codeClass = req.body.codeClass;
    var valid_start_dt = (_.isEmpty(req.body.valid_start_dt) ? null : req.body.valid_start_dt.replace(/[^0-9 ]/g, ""));
    var valid_end_dt = (_.isEmpty(req.body.valid_end_dt) ? null : req.body.valid_end_dt.replace(/[^0-9 ]/g, ""));
    var codeNm = _.isEmpty(req.query.codeNm) ? '' : req.body.codeNm;
    var codeNmEn = _.isEmpty(req.query.codeNmEn) ? '' : req.body.codeNmEn;
    var prtCdClass = _.isEmpty(req.query.prtCdClass) ? '' : req.body.prtCdClass;
    var prtCd = _.isEmpty(req.query.prtCd) ? '' : req.body.prtCd;
    var sysDt = req.body.sysDt.replace(/[^0-9 ]/g, "");
    var workID = _.isEmpty(req.query.workID) ? '' : req.body.workID;

    var SQL = 'INSERT INTO TB_ITCODE (CODE, CD_CLASS, VALID_START_DT, VALID_END_DT, CODE_NM, CODE_NM_EN, PRT_CD_CLASS, PRT_CODE, SYS_DTIM, WORK_ID) VALUES (:code, :codeClass, :valid_start_dt, :valid_end_dt, :codeNm, :codeNmEn, :prtCdClass, :prtCd, :sysDt, :workID)';
    let params = {
        code: { val: code },
        codeClass: { val: codeClass },
        valid_start_dt: { val: valid_start_dt },
        valid_end_dt: { val: valid_end_dt },
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
    var valid_start_dt = (_.isEmpty(req.body.valid_start_dt) ? null : req.body.valid_start_dt.replace(/[^0-9 ]/g, ""));
    var valid_end_dt = (_.isEmpty(req.body.valid_end_dt) ? null : req.body.valid_end_dt.replace(/[^0-9 ]/g, ""));
    var codeNm = req.body.codeNm;
    var codeNmEn = req.body.codeNmEn;
    var prtCdClass = req.body.prtCdClass;
    var prtCd = req.body.prtCd;
    var sysDt = req.body.sysDt.replace(/[^0-9 ]/g, "");
    var workID = req.body.workID;

    var SQL = 'UPDATE TB_ITCODE SET  CODE_NM = :codeNm, CODE_NM_EN = :codeNmEn, PRT_CD_CLASS = :prtCdClass, PRT_CODE = :prtCd, SYS_DTIM = :sysDt, WORK_ID = :workID WHERE CODE = :code AND CD_CLASS = :codeClass AND VALID_START_DT = :valid_start_dt , VALID_END_DT = :valid_end_dt ';
    let params = {
        code: { val: code },
        codeClass: { val: codeClass },
        valid_start_dt: { val: valid_start_dt },
        valid_end_dt: { val: valid_end_dt },
        codeNm: { val: codeNm },
        codeNmEn: { val: codeNmEn },
        prtCdClass: { val: prtCdClass },
        prtCd: { val: prtCd },
        sysDt: { val: sysDt },
        workID: { val: workID }
    };
    oracelService.queryOracel(res, SQL, params, optionAutoCommit)
};
