import dateutil from '../util/dateutil.js';
import responCode from '../../shared/constant/responseCodeExternal.js';
import ipGateWay from '../../shared/util/getIPGateWay.js';
export function dataStatusContractSaveToScrapLog(Request, niceSessionKey) {
    const {
        fiSessionKey,
        fiCode,
        taskCode,
        id
    } = Request;

    this.niceSessionKey = niceSessionKey;
    this.custSsId = fiSessionKey ? fiSessionKey : null;
    this.custCd = fiCode;
    this.gdsCD = responCode.NiceProductCode.FTN_CSS_RQST.code;
    this.inqDt = dateutil.getCurrentInquiryDate();
    this.sysDt = dateutil.timeStamp();
    this.workID = ipGateWay.getIPGateWay();
}