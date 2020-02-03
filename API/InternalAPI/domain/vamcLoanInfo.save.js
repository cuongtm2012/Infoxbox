const validation = require('../../shared/util/validation');

module.exports = function VamcLoanInfo(listData, niceSessionKey, sysDtim, workID, seqs) {
    const {
        seq,
        company,
        balance,
        date
    } = listData;

    this.NICE_SSIN_ID = niceSessionKey;
    this.SEQ = seq ? parseInt(seq) : seqs;
    this.SELL_OGZ_NM = company ? company : null;
    this.PRCP_BAL = balance ? parseFloat(balance) : validation.setEmptyValue(balance);
    this.DATA_RPT_DATE = date ? date : null;
    this.SYS_DTIM = sysDtim;
    this.WORK_ID = workID ? workID : null;
}