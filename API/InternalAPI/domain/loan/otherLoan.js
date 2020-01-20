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

    this.otherTermNormalLoanVnd = parseFloat(TermNormalLoanVnd) ? parseFloat(TermNormalLoanVnd) : 0;
    this.otherTermNormalLoanUsd = parseFloat(TermNormalLoanUsd) ? parseFloat(TermNormalLoanUsd) : 0;
    this.otherTermCautiousLoanVnd = parseFloat(TermCautiousLoanVnd) ? parseFloat(TermCautiousLoanVnd) : 0;
    this.otherTermCautiousLoanUsd = parseFloat(TermCautiousLoanUsd) ? parseFloat(TermCautiousLoanUsd) : 0;
    this.otherTermFixedLoanVnd = parseFloat(TermFixedLoanVnd) ? parseFloat(TermFixedLoanVnd) : 0;
    this.otherTermFixedLoanUsd = parseFloat(TermFixedLoanUsd) ? parseFloat(TermFixedLoanUsd) : 0;
    this.otherTermDaubtLoanVnd = parseFloat(TermDaubtLoanVnd) ? parseFloat(TermDaubtLoanVnd) : 0;
    this.otherTermDaubtLoanUsd = parseFloat(TermDaubtLoanUsd) ? parseFloat(TermDaubtLoanUsd) : 0;
    this.otherTermEstLossLoanVnd = parseFloat(TermEstLossLoanVnd) ? parseFloat(TermEstLossLoanVnd) : 0;
    this.otherTermEstLossLoanUsd = parseFloat(TermEstLossLoanUsd) ? parseFloat(TermEstLossLoanUsd) : 0;
}