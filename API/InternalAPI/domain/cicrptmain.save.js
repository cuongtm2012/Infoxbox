module.exports = function cicrptmain(cicrptinfor, custInfor, msg,  niceSessionKey, cusAdd, cuscomt) {
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

    const {
        loanCMT,
        loanDetailCMT,
        cardCMT,
        vamcCMT,
        loan12MonCMT,
        npl5YCMT,
        cardArr3YCMT,
        catLoan12MCMT,
        finCtrtCMT
    } = msg;

    this.NICE_SSIN_ID = niceSessionKey;
    this.INQ_OGZ_NM = searchingUnit ? searchingUnit : null;
    this.INQ_OGZ_ADDR = address ? address : null;
    this.INQ_USER_NM = lookupers ? lookupers : null;
    this.INQ_CD = voucherCode ? voucherCode : null;
    this.INQ_DTIM = requireDay + requireTime;
    this.RPT_SEND_DTIM = sendDay + sendTime;
    this.PSN_COMT = cuscomt ? cuscomt : null;
    this.PSN_NM = name ? name : null;
    this.CIC_ID = cicCode ? cicCode : null;
    this.PSN_ADDR = cusAdd ? cusAdd : null;
    this.NATL_ID = idCardNumber ? idCardNumber : null;
    this.OTR_IDEN_EVD = otherDocument ? otherDocument : null;
    this.EWS_GRD = waitdata ? waitdata : null;
    this.BIRTH_YMD = waitdata ? waitdata : null;
    this.TEL_NO_MOBILE = waitdata ? waitdata : null;
    this.LOAN_CMT = loanCMT ? loanCMT : null;
    this.LOAN_CMT_DETAIL = loanDetailCMT ? loanDetailCMT : null;
    this.CARD_CMT = cardCMT ? cardCMT : null;
    this.VAMC_CMT = vamcCMT ? vamcCMT : null;
    this.LOAN_12MON_CMT = loan12MonCMT ? loan12MonCMT : null;
    this.NPL_5YR_CMT = npl5YCMT ? npl5YCMT : null;
    this.CARD_ARR_3YR_CMT = cardArr3YCMT ? cardArr3YCMT : null;
    this.CAT_LOAN_12MON_CMT = catLoan12MCMT ? catLoan12MCMT : null;
    this.FIN_CTRT_CMT = finCtrtCMT ? finCtrtCMT : null;
}