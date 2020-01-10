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
    this.BASE_MONTH_BAL = parseFloat(outstandingLoans) ? parseFloat(outstandingLoans) : 0;;
    this.BASE_MONTH_CARD_BAL = parseFloat(creditCard) ? parseFloat(creditCard) : 0;
    this.BASE_MONTH_SUM = parseFloat(total) ? parseFloat(total) : 0;
    this.SYS_DTIM = sysDtim;
    this.WORK_ID = workID;

}