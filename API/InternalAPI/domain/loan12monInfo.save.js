const validation = require('../../shared/util/validation');
const parseValue = require('../util/parseValue');

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
    this.BASE_MONTH_BAL = outstandingLoans ? parseValue.parseFloat(outstandingLoans) : validation.setEmptyValue(outstandingLoans);
    this.BASE_MONTH_CARD_BAL = creditCard ? parseValue.parseFloat(creditCard) : validation.setEmptyValue(outstandingLoans);
    this.BASE_MONTH_SUM = total ? parseValue.parseFloat(total) : validation.setEmptyValue(outstandingLoans);
    this.SYS_DTIM = sysDtim;
    this.WORK_ID = workID;

}