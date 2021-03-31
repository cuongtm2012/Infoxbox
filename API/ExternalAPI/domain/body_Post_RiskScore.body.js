import config from '../config/config.js';
import DateUtil from '../util/dateutil.js';
export default function bodyPostRiskScore(riskScoreRequest) {
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
    this.month = month ? month : DateUtil.getCurrentMonth();
    this.serviceCode = config.Vmg_RiskScore.DEV_serviceCode;
    this.token = config.VmgToken.Dev_Token;
}
