module.exports = function cicrptmain(cicrptinfor, custInfor, niceSessionKey, cusAdd) {
    const {
        title,
        number,
        searchingUnit,
        address,
        phone,
        lookupers,
        voucherCode,
        requireDay,
        requireTime,
        sendDay,
        sendTime,
        waitdata
    } = cicrptinfor;

    const {
        name,
        cicCode,
        idCardNumber,
        otherDocument
    } = custInfor;

    this.NICE_SSIN_ID = niceSessionKey;
    this.INQ_OGZ_NM = searchingUnit ? searchingUnit : '';
    this.INQ_OGZ_ADDR = address ? address : '';
    this.INQ_USER_NM = lookupers ? lookupers : '';
    this.INQ_CD = number ? number : '';
    this.INQ_DTIM = requireDay + requireTime;
    this.RPT_SEND_DTIM = sendDay + sendTime;
    this.PSN_COMT = waitdata ? waitdata : null;
    this.PSN_NM = name ? name : null;
    this.CIC_ID = cicCode ? cicCode : null;
    this.PSN_ADDR = cusAdd ? cusAdd : null;
    this.NATL_ID = idCardNumber ? idCardNumber : null;
    this.OTR_IDEN_EVD = waitdata ? waitdata : null;
    this.EWS_GRD = waitdata ? waitdata : null;
    this.BIRTH_YMD = waitdata ? waitdata : null;
    this.TEL_NO_MOBILE = waitdata ? waitdata : null;
    this.LOAN_CMT = waitdata ? waitdata : null;
    this.LOAN_CMT_DETAIL = waitdata ? waitdata : null;
    this.CARD_CMT = waitdata ? waitdata : null;
    this.VAMC_CMT = waitdata ? waitdata : null;
    this.LOAN_12MON_CMT = waitdata ? waitdata : null;
    this.NPL_5YR_CMT = waitdata ? waitdata : null;
    this.CARD_ARR_3YR_CMT = waitdata ? waitdata : null;
    this.CAT_LOAN_12MON_CMT = waitdata ? waitdata : null;
    this.FIN_CTRT_CMT = waitdata ? waitdata : null;
}