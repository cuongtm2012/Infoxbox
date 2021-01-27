module.exports = function mainScoreResponseWithResult(RCS_M01_RQSTRequest, preResponse, resultCAC1, resultRclips) {
    let result7Day = [];
    let result30Day = [];
    let result90Day = [];
    if (resultCAC1.result.resLocation.result7Day) {
        for (const element of resultCAC1.result.resLocation.result7Day) {
            let body = {
                homePercent: element.homepercent,
                workPercent: element.workpercent,
                referPercent: element.referpercent,
                timeRange: element.timerange
            }
            result7Day.push(body);
        }
    }

    if (resultCAC1.result.resLocation.result30Day) {
        for (const element of resultCAC1.result.resLocation.result30Day) {
            let body = {
                homePercent: element.homepercent,
                workPercent: element.workpercent,
                referPercent: element.referpercent,
                timeRange: element.timerange
            }
            result30Day.push(body);
        }
    }
    if (resultCAC1.result.resLocation.result90Day) {
        for (const element of resultCAC1.result.resLocation.result90Day) {
            let body = {
                homePercent: element.homepercent,
                workPercent: element.workpercent,
                referPercent: element.referpercent,
                timeRange: element.timerange
            }
            result90Day.push(body);
        }
    }
    const {
        responseMessage,
        niceSessionKey,
        responseTime,
        responseCode
    } = preResponse;

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
    } = RCS_M01_RQSTRequest;

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
    this.niceSessionKey = niceSessionKey ? niceSessionKey : "";
    this.responseTime = responseTime ? responseTime : "";
    this.responseCode = responseCode ? responseCode : "";
    this.responseMessage = responseMessage ? responseMessage : "";
//    loan approval result
    this.finalGrade = resultRclips.OT006;
    this.finalLoanApproval = resultRclips.OT011;
    this.loanLimit = resultRclips.OT010;
//  day result
    this.result7Day = result7Day;
    this.result30Day = result30Day;
    this.result90Day = result90Day;
// coordinates
    this.homeAddressRv = resultCAC1.result.resCoordinates.home_address;
    this.homeLatitude = resultCAC1.result.resCoordinates.home_lat;
    this.homeLongtitude = resultCAC1.result.resCoordinates.home_long;
    this.workAddressRv = resultCAC1.result.resCoordinates.work_address;
    this.workLatitude = resultCAC1.result.resCoordinates.work_lat;
    this.workLongtitude = resultCAC1.result.resCoordinates.work_long;
    this.referAddressRv = resultCAC1.result.resCoordinates.refer_address;
    this.referLatitude = resultCAC1.result.resCoordinates.refer_lat;
    this.referLongtitude = resultCAC1.result.resCoordinates.refer_long;
    this.telcoCompany = resultCAC1.telco;
    this.addressCheckResult = resultCAC1.error_code.toString();
};