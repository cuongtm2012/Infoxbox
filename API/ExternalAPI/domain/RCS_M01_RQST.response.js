module.exports = function RCS_M01_RQSTResponse(RCS_M01_RQSTRequest, response, ReviewResultRes, resultNDay, coordinates) {

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
		
	const {//result7Day
        homePercent7d,
		workPercent7d,
		referPercent7d,
		timeRange7d
    } = resultNDay;

	const {//result30Day
        homePercent30d,
		workPercent30d,
		referPercent30d,
		timeRange30d
    } = resultNDay;

	const {//result90Day
        homePercent90d,
		workPercent90d,
		referPercent90d,
		timeRange90d
    } = resultNDay;

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
    } = coordinates;

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

	this.homePercent7d = homePercent7d;
	this.workPercent7d = workPercent7d;
	this.referPercent7d = referPercent7d;
	this.timeRange7d = timeRange7d;
	
	this.homePercent30d = homePercent30d;
	this.workPercent30d = workPercent30d;
	this.referPercent30d = referPercent30d;
	this.timeRange30d = timeRange30d;
	
	this.homePercent90d = homePercent90d;
	this.workPercent90d = workPercent90d;
	this.referPercent90d = referPercent90d;
	this.timeRange90d = timeRange90d;
	
	
	this.homeAddressRv = homeAddressRv;
	this.homeLatitude = homeLatitude;
	this.homeLongtitude = homeLongtitude;
	this.workAddressRv= workAddressRv;
	this.workLatitude = workLatitude;
	this.workLongtitude = workLongtitude;
	this.referAddressRv = referAddressRv;
	this.referLatitude = referLatitude;
	this.referLongtitude = referLongtitude;
	this.telcoCompany = telcoCompany;
			
};
