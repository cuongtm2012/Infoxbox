

module.exports = function cics11aRequest(requestData) {
    const { appCd,
        orgCd,
        svcCd,
        userId,
        userPw,
        customerType,
        cicNo,
        taxNo,
        cmtNo,
        reportType,
        voteNo,
        reqStatus,
        inqDt1,
        inqDt2 } = requestData;

    this.appCd = appCd;
    this.orgCd = orgCd
    this.svcCd = svcCd;1
    this.userId = userId;
    this.userPw = userPw;
    this.customerType = customerType;
    this.cicNo = cicNo;
    this.taxNo = taxNo;
    this.cmtNo = cmtNo;
    this.reportType = reportType;
    this.voteNo = voteNo;
    this.reqStatus = reqStatus;
    this.inqDt1 = inqDt1;
    this.inqDt2 = inqDt2;

};
