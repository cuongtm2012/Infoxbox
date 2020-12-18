const dateutil = require('../util/dateutil');

module.exports = function OKF_SPL_RQSTRequest(parameters, niceSessionKey) {
    const {
        fiSessionKey,
        fiCode,
        taskCode,
		customerNumber,
        name,
		sex,
        mobilePhoneNumber,
		natId,
		salary,
		joinDate,
        inquiryDate,
        infoProvConcent
    } = parameters;

    this.fiSessionKey = fiSessionKey ? fiSessionKey : "";
    this.fiCode = fiCode;
    this.taskCode = taskCode;
    this.customerNumber = customerNumber;
    this.name = name;
    this.sex = sex;
    this.mobilePhoneNumber = mobilePhoneNumber;
    this.natId = natId;
    this.salary = salary;
    this.joinDate = joinDate;
    this.inquiryDate = inquiryDate ? inquiryDate : dateutil.getCurrentInquiryDate();
    this.infoProvConcent = infoProvConcent;
    this.niceSessionKey = niceSessionKey;
};