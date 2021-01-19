const dateutil = require('../util/dateutil');
const responCode = require('../../shared/constant/responseCodeExternal');
module.exports = function dataRiskScoreSaveToExtScore(niceSessionKey,requestId,nice_score) {
    this.niceSessionKey = niceSessionKey;
    this.mobilePhoneNumber = nice_score.Mobile_Number;
    this.scoreCode = responCode.ScoreCode.VmgRiskScore;
    this.scoreEx = nice_score.RSK_SCORE;
    this.grade = nice_score.RSK_GRADE;
    this.RSK_GLM_PROB = nice_score.RSK_GLM_PROB;
    this.RSK_RF_PROB = nice_score.RSK_RF_PROB;
    this.RSK_GRB_PROB = nice_score.RSK_GRB_PROB;
    this.RSK_ESB_PROB = nice_score.RSK_ESB_PROB;
    this.baseDate = nice_score.Work_YYYYMM;
    this.custGb = responCode.CUST_GB.VMG;
    this.requestId = requestId;
    this.sysDt = dateutil.timeStamp();
}
