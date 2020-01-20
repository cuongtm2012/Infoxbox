module.exports = function loan12monInfo(listData, niceSessionKey, sysDtim, workID, seqs) {
    const {
        time,
        outstandingLoans,
        creditCard,
        total
    } = listData;

    this.NICE_SSIN_ID = niceSessionKey;
    this.SEQ = seqs;
    this.BASE_MONTH = time;
    this.BASE_MONTH_BAL = parseFloat(outstandingLoans) ? parseFloat(outstandingLoans) : null;
    this.BASE_MONTH_CARD_BAL = parseFloat(creditCard) ? parseFloat(creditCard) : null;
    this.BASE_MONTH_SUM = parseFloat(total) ? parseFloat(total) : null;
    this.SYS_DTIM = sysDtim;
    this.WORK_ID = workID;

}