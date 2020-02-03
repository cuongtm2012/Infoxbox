const validation = require('../../shared/util/validation');

module.exports = function LoanAttention12MInfor(listData, niceSessionKey, sysDtim, workID, seqs) {
    const {
        period,
        loanTotal,
        company,
        date
    } = listData;


    this.NICE_SSIN_ID = niceSessionKey;
    this.SEQ = seqs;
    this.BASE_MONTH = period ? period : null;
    this.BASE_MONTH_CAT_LOAN_SUM = loanTotal ? parseFloat(loanTotal) : validation.setEmptyValue(loanTotal);
    this.OGZ_NM = company ? company : null;
    this.RPT_DATE = date ? date : null;
    this.SYS_DTIM = sysDtim;
    this.WORK_ID = workID ? workID : null;

}
