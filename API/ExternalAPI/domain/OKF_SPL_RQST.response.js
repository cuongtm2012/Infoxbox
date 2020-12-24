
module.exports = function OKF_SPL_RQSTResponse(OKF_SPL_RQSTRequest, response) {

    const {
        responseMessage,
        niceSessionKey,
        responseTime,
        responseCode
    } = response;

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
        infoProvConcent,
		simpleLimit
    } = OKF_SPL_RQSTRequest;

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
    this.infoProvConcent = infoProvConcent;
    this.simpleLimit = simpleLimit;
    this.niceSessionKey = niceSessionKey ? niceSessionKey : "";
    this.responseTime = responseTime ? responseTime : "";
    this.responseCode = responseCode ? responseCode : "";
    this.responseMessage = responseMessage ? responseMessage : "";
};
