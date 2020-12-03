const config = require('../config/config')
module.exports = function bodyPostRiskScore(riskScoreRequest) {
    const {
        fiSessionKey,
        fiCode,
        taskCode,
        mobilePhoneNumber,
        natId,
        month,
        infoProvConcent
    } = riskScoreRequest;

    this.cmd = "risk_score_nice";
    this.phoneNumber = mobilePhoneNumber;
    this.idCard = natId;
    this.month = month;
    this.serviceCode = 'risk_score_nice';
    this.token = config.VmgToken.Dev_Token;
}
