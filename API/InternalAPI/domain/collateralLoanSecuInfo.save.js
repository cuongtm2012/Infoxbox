module.exports = function CollateralLoanSecuInfo(listData, niceSessionKey, sysDtim, workID) {
    const {
        assetBackedLoanGuarantee,
        numberOfCollateral,
        numberOfFiWithCollateral
    } = listData;

    this.NICE_SSIN_ID = niceSessionKey;
    this.AST_SCRT_LOAN_GURT_AMT = assetBackedLoanGuarantee ? assetBackedLoanGuarantee : null;
    this.SCRT_AST_CNT = numberOfCollateral ? numberOfCollateral : null;
    this.SCRT_AST_OGZ_CNT = numberOfFiWithCollateral ? numberOfFiWithCollateral : null;
    this.SYS_DTIM = sysDtim;
    this.WORK_ID = workID ? workID : null;

}