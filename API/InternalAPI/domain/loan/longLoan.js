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

    this.longTermNormalLoanVnd = parseFloat(TermNormalLoanVnd) ? parseFloat(TermNormalLoanVnd) : 0;
    this.longTermNormalLoanUsd = parseFloat(TermNormalLoanUsd) ? parseFloat(TermNormalLoanUsd) : 0;
    this.longTermCautiousLoanVnd = parseFloat(TermCautiousLoanVnd) ? parseFloat(TermCautiousLoanVnd) : 0;
    this.longTermCautiousLoanUsd = parseFloat(TermCautiousLoanUsd) ? parseFloat(TermCautiousLoanUsd) : 0;
    this.longTermFixedLoanVnd = parseFloat(TermFixedLoanVnd) ? parseFloat(TermFixedLoanVnd) : 0;
    this.longTermFixedLoanUsd = parseFloat(TermFixedLoanUsd) ? parseFloat(TermFixedLoanUsd) : 0;
    this.longTermDaubtLoanVnd = parseFloat(TermDaubtLoanVnd) ? parseFloat(TermDaubtLoanVnd) : 0;
    this.longTermDaubtLoanUsd = parseFloat(TermDaubtLoanUsd) ? parseFloat(TermDaubtLoanUsd) : 0;
    this.longTermEstLossLoanVnd = parseFloat(TermEstLossLoanVnd) ? parseFloat(TermEstLossLoanVnd) : 0;
    this.longTermEstLossLoanUsd = parseFloat(TermEstLossLoanUsd) ? parseFloat(TermEstLossLoanUsd) : 0;
}