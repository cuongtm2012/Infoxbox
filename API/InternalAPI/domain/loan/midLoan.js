const validation = require('../../../shared/util/validation');

module.exports = function MidLoanTerm(TermNormalLoan, TermCautiousLoan, TermFixedLoan, TermDaubtLoan, TermEstLossLoan) {
    const {
        TermNormalLoanVnd,
        TermNormalLoanUsd } = TermNormalLoan;
    const {
        TermCautiousLoanVnd,
        TermCautiousLoanUsd } = TermCautiousLoan;
    const {
        TermFixedLoanVnd,
        TermFixedLoanUsd } = TermFixedLoan;
    const {
        TermDaubtLoanVnd,
        TermDaubtLoanUsd } = TermDaubtLoan;
    const {
        TermEstLossLoanVnd,
        TermEstLossLoanUsd } = TermEstLossLoan;

    this.midTermNormalLoanVnd = TermNormalLoanVnd ? parseFloat(TermNormalLoanVnd) : validation.setEmptyValue(TermNormalLoanVnd);
    this.midTermNormalLoanUsd = TermNormalLoanUsd ? parseFloat(TermNormalLoanUsd) : validation.setEmptyValue(TermNormalLoanUsd);
    this.midTermCautiousLoanVnd = TermCautiousLoanVnd ? parseFloat(TermCautiousLoanVnd) : validation.setEmptyValue(TermCautiousLoanVnd);
    this.midTermCautiousLoanUsd = TermCautiousLoanUsd ? parseFloat(TermCautiousLoanUsd) : validation.setEmptyValue(TermCautiousLoanUsd);
    this.midTermFixedLoanVnd = TermFixedLoanVnd ? parseFloat(TermFixedLoanVnd) : validation.setEmptyValue(TermFixedLoanVnd);
    this.midTermFixedLoanUsd = TermFixedLoanUsd ? parseFloat(TermFixedLoanUsd) : validation.setEmptyValue(TermFixedLoanUsd);
    this.midTermDaubtLoanVnd = TermDaubtLoanVnd ? parseFloat(TermDaubtLoanVnd) : validation.setEmptyValue(TermDaubtLoanVnd);
    this.midTermDaubtLoanUsd = TermDaubtLoanUsd ? parseFloat(TermDaubtLoanUsd) : validation.setEmptyValue(TermDaubtLoanUsd);
    this.midTermEstLossLoanVnd = TermEstLossLoanVnd ? parseFloat(TermEstLossLoanVnd) : validation.setEmptyValue(TermEstLossLoanVnd);
    this.midTermEstLossLoanUsd = TermEstLossLoanUsd ? parseFloat(TermEstLossLoanUsd) : validation.setEmptyValue(TermEstLossLoanUsd);
}