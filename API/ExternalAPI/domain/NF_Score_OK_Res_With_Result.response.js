module.exports = function NFScoreOKResponseWithScore(Request, preResponse, riskScore, zaloScore) {
    var mockupResult = Math.floor(Math.random() * 10) + 1;
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
        scoreProduct,
        mobilePhoneNumber,
        natId,
        infoProvConcent
    } = Request;

    this.appNumber = appNumber ? appNumber : "";
    this.fiCode = fiCode ? fiCode : "";
    this.taskCode = taskCode ? taskCode : "";
    this.customerNumber = customerNumber ? customerNumber : "";
    this.scoreProduct = scoreProduct ? scoreProduct : "";
    this.mobilePhoneNumber = mobilePhoneNumber ? mobilePhoneNumber : "";
    this.natId = natId ? natId : "";
    this.infoProvConcent = infoProvConcent ? infoProvConcent : "";
    this.niceSessionKey = niceSessionKey ? niceSessionKey : "";
    this.responseTime = responseTime ? responseTime : "";
    this.responseCode = responseCode ? responseCode : "";
    this.responseMessage = responseMessage ? responseMessage : "";
    // this.nfGrade = {
    //     // zaloScore: {score: zaloScore.score},
    //     // riskScore: {
    //     //     RSK_GLM_PROB: riskScore.RSK_GLM_PROB,
    //     //     RSK_RF_PROB: riskScore.RSK_RF_PROB,
    //     //     RSK_GRB_PROB: riskScore.RSK_GRB_PROB,
    //     //     RSK_ESB_PROB: riskScore.RSK_ESB_PROB,
    //     //     RSK_SCORE: riskScore.RSK_SCORE,
    //     //     RSK_GRADE: riskScore.RSK_GRADE
    //     // }
    //     Score: mockupResult
    // }
    this.nfGrade = mockupResult;
    if (8 <= mockupResult && mockupResult <= 10) {
        this.curoffResult = 'R';
    } else if (4 <= mockupResult && mockupResult <= 7) {
        this.curoffResult = 'G';
    } else if (1 <= mockupResult && mockupResult <= 3) {
        this.curoffResult = 'A';
    }
}