const validation = require('../../../shared/util/validation');

module.exports = function OtherLoanTerm(TermNormalLoan, TermCautiousLoan, TermFixedLoan, TermDaubtLoan, TermEstLossLoan) {
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

    this.otherTermNormalLoanVnd = TermNormalLoanVnd ? parseFloat(TermNormalLoanVnd) : validation.setEmptyValue(TermNormalLoanVnd);
    this.otherTermNormalLoanUsd = TermNormalLoanUsd ? parseFloat(TermNormalLoanUsd) : validation.setEmptyValue(TermNormalLoanUsd);
    this.otherTermCautiousLoanVnd = TermCautiousLoanVnd ? parseFloat(TermCautiousLoanVnd) : validation.setEmptyValue(TermCautiousLoanVnd);
    this.otherTermCautiousLoanUsd = TermCautiousLoanUsd ? parseFloat(TermCautiousLoanUsd) : validation.setEmptyValue(TermCautiousLoanUsd);
    this.otherTermFixedLoanVnd = TermFixedLoanVnd ? parseFloat(TermFixedLoanVnd) : validation.setEmptyValue(TermFixedLoanVnd);
    this.otherTermFixedLoanUsd = TermFixedLoanUsd ? parseFloat(TermFixedLoanUsd) : validation.setEmptyValue(TermFixedLoanUsd);
    this.otherTermDaubtLoanVnd = TermDaubtLoanVnd ? parseFloat(TermDaubtLoanVnd) : validation.setEmptyValue(TermDaubtLoanVnd);
    this.otherTermDaubtLoanUsd = TermDaubtLoanUsd ? parseFloat(TermDaubtLoanUsd) : validation.setEmptyValue(TermDaubtLoanUsd);
    this.otherTermEstLossLoanVnd = TermEstLossLoanVnd ? parseFloat(TermEstLossLoanVnd) : validation.setEmptyValue(TermEstLossLoanVnd);
    this.otherTermEstLossLoanUsd = TermEstLossLoanUsd ? parseFloat(TermEstLossLoanUsd) : validation.setEmptyValue(TermEstLossLoanUsd);
}