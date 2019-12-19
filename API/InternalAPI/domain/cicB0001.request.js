

module.exports = function cicB0001Request(parameters) {
    const { APP_CODE,
        CIC_NO,
        CMT_NO,
        CUSTOMER_TYPE,
        DISP_NAME,
        INQDT1,
        INQDT2,
        ORIGIN_CODE,
        REPORT_TYPE,
        REQ_STATUS,
        SERVICE_CODE,
        TAX_NO,
        USER_ID,
        USER_PASSWORD,
        VOTE_NO
    } = parameters;

    this.appCd = APP_CODE ? APP_CODE : 'infotechDev';
    this.orgCd = ORIGIN_CODE ? ORIGIN_CODE : 'cic.vn';
    this.svcCd = SERVICE_CODE;
    this.dispNm = DISP_NAME;
    this.userId = USER_ID;
    this.userPw = USER_PASSWORD;
    this.customerType = CUSTOMER_TYPE ? CUSTOMER_TYPE : '2';
    this.cicNo = CIC_NO ? CIC_NO : "";
    this.taxNo = TAX_NO ? TAX_NO : "";
    this.cmtNo = CMT_NO ? CMT_NO : "";
    this.reportType = REPORT_TYPE ? REPORT_TYPE : "";
    this.voteNo = VOTE_NO ? VOTE_NO : "";
    this.reqStatus = REQ_STATUS ? REQ_STATUS : "";
    this.inqDt1 = INQDT1 ? INQDT1 : "";
    this.inqDt2 = INQDT2 ? INQDT2 : "";

};
