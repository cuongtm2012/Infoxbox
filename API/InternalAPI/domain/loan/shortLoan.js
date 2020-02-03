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

    this.shortTermNormalLoanVnd = TermNormalLoanVnd ? parseFloat(TermNormalLoanVnd) : 0;
    this.shortTermNormalLoanUsd = TermNormalLoanUsd ? parseFloat(TermNormalLoanUsd) : 0;
    this.shortTermCautiousLoanVnd = TermCautiousLoanVnd ? parseFloat(TermCautiousLoanVnd) : 0;
    this.shortTermCautiousLoanUsd = TermCautiousLoanUsd ? parseFloat(TermCautiousLoanUsd) : 0;
    this.shortTermFixedLoanVnd = TermFixedLoanVnd ? parseFloat(TermFixedLoanVnd) : 0;
    this.shortTermFixedLoanUsd = TermFixedLoanUsd ? parseFloat(TermFixedLoanUsd) : 0;
    this.shortTermDaubtLoanVnd = TermDaubtLoanVnd ? parseFloat(TermDaubtLoanVnd) : 0;
    this.shortTermDaubtLoanUsd = TermDaubtLoanUsd ? parseFloat(TermDaubtLoanUsd) : 0;
    this.shortTermEstLossLoanVnd = TermEstLossLoanVnd ? parseFloat(TermEstLossLoanVnd) : 0;
    this.shortTermEstLossLoanUsd = TermEstLossLoanUsd ? parseFloat(TermEstLossLoanUsd) : 0;

}