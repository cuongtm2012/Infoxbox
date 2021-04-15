
module.exports = function CICA0001(params, defaultParams, loginID, decryptPW) {
    const {
        NICE_SSIN_ID,
        INQ_DTIM
    } = params;

    const {
        appCd,
        iftUrl,
        orgCd
    } = defaultParams;

    this.appCd = appCd;
    this.orgCd = orgCd;
    this.svcCd = 'A0001';
    this.userId = loginID;
    this.userPw = decryptPW;
    this.inquiryDate = INQ_DTIM;
    this.niceSessionKey = NICE_SSIN_ID;
}