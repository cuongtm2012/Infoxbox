
import dateutil from '../util/dateutil.js';

export function cicB1003Req(parameters, defaultValue, decryptPW, niceSessionKey) {
    const {
        loginId,
        natId,
        oldNatId,
        passportNumber,
        taxCode,
        cicId
    } = parameters;

    const {
        appCd,
        iftUrl,
        orgCd,
        dispNm,
        customerType,
        reportType,
        voteNo,
        reqStatus,
        inqDt1,
        inqDt2,
        step_useYn,
        step_input,
        step_data
    } = defaultValue;

    const _natId = natId ? natId : oldNatId;
    const _passportNumber = _natId ? _natId : passportNumber;

    this.appCd = appCd;
    this.iftUrl = iftUrl;
    this.orgCd = orgCd;
    this.svcCd = 'B1003';
    this.dispNm = dispNm;
    this.userId = loginId;
    this.userPw = decryptPW;
    this.customerType = customerType;
    this.cicNo = cicId;
    this.taxNo = '';
    this.cmtNo = _passportNumber ? _passportNumber : taxCode;
    this.reportType = reportType;
    this.voteNo = voteNo;
    this.reqStatus = reqStatus;
    this.inqDt1 = inqDt1;
    this.inqDt2 = inqDt2;
    this.step_useYn = step_useYn;
    this.step_input = step_input;
    this.step_data = step_data;
    this.niceSessionKey = niceSessionKey;
    this.sendTime = dateutil.timeStamp();

}
