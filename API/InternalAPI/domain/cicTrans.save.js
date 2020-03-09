const dateutil = require('../util/dateutil');

module.exports = function cicTransSave(requestParams, responseParams, scrplogid, workId, password, cicNos, niceSessionKey) {
    const {
        svcCd,
        userId,
        userPw,
        customerType,
        cmtNo,
        taxNo,
        reportType,
        voteNo,
        reqStatus,
        inqDt1,
        inqDt2,
        step_input,
        step_data,
        sendTime

    } = requestParams;

    const {
        cicNo,
        errYn,
        errMsg,
        recStepImg,
        recStepData
    } = responseParams;

    this.SCRP_LOG_ID = scrplogid;
    this.NICE_SSIN_ID = niceSessionKey;
    this.S_SVC_CD = svcCd ? svcCd : null;
    this.S_USER_ID = userId ? userId : null;
    this.S_USER_PW = password ? password : null;
    this.S_CUSTOMER_TYPE = customerType ? customerType : null;
    this.S_CIC_NO = cicNo ? cicNo : cicNos;
    this.S_TAX_NO = taxNo ? taxNo : null;
    this.S_CMT_NO = cmtNo ? cmtNo : null;
    this.S_REPORT_TYPE = reportType ? reportType : null;
    this.S_VOTE_NO = voteNo ? voteNo : null;
    this.S_REQ_STATUS = reqStatus ? reqStatus : null;
    this.S_INQ_DT1 = inqDt1 ? inqDt1 : null;
    this.S_INQ_DT2 = inqDt2 ? inqDt2 : null;
    this.S_STEP_INPUT = step_input ? step_input : null;
    this.S_STEP_DATA = step_data ? step_data : null;
    this.S_DTIM = sendTime ? sendTime : dateutil.timeStamp();
    this.R_ERRYN = errYn ? errYn : null;
    this.R_ERRMSG = errMsg ? errMsg : null;
    this.R_STEP_IMG = recStepImg ? recStepImg : null;
    this.R_STEP_DATA = recStepData ? recStepData : null;
    this.R_DTIM = dateutil.timeStamp();
    this.WORK_ID = workId ? workId : null;
}