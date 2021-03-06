

module.exports = function cicB0002Request(parameters, defaultValue, decryptPW, runTimeValue) {
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
        orgCd,
        dispNm,
        customerType,
        reportType,
        voteNo,
        reqStatus,
        inqDt1,
        inqDt2,
        step_useYn,
        step_input,
        step_data
    } = defaultValue;

    const {
        totalCount,
        trycount,
        cmtNo
    } = runTimeValue;

    this.appCd = appCd;
    this.iftUrl = iftUrl;
    this.orgCd = orgCd;
    this.svcCd = 'B0002';
    this.dispNm = dispNm;
    this.userId = LOGIN_ID;
    this.userPw = decryptPW;
    this.customerType = customerType;
    this.cicNo = CIC_ID ? CIC_ID : '';
    this.taxNo = '';
    this.cmtNo = cmtNo;
    this.reportType = reportType;
    this.voteNo = voteNo;
    this.reqStatus = reqStatus;
    this.inqDt1 = inqDt1;
    this.inqDt2 = inqDt2;
    this.step_useYn = step_useYn;
    this.step_input = step_input;
    this.step_data = step_data;
    this.niceSessionKey = NICE_SSIN_ID;
    this.sendTime = SYS_DTIM;
    this.totalCount = totalCount;
    this.trycount = trycount;

};
