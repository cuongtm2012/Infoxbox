const validation = require('../../shared/util/validation');

module.exports = function CollateralLoanSecuInfo(listData, niceSessionKey) {
    const {
        assetBackedLoanGuarantee,
        numberOfCollateral,
        numberOfFiWithCollateral
    } = listData;

    this.NICE_SSIN_ID = niceSessionKey;
    this.AST_SCRT_LOAN_GURT_AMT = assetBackedLoanGuarantee ? assetBackedLoanGuarantee : null;
    this.SCRT_AST_CNT = numberOfCollateral ? parseFloat(numberOfCollateral) : validation.setEmptyValue(numberOfCollateral);
    this.SCRT_AST_OGZ_CNT = numberOfFiWithCollateral ? parseFloat(numberOfFiWithCollateral) : validation.setEmptyValue(numberOfFiWithCollateral);

}