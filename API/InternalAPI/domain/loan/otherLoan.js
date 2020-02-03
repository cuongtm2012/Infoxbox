module.exports = function OtherLoanTerm(OtherLoanTerm) {
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

    this.otherTermNormalLoanVnd = TermNormalLoanVnd ? parseFloat(TermNormalLoanVnd) : 0;
    this.otherTermNormalLoanUsd = TermNormalLoanUsd ? parseFloat(TermNormalLoanUsd) : 0;
    this.otherTermCautiousLoanVnd = TermCautiousLoanVnd ? parseFloat(TermCautiousLoanVnd) : 0;
    this.otherTermCautiousLoanUsd = TermCautiousLoanUsd ? parseFloat(TermCautiousLoanUsd) : 0;
    this.otherTermFixedLoanVnd = TermFixedLoanVnd ? parseFloat(TermFixedLoanVnd) : 0;
    this.otherTermFixedLoanUsd = TermFixedLoanUsd ? parseFloat(TermFixedLoanUsd) : 0;
    this.otherTermDaubtLoanVnd = TermDaubtLoanVnd ? parseFloat(TermDaubtLoanVnd) : 0;
    this.otherTermDaubtLoanUsd = TermDaubtLoanUsd ? parseFloat(TermDaubtLoanUsd) : 0;
    this.otherTermEstLossLoanVnd = TermEstLossLoanVnd ? parseFloat(TermEstLossLoanVnd) : 0;
    this.otherTermEstLossLoanUsd = TermEstLossLoanUsd ? parseFloat(TermEstLossLoanUsd) : 0;
}