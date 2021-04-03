import dateutil from '../util/dateutil.js';

function CIC_MACR_RQSTRequest(parameters, niceSessionKey) {
    const {
        fiSessionKey,
        fiCode,
        taskCode,
        name,
        mobilePhoneNumber,
        inquiryDate,
        infoProvConcent
    } = parameters;

    this.fiSessionKey = fiSessionKey ? fiSessionKey : "";
    this.fiCode = fiCode;
    this.taskCode = taskCode;
    this.name = name;
    this.mobilePhoneNumber = mobilePhoneNumber;
    this.inquiryDate = inquiryDate ? inquiryDate : dateutil.getCurrentInquiryDate();
    this.infoProvConcent = infoProvConcent;
    this.niceSessionKey = niceSessionKey;
}

export default CIC_MACR_RQSTRequest;
