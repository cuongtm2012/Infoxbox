const dateutil = require('../util/dateutil');


module.exports = function cicB0003Request(listCicNo, listNiceSession, data, defaultValue, loginUser, decryptPW) {
    const {
        appCd,
        iftUrl,
        orgCd,
        dispNm,
        customerType,
        reportType,
        voteNo,
        reqStatus,
        inqDt1,
        inqDt2,
        step_input,
        step_data,
        userId,
        userPw
    } = defaultValue;

    this.appCd = appCd;
    this.iftUrl = iftUrl;
    this.orgCd = orgCd;
    this.svcCd = 'B0003';
    this.dispNm = dispNm;
    this.userId = loginUser ? loginUser : userId;
    this.userPw = decryptPW ? decryptPW : userPw;
    this.customerType = customerType;
    this.cicNo = '';
    this.taxNo = '';
    this.cmtNo = '';
    this.reportType = reportType;
    this.voteNo = voteNo;
    this.reqStatus = reqStatus;
    this.inqDt1 = inqDt1;
    this.inqDt2 = inqDt2;
    this.step_input = step_input;
    this.step_data = step_data;
    this.sendTime = dateutil.timeStamp();
    this.reportCicNo = listCicNo ? listCicNo : "";
    this.niceSessionKey = listNiceSession ? listNiceSession : "";
    this.dataCic = data;

};
