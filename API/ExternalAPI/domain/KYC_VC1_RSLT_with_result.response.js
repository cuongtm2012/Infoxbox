module.exports = function KYC_VC1_RSLT_withResult_Response
    (Request, preResponse, processStatusCode, processStatusMessage,
     rs7Day, rs30Day, rs90Day, homeAddressRv, homeLatitude, homeLongtitude, workAddressRv, workLatitude, workLongtitude,
     referAddressRv, referLatitude, referLongtitude, telcoCompany ) {
    let rs7DayConvertJson = JSON.parse(rs7Day);
    let rs30DayConvertJson = JSON.parse(rs30Day);
    let rs90DayConvertJson = JSON.parse(rs90Day);

    let result7Day = [
        {
            homePercent: rs7DayConvertJson[0].homepercent,
            workPercent: rs7DayConvertJson[0].workpercent,
            referPercent: rs7DayConvertJson[0].referpercent,
            timeRange: rs7DayConvertJson[0].timerange,
        },
        {
            homePercent: rs7DayConvertJson[1].homepercent,
            workPercent: rs7DayConvertJson[1].workpercent,
            referPercent: rs7DayConvertJson[1].referpercent,
            timeRange: rs7DayConvertJson[1].timerange,
        },
        {
            homePercent: rs7DayConvertJson[2].homepercent,
            workPercent: rs7DayConvertJson[2].workpercent,
            referPercent: rs7DayConvertJson[2].referpercent,
            timeRange: rs7DayConvertJson[2].timerange,
        },
        {
            homePercent: rs7DayConvertJson[3].homepercent,
            workPercent: rs7DayConvertJson[3].workpercent,
            referPercent: rs7DayConvertJson[3].referpercent,
            timeRange: rs7DayConvertJson[3].timerange,
        }
    ]

    let result30Day = [
        {
            homePercent: rs30DayConvertJson[0].homepercent,
            workPercent: rs30DayConvertJson[0].workpercent,
            referPercent: rs30DayConvertJson[0].referpercent,
            timeRange: rs30DayConvertJson[0].timerange,
        },
        {
            homePercent: rs30DayConvertJson[1].homepercent,
            workPercent: rs30DayConvertJson[1].workpercent,
            referPercent: rs30DayConvertJson[1].referpercent,
            timeRange: rs30DayConvertJson[1].timerange,
        },
        {
            homePercent: rs30DayConvertJson[2].homepercent,
            workPercent: rs30DayConvertJson[2].workpercent,
            referPercent: rs30DayConvertJson[2].referpercent,
            timeRange: rs30DayConvertJson[2].timerange,
        },
        {
            homePercent: rs30DayConvertJson[3].homepercent,
            workPercent: rs30DayConvertJson[3].workpercent,
            referPercent: rs30DayConvertJson[3].referpercent,
            timeRange: rs30DayConvertJson[3].timerange,
        }

    ]

    let result90Day = [
        {
            homePercent: rs90DayConvertJson[0].homepercent,
            workPercent: rs90DayConvertJson[0].workpercent,
            referPercent: rs90DayConvertJson[0].referpercent,
            timeRange: rs90DayConvertJson[0].timerange,
        },
        {
            homePercent: rs90DayConvertJson[1].homepercent,
            workPercent: rs90DayConvertJson[1].workpercent,
            referPercent: rs90DayConvertJson[1].referpercent,
            timeRange: rs90DayConvertJson[1].timerange,
        },
        {
            homePercent: rs90DayConvertJson[2].homepercent,
            workPercent: rs90DayConvertJson[2].workpercent,
            referPercent: rs90DayConvertJson[2].referpercent,
            timeRange: rs90DayConvertJson[2].timerange,
        },
        {
            homePercent: rs90DayConvertJson[3].homepercent,
            workPercent: rs90DayConvertJson[3].workpercent,
            referPercent: rs90DayConvertJson[3].referpercent,
            timeRange: rs90DayConvertJson[3].timerange,
        }
    ]
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
        mobilePhoneNumber,
        infoProvConcent
    } = Request;

    this.appNumber = appNumber ? appNumber : "";
    this.fiCode = fiCode ? fiCode : "";
    this.taskCode = taskCode ? taskCode : "";
    this.customerNumber = customerNumber ? customerNumber : "";
    this.mobilePhoneNumber = mobilePhoneNumber ? mobilePhoneNumber : "";
    this.niceSessionKey = niceSessionKey ? niceSessionKey : "";
    this.responseTime  = responseTime ? responseTime : "";
    this.responseCode = responseCode ? responseCode : "";
    this.responseMessage = responseMessage ? responseMessage : "";
    this.processStatusCode = processStatusCode;
    // this.processStatusMessage = processStatusMessage;
    this.result7Day = result7Day;
    this.result30Day = result30Day;
    this.result90Day = result90Day;
    this.homeAddressRv = homeAddressRv;
    this.homeLatitude = homeLatitude;
    this.homeLongtitude = homeLongtitude;
    this.workAddressRv = workAddressRv;
    this.workLatitude = workLatitude;
    this.workLongtitude = workLongtitude;
    this.referAddressRv = referAddressRv;
    this.referLatitude = referLatitude;
    this.referLongtitude = referLongtitude;
    this.telcoCompany = telcoCompany;

}
