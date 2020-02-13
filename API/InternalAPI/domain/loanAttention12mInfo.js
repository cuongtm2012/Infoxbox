const validation = require('../../shared/util/validation');
const parseValue = require('../util/parseValue');

module.exports = function LoanAttention12MInfor(listData, niceSessionKey, sysDtim, workID, seqs, listName, listDate) {
    const {
        period,
        loanTotal
    } = listData;


    this.NICE_SSIN_ID = niceSessionKey;
    this.SEQ = seqs;
    this.BASE_MONTH = period ? period : null;
    this.BASE_MONTH_CAT_LOAN_SUM = loanTotal ? parseValue.parseFloat(loanTotal) : validation.setEmptyValue(loanTotal);
    this.OGZ_NM = listName ? listName : null;
    this.RPT_DATE = listDate ? listDate : null;
    this.SYS_DTIM = sysDtim;
    this.WORK_ID = workID ? workID : null;

}
