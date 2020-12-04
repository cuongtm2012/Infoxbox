const responCode = require('../../shared/constant/responseCodeExternal');
module.exports = function riskScoreResponseWithScore(riskScoreRequest, preResponse,nice_score ) {
    const {
        responseMessage,
        niceSessionKey,
        responseTime,
        responseCode
    } = preResponse;

    const {
        fiSessionKey,
        fiCode,
        taskCode,
        mobilePhoneNumber,
        natId,
        month,
        infoProvConcent
    } = riskScoreRequest;

    this.fiSessionKey = fiSessionKey ? fiSessionKey : "";
    this.fiCode = fiCode ? fiCode : "";
    this.taskCode = taskCode ? taskCode : "";
    this.mobilePhoneNumber = mobilePhoneNumber ? mobilePhoneNumber : "";
    this.natId = natId ? natId : "";
    this.month = month ? month : "";
    this.infoProvConcent = infoProvConcent ? infoProvConcent : "";
    this.niceSessionKey = niceSessionKey ? niceSessionKey : "";
    this.responseTime  = responseTime ? responseTime : "";
    this.responseCode = responseCode ? responseCode : "";
    this.responseMessage = responseMessage ? responseMessage : "";
    this.scoreCode =  responCode.ScoreCode.VmgRiskScore;
    this.Work_YYYYMM = nice_score.Work_YYYYMM;
    this.Mobile_Number = nice_score.Mobile_Number;
    this.National_ID = nice_score.National_ID;
    this.GLM_PROB = nice_score.RSK_GLM_PROB;
    this.RF_PROB = nice_score.RSK_RF_PROB;
    this.GRB_PROB = nice_score.RSK_GRB_PROB;
    this.ESB_PROB = nice_score.RSK_ESB_PROB;
    this.Grade = nice_score.RSK_GRADE;
    this.Score = nice_score.RSK_SCORE;
}
