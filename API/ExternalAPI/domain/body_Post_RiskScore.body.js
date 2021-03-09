const config = require('../config/config');
const dateutil = require('../util/dateutil');
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

    this.cmd = config.Vmg_RiskScore.DEV_cmd;
    this.phoneNumber = mobilePhoneNumber;
    this.idCard = natId;
    this.month = month ? month : dateutil.getCurrentMonth();
    this.serviceCode = config.Vmg_RiskScore.DEV_serviceCode;
    this.token = config.VmgToken.Prod_Token;
}
