const dateutil = require('../util/dateutil');
const getIdGetway = require('../../shared/util/getIPGateWay');

let workId = getIdGetway.getIPGateWay();

module.exports = function cicTransA0001Save(requestParams, dataReportSave, errMsg) {
    const {
        svcCd,
        userId,
        niceSessionKey
    } = requestParams;

    const {
        cicId,
        inquiryDate
    } = dataReportSave;

    let scrplogid = dateutil.getDate() + cicId;

    this.SCRP_LOG_ID = scrplogid;
    this.NICE_SSIN_ID = niceSessionKey;
    this.S_SVC_CD = svcCd ? svcCd : null;
    this.S_USER_ID = userId ? userId : null;
    this.S_USER_PW = null;
    this.S_CUSTOMER_TYPE = null;
    this.S_CIC_NO = cicId ? cicId : null;
    this.S_TAX_NO = null;
    this.S_CMT_NO = null;
    this.S_REPORT_TYPE = null;
    this.S_VOTE_NO = null;
    this.S_REQ_STATUS = null;
    this.S_INQ_DT1 = inquiryDate ? inquiryDate : null;
    this.S_INQ_DT2 = inquiryDate ? inquiryDate : null;
    this.S_STEP_INPUT = null;
    this.S_STEP_DATA = null;
    this.S_DTIM = dateutil.timeStamp();
    this.R_ERRYN = null;
    this.R_ERRMSG = errMsg ? errMsg : null;
    this.R_STEP_IMG = null;
    this.R_STEP_DATA = null;
    this.R_DTIM = dateutil.timeStamp();
    this.WORK_ID = workId ? workId : null;
}