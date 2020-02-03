module.exports = function MidLoanTerm(MidLoanTerm) {
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

    this.midTermNormalLoanVnd = TermNormalLoanVnd ? parseFloat(TermNormalLoanVnd) : 0;
    this.midTermNormalLoanUsd = TermNormalLoanUsd ? parseFloat(TermNormalLoanUsd) : 0;
    this.midTermCautiousLoanVnd = TermCautiousLoanVnd ? parseFloat(TermCautiousLoanVnd) : 0;
    this.midTermCautiousLoanUsd = TermCautiousLoanUsd ? parseFloat(TermCautiousLoanUsd) : 0;
    this.midTermFixedLoanVnd = TermFixedLoanVnd ? parseFloat(TermFixedLoanVnd) : 0;
    this.midTermFixedLoanUsd = TermFixedLoanUsd ? parseFloat(TermFixedLoanUsd) : 0;
    this.midTermDaubtLoanVnd = TermDaubtLoanVnd ? parseFloat(TermDaubtLoanVnd) : 0;
    this.midTermDaubtLoanUsd = TermDaubtLoanUsd ? parseFloat(TermDaubtLoanUsd) : 0;
    this.midTermEstLossLoanVnd = TermEstLossLoanVnd ? parseFloat(TermEstLossLoanVnd) : 0;
    this.midTermEstLossLoanUsd = TermEstLossLoanUsd ? parseFloat(TermEstLossLoanUsd) : 0;
}