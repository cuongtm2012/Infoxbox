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

    this.midTermNormalLoanVnd = parseFloat(TermNormalLoanVnd) ? parseFloat(TermNormalLoanVnd) : 0;
    this.midTermNormalLoanUsd = parseFloat(TermNormalLoanUsd) ? parseFloat(TermNormalLoanUsd) : 0;
    this.midTermCautiousLoanVnd = parseFloat(TermCautiousLoanVnd) ? parseFloat(TermCautiousLoanVnd) : 0;
    this.midTermCautiousLoanUsd = parseFloat(TermCautiousLoanUsd) ? parseFloat(TermCautiousLoanUsd) : 0;
    this.midTermFixedLoanVnd = parseFloat(TermFixedLoanVnd) ? parseFloat(TermFixedLoanVnd) : 0;
    this.midTermFixedLoanUsd = parseFloat(TermFixedLoanUsd) ? parseFloat(TermFixedLoanUsd) : 0;
    this.midTermDaubtLoanVnd = parseFloat(TermDaubtLoanVnd) ? parseFloat(TermDaubtLoanVnd) : 0;
    this.midTermDaubtLoanUsd = parseFloat(TermDaubtLoanUsd) ? parseFloat(TermDaubtLoanUsd) : 0;
    this.midTermEstLossLoanVnd = parseFloat(TermEstLossLoanVnd) ? parseFloat(TermEstLossLoanVnd) : 0;
    this.midTermEstLossLoanUsd = parseFloat(TermEstLossLoanUsd) ? parseFloat(TermEstLossLoanUsd) : 0;
}