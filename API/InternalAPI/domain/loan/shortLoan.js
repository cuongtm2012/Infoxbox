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

    this.shortTermNormalLoanVnd = parseFloat(TermNormalLoanVnd) ? parseFloat(TermNormalLoanVnd) : 0;
    this.shortTermNormalLoanUsd = parseFloat(TermNormalLoanUsd) ? parseFloat(TermNormalLoanUsd) : 0;
    this.shortTermCautiousLoanVnd = parseFloat(TermCautiousLoanVnd) ? parseFloat(TermCautiousLoanVnd) : 0;
    this.shortTermCautiousLoanUsd = parseFloat(TermCautiousLoanUsd) ? parseFloat(TermCautiousLoanUsd) : 0;
    this.shortTermFixedLoanVnd = parseFloat(TermFixedLoanVnd) ? parseFloat(TermFixedLoanVnd) : 0;
    this.shortTermFixedLoanUsd = parseFloat(TermFixedLoanUsd) ? parseFloat(TermFixedLoanUsd) : 0;
    this.shortTermDaubtLoanVnd = parseFloat(TermDaubtLoanVnd) ? parseFloat(TermDaubtLoanVnd) : 0;
    this.shortTermDaubtLoanUsd = parseFloat(TermDaubtLoanUsd) ? parseFloat(TermDaubtLoanUsd) : 0;
    this.shortTermEstLossLoanVnd = parseFloat(TermEstLossLoanVnd) ? parseFloat(TermEstLossLoanVnd) : 0;
    this.shortTermEstLossLoanUsd = parseFloat(TermEstLossLoanUsd) ? parseFloat(TermEstLossLoanUsd) : 0;

}