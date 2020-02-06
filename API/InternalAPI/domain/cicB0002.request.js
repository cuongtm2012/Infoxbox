

module.exports = function cicB0002Request(parameters, defaultValue, decryptPW) {
    const {
        NICE_SSIN_ID,
        CIC_ID,
        LOGIN_ID,
        LOGIN_PW,
        PSPT_NO,
        TAX_ID,
        NATL_ID,
        OLD_NATL_ID,
        SYS_DTIM
    } = parameters;

    const {
        appCd,
        iftUrl,
        dispNm,
        customerType,
        reportType,
        voteNo,
        reqStatus,
        inqDt1,
        inqDt2,
        step_input,
        step_data
    } = defaultValue;

    const natId = NATL_ID ? NATL_ID : OLD_NATL_ID;

    this.appCd = appCd;
    this.iftUrl = iftUrl;
    this.svcCd = 'B0002';
    this.dispNm = dispNm;
    this.userId = LOGIN_ID;
    this.userPw = decryptPW ? decryptPW : LOGIN_PW;
    this.customerType = customerType;
    this.cicNo = CIC_ID ? CIC_ID : "";
    this.taxNo = TAX_ID ? TAX_ID : "";
    this.cmtNo = natId ? natId : PSPT_NO;
    this.reportType = reportType;
    this.voteNo = voteNo;
    this.reqStatus = reqStatus;
    this.inqDt1 = inqDt1;
    this.inqDt2 = inqDt2;
    this.step_input = step_input;
    this.step_data = step_data;
    this.niceSessionKey = NICE_SSIN_ID;
    this.sendTime = SYS_DTIM;

};
