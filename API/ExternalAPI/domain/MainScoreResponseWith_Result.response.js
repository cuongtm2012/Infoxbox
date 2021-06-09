module.exports = function mainScoreResponseWithResult(RCS_M01_RQSTRequest, preResponse, resultRclips, resultVmgK2) {
    const {
        responseMessage,
        niceSessionKey,
        responseTime,
        responseCode
    } = preResponse;

    const {
        appNumber,
        fiCode,
        taskCode,
        customerNumber,
        productCode,
        nfNiceSessionKey,
        cicNiceSessionKey,
        mobilePhoneNumber,
        natId,
        infoProvConcent
    } = RCS_M01_RQSTRequest;

    this.appNumber = appNumber ? appNumber : "";
    this.fiCode = fiCode;
    this.taskCode = taskCode;
    this.customerNumber = customerNumber;
    this.productCode = productCode;
    this.nfNiceSessionKey = nfNiceSessionKey;
    this.cicNiceSessionKey = cicNiceSessionKey;
    this.mobilePhoneNumber = mobilePhoneNumber;
    this.natId = natId;
    this.infoProvConcent = infoProvConcent;
    this.niceSessionKey = niceSessionKey ? niceSessionKey : "";
    this.responseTime = responseTime ? responseTime : "";
    this.responseCode = responseCode ? responseCode : "";
    this.responseMessage = responseMessage ? responseMessage : "";
//    loan approval result
    this.finalGrade = resultRclips.OT006;
    this.finalLoanApproval = resultRclips.OT011;
    this.loanLimit = resultRclips.OT010;
//    vmg income
    if ((resultVmgK2.error_code === 20 || resultVmgK2.error_code === 0) && resultVmgK2.result) {
        this.baseYear1 = resultVmgK2.result.income_3 ? resultVmgK2.result.income_3[0].year.toString() : "";
        this.totalIncome1 = resultVmgK2.result.totalIncome_3 ? resultVmgK2.result.totalIncome_3 : "";
        this.incomeScore = resultVmgK2.score ? resultVmgK2.score.toString() : "";
    } else {
        this.baseYear1 = "";
        this.totalIncome1 = "";
        this.incomeScore = "";
    }
};