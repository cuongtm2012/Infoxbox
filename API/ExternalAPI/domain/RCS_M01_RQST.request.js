const dateutil = require('../util/dateutil');

module.exports = function RCS_M01_RQSTRequest(parameters, niceSessionKey) {
    const {
		appNumber,
        fiCode,
        taskCode,
		customerNumber,
        productCode,
		nfGrade,
		cicNiceSessionKey,
        mobilePhoneNumber,
		homeAddress,
		workAddress,
		referAddress,
        infoProvConcent
    } = parameters;



    this.appNumber = appNumber ? appNumber : "";
    this.fiCode = fiCode;
    this.taskCode = taskCode;
    this.customerNumber = customerNumber;
    this.productCode = productCode;
    this.nfGrade = nfGrade;
    this.cicNiceSessionKey = cicNiceSessionKey;
    this.mobilePhoneNumber = mobilePhoneNumber;
    this.homeAddress = homeAddress;
    this.workAddress = workAddress;
    this.referAddress = referAddress;
    this.infoProvConcent = infoProvConcent;
	this.niceSessionKey = niceSessionKey;
};