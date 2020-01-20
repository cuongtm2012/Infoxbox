module.exports = function VamcLoanInfo(listData, niceSessionKey, sysDtim, workID, seqs) {
    const {
        seq,
        company,
        balance,
        date
    } = listData;

    this.NICE_SSIN_ID = niceSessionKey;
    this.SEQ = seq ? seq : seqs;
    this.SELL_OGZ_NM = company ? company : null;
    this.PRCP_BAL = balance ? balance : 0;
    this.DATA_RPT_DATE = date ? date : null;
    this.SYS_DTIM = sysDtim;
    this.WORK_ID = workID ? workID : null;
}