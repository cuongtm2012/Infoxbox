module.exports = function RCS_M01_RQSTResponse(RCS_M01_RQSTRequest, response, ReviewResultRes, result7Day, result30Day, result90Day, Coordinates) {

    const {
        responseMessage,
        niceSessionKey,
        responseTime,
        responseCode
    } = response;

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
        inquiryDate,
        infoProvConcent
    } = RCS_M01_RQSTRequest;

	const {//Review result
        finalGrade,
		finalLoanApproval,	
		loanLimit,
    } = ReviewResultRes;
		
	
	const {//Coordinates
        homeAddressRv,
		homeLatitude,
		homeLongtitude,
		workAddressRv,
		workLatitude,
		workLongtitude,
		referAddressRv,
		referLatitude,
		referLongtitude,
		telcoCompany
    } = Coordinates;

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
    this.inquiryDate = inquiryDate ? inquiryDate : "";
    this.infoProvConcent = infoProvConcent;
    this.niceSessionKey = niceSessionKey ? niceSessionKey : "";
    this.responseTime = responseTime ? responseTime : "";
    this.responseCode = responseCode ? responseCode : "";
    this.responseMessage = responseMessage ? responseMessage : "";

	this.finalGrade = finalGrade;
	this.finalLoanApproval = finalLoanApproval;
	this.loanLimit = loanLimit;
	this.result7Day = result7Day;
	this.result30Day = result30Day;
	this.result90Day = result90Day;
	
	this.homeAddressRv = homeAddressRv ? homeAddressRv : "";
	this.homeLatitude = homeLatitude ? homeLatitude : "";
	this.homeLongtitude = homeLongtitude ? homeLongtitude : "";
	this.workAddressRv= workAddressRv ? workAddressRv : "";
	this.workLatitude = workLatitude ? workLatitude : "";
	this.workLongtitude = workLongtitude ? workLongtitude : "";
	this.referAddressRv = referAddressRv ? referAddressRv : "";
	this.referLatitude = referLatitude ? referLatitude : "";
	this.referLongtitude = referLongtitude ? referLongtitude : "";
	this.telcoCompany = telcoCompany ? telcoCompany : "";
			
};


