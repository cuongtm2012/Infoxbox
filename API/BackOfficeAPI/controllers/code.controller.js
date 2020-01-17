const oracledb = require('oracledb');
const oracelService = require('../services/oracelQuery.service');
var _ = require('lodash');

const optionFormatObj = { outFormat: oracledb.OUT_FORMAT_OBJECT };
const optionAutoCommit = { autoCommit: true };


exports.getCode = async function (req, res) {
    var code = req.query.code;
    var codeClass = req.query.codeClass;
    var codeNm = req.query.codeNm;

    var SQL_SELECT = `SELECT TB_ITCODE.CODE as CODE, TB_ITCODE.CD_CLASS as CD_CLASS, TB_ITCODE.CODE_NM as CODENM, TB_ITCODE.CODE_NM_EN as CODENM_EN, TB_ITCODE.VALID_START_DT as VALID_START_DT, TB_ITCODE.VALID_END_DT as VALID_END_DT `;
    var SQL_FROM = `FROM TB_ITCODE `;
    var SQL_SEARCH_CODE = `WHERE TB_ITCODE.CD_CLASS LIKE :codeClass AND TB_ITCODE.CODE_NM LIKE :codeNm `;
    var SQL_SEARCH_ALL = `WHERE TB_ITCODE.CD_CLASS LIKE :codeClass AND TB_ITCODE.CODE_NM LIKE :codeNm AND TB_ITCODE.CODE LIKE :code `;
    if (_.isEmpty(code) && _.isEmpty(codeClass) && _.isEmpty(codeNm)) {
        let sql = SQL_SELECT + SQL_FROM;
        let params = {};
        oracelService.queryOracel(res, sql, params, optionFormatObj)
    } else if (_.isEmpty(code) && !_.isEmpty(codeClass) && !_.isEmpty(codeNm)) {
        let sql = SQL_SELECT + SQL_FROM + SQL_SEARCH_CODE;
        let params = {
            codeClass: { val: codeClass },
            codeNm: { val: codeNm }
        };
        oracelService.queryOracel(res, sql, params, optionFormatObj)
    } else {
        let sql = SQL_SELECT + SQL_FROM + SQL_SEARCH_ALL;
        let params = {
            code: { val: code },
            codeClass: { val: codeClass },
            codeNm: { val: codeNm }
        };
        oracelService.queryOracel(res, sql, params, optionFormatObj)
    }
};

exports.insertCode = async function (req, res) {
    var code = req.body.code;
    var codeClass = req.body.codeClass;
    var valid_start_dt = req.body.valid_start_dt;
    var valid_end_dt = req.body.valid_end_dt;
    var codeNm = req.body.codeNm;
    var codeNmEn = req.body.codeNmEn;
    var prtCdClass = req.body.prtCdClass;
    var prtCd = req.body.prtCd;
    var sysDt = req.body.sysDt;
    var workID = req.body.workID;

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
    var valid_start_dt = req.body.valid_start_dt;
    var valid_end_dt = req.body.valid_end_dt;
    var codeNm = req.body.codeNm;
    var codeNmEn = req.body.codeNmEn;
    var prtCdClass = req.body.prtCdClass;
    var prtCd = req.body.prtCd;
    var sysDt = req.body.sysDt;
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
