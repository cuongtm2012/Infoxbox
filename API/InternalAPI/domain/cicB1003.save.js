const validation = require('../../shared/util/validation');

module.exports = function CICB1003Save(params, niceSessionKey) {
    const {
        cicNo,
        name,
        address,
        numberOfFi,
        cautionsLoanYn,
        badLoanYn,
        baseDate,
        warningGrage,
        reportComment
    } = params;

    this.cicNo = cicNo ? cicNo : null;
    this.name = name ? name : null;
    this.address = address ? address : null;
    this.numberOfFi = numberOfFi ? numberOfFi : validation.setEmptyValue(numberOfFi);
    this.cautionsLoanYn = cautionsLoanYn ? cautionsLoanYn : null;
    this.badLoanYn = badLoanYn ? badLoanYn : null;
    this.baseDate = baseDate ? baseDate : null
    this.warningGrage = warningGrage ? warningGrage : null;
    this.reportComment = reportComment ? reportComment : null;
    this.niceSessionKey = niceSessionKey;
}