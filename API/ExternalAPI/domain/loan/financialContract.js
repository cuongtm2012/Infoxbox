module.exports = function FinancialContract(params) {
    const {
        FIN_CTRT,
        OGZ_NM,
        CTRT_START_DATE,
        CTRT_END_DATE
    } = params;

    this.financialContract = FIN_CTRT ? FIN_CTRT : '';
    this.cicFiName = OGZ_NM ? OGZ_NM : '';
    this.beginningDateOfContract = CTRT_START_DATE ? CTRT_START_DATE : '';
    this.endDateOfContract = CTRT_END_DATE ? CTRT_END_DATE : '';
}