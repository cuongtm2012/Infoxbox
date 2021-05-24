module.exports = function dataVmgKyc2SaveToVmgIncome(niceSessionKey, resultKyc2) {
    this.NICE_SSIN_ID = niceSessionKey;
    this.REQ_ID = resultKyc2.requestid;
    this.INCOME_1 = JSON.stringify(resultKyc2.result.income_1)
    this.INCOME_2 = JSON.stringify(resultKyc2.result.income_2)
    this.INCOME_3 = JSON.stringify(resultKyc2.result.income_3);
    this.TOTAL_INCOME_3 = resultKyc2.result.totalIncome_3;
    this.TOTAL_INCOME_2 = resultKyc2.result.totalIncome_2;
    this.TOTAL_INCOME_1 = resultKyc2.result.totalIncome_1;
    this.SCORE = resultKyc2.result.score;
}
