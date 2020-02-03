module.exports = function LongLoanTerm(LongLoanTerm) {
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

    this.longTermNormalLoanVnd = TermNormalLoanVnd ? parseFloat(TermNormalLoanVnd) : 0;
    this.longTermNormalLoanUsd = TermNormalLoanUsd ? parseFloat(TermNormalLoanUsd) : 0;
    this.longTermCautiousLoanVnd = TermCautiousLoanVnd ? parseFloat(TermCautiousLoanVnd) : 0;
    this.longTermCautiousLoanUsd = TermCautiousLoanUsd ? parseFloat(TermCautiousLoanUsd) : 0;
    this.longTermFixedLoanVnd = TermFixedLoanVnd ? parseFloat(TermFixedLoanVnd) : 0;
    this.longTermFixedLoanUsd = TermFixedLoanUsd ? parseFloat(TermFixedLoanUsd) : 0;
    this.longTermDaubtLoanVnd = TermDaubtLoanVnd ? parseFloat(TermDaubtLoanVnd) : 0;
    this.longTermDaubtLoanUsd = TermDaubtLoanUsd ? parseFloat(TermDaubtLoanUsd) : 0;
    this.longTermEstLossLoanVnd = TermEstLossLoanVnd ? parseFloat(TermEstLossLoanVnd) : 0;
    this.longTermEstLossLoanUsd = TermEstLossLoanUsd ? parseFloat(TermEstLossLoanUsd) : 0;
}