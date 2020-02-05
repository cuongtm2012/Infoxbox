const validation = require('../../../shared/util/validation');

module.exports = function ShortLoanTerm(TermNormalLoan, TermCautiousLoan, TermFixedLoan, TermDaubtLoan, TermEstLossLoan) {
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

    this.shortTermNormalLoanVnd = TermNormalLoanVnd ? parseFloat(TermNormalLoanVnd) : validation.setEmptyValue(TermNormalLoanVnd);
    this.shortTermNormalLoanUsd = TermNormalLoanUsd ? parseFloat(TermNormalLoanUsd) : validation.setEmptyValue(TermNormalLoanUsd);
    this.shortTermCautiousLoanVnd = TermCautiousLoanVnd ? parseFloat(TermCautiousLoanVnd) : validation.setEmptyValue(TermCautiousLoanVnd);
    this.shortTermCautiousLoanUsd = TermCautiousLoanUsd ? parseFloat(TermCautiousLoanUsd) : validation.setEmptyValue(TermCautiousLoanUsd);
    this.shortTermFixedLoanVnd = TermFixedLoanVnd ? parseFloat(TermFixedLoanVnd) : validation.setEmptyValue(TermFixedLoanVnd);
    this.shortTermFixedLoanUsd = TermFixedLoanUsd ? parseFloat(TermFixedLoanUsd) : validation.setEmptyValue(TermFixedLoanUsd);
    this.shortTermDaubtLoanVnd = TermDaubtLoanVnd ? parseFloat(TermDaubtLoanVnd) : validation.setEmptyValue(TermDaubtLoanVnd);
    this.shortTermDaubtLoanUsd = TermDaubtLoanUsd ? parseFloat(TermDaubtLoanUsd) : validation.setEmptyValue(TermDaubtLoanUsd);
    this.shortTermEstLossLoanVnd = TermEstLossLoanVnd ? parseFloat(TermEstLossLoanVnd) : validation.setEmptyValue(TermEstLossLoanVnd);
    this.shortTermEstLossLoanUsd = TermEstLossLoanUsd ? parseFloat(TermEstLossLoanUsd) : validation.setEmptyValue(TermEstLossLoanUsd);

}