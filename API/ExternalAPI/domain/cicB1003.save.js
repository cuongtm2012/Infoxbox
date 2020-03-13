
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
    this.numberOfFi = numberOfFi ? parseInt(numberOfFi) : setEmptyValue(numberOfFi);
    this.cautionsLoanYn = cautionsLoanYn ? cautionsLoanYn : null;
    this.badLoanYn = badLoanYn ? badLoanYn : null;
    this.baseDate = baseDate ? baseDate : null
    this.warningGrage = warningGrage ? warningGrage : null;
    this.reportComment = reportComment ? reportComment : null;
    this.niceSessionKey = niceSessionKey;
}

function setEmptyValue(params) {
    if (0 === params || '0' === params || '' === params)
        return 0;
    else
        return null;
}