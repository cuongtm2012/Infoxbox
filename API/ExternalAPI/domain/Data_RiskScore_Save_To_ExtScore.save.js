const dateutil = require('../util/dateutil');
const responCode = require('../../shared/constant/responseCodeExternal');
module.exports = function dataRiskScoreSaveToExtScore(niceSessionKey,requestId,nice_score, phoneNumber) {
    this.niceSessionKey = niceSessionKey;
    this.mobilePhoneNumber = phoneNumber;
    this.scoreCode = responCode.ScoreCode.VmgRiskScore;
    this.scoreEx = nice_score.RSK_SCORE ? nice_score.RSK_SCORE : -99;
    this.grade = nice_score.RSK_GRADE ? nice_score.RSK_GRADE : -99;
    this.RSK_GLM_PROB = nice_score.RSK_GLM_PROB ? nice_score.RSK_GLM_PROB : -99;
    this.RSK_RF_PROB = nice_score.RSK_RF_PROB ? nice_score.RSK_RF_PROB : -99;
    this.RSK_GRB_PROB = nice_score.RSK_GRB_PROB ? nice_score.RSK_GRB_PROB : -99;
    this.RSK_ESB_PROB = nice_score.RSK_ESB_PROB ? nice_score.RSK_ESB_PROB : -99;
    this.baseDate = nice_score.Work_YYYYMM ? nice_score.Work_YYYYMM : -99;
    this.custGb = responCode.CUST_GB.VMG;
    this.requestId = requestId;
    this.sysDt = dateutil.timeStamp();
}
