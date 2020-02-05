const validation = require('../../../shared/util/validation');

module.exports = function LongLoanTerm(TermNormalLoan, TermCautiousLoan, TermFixedLoan, TermDaubtLoan, TermEstLossLoan) {
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

    this.longTermNormalLoanVnd = TermNormalLoanVnd ? parseFloat(TermNormalLoanVnd) : validation.setEmptyValue(TermNormalLoanVnd);
    this.longTermNormalLoanUsd = TermNormalLoanUsd ? parseFloat(TermNormalLoanUsd) : validation.setEmptyValue(TermNormalLoanUsd);
    this.longTermCautiousLoanVnd = TermCautiousLoanVnd ? parseFloat(TermCautiousLoanVnd) : validation.setEmptyValue(TermCautiousLoanVnd);
    this.longTermCautiousLoanUsd = TermCautiousLoanUsd ? parseFloat(TermCautiousLoanUsd) : validation.setEmptyValue(TermCautiousLoanUsd);
    this.longTermFixedLoanVnd = TermFixedLoanVnd ? parseFloat(TermFixedLoanVnd) : validation.setEmptyValue(TermFixedLoanVnd);
    this.longTermFixedLoanUsd = TermFixedLoanUsd ? parseFloat(TermFixedLoanUsd) : validation.setEmptyValue(TermFixedLoanUsd);
    this.longTermDaubtLoanVnd = TermDaubtLoanVnd ? parseFloat(TermDaubtLoanVnd) : validation.setEmptyValue(TermDaubtLoanVnd);
    this.longTermDaubtLoanUsd = TermDaubtLoanUsd ? parseFloat(TermDaubtLoanUsd) : validation.setEmptyValue(TermDaubtLoanUsd);
    this.longTermEstLossLoanVnd = TermEstLossLoanVnd ? parseFloat(TermEstLossLoanVnd) : validation.setEmptyValue(TermEstLossLoanVnd);
    this.longTermEstLossLoanUsd = TermEstLossLoanUsd ? parseFloat(TermEstLossLoanUsd) : validation.setEmptyValueTermEstLossLoanUsd
}