const dateutil = require('../util/dateutil');
const responCode = require('../../shared/constant/responseCodeExternal');
module.exports = function dataZaloSaveToExtScore(requestParams,niceSessionKey,score,requestId) {
    const {
        fiSeesionKey,
        fiCode,
        taskCode,
        mobilePhoneNumber,
        scoreProduct,
        inquiryPurpose,
        infoProvConcent
    } = requestParams;

    this.niceSessionKey = niceSessionKey;
    this.mobilePhoneNumber = mobilePhoneNumber;
    this.scoreCode = responCode.ScoreCode.zalo;
    this.scoreEx = score;
    this.custGb = responCode.CUST_GB.zalo;
    this.requestId = requestId;
    this.sysDt = dateutil.timeStamp();
}
