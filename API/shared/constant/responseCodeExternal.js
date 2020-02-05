
var RESCODEEXT = {
    NORMAL: { value: 0, name: "Normal", code: "P000" },
    INPROCESS: { value: 100, name: "In process", code: "0000" },
    NIFICODE: { value: 1, name: "Need to input mandatory item(FI code)", code: "F001" },
    NICICCODE: { value: 2, name: "Need to input mandatory item(CIC product  code)", code: "F002" },
    IVFICODE: { value: 3, name: "Invalid FI code", code: "F003" },
    IVCICCODE: { value: 4, name: "Invalid CIC product code", code: "F004" },
    NILOGINID: { value: 5, name: "Need to input mandatory item(log in ID)", code: "F005" },
    NIPASSWORD: { value: 6, name: "Need to input mandatory item(log in Password)", code: "F006" },
    NITASKCODE: { value: 18, name: "Need to input mandatory item(Task code)", code: "F018" },
    NINICESESSIONKEY: { value: 19, name: "Need to input mandatory item(NICE session key)", code: "F019" },
    NINAME: { value: 26, name: "Need to input mandatory item(Name)", code: "F026" },
    NIMOBILEPHONENUMBER: { value: 27, name: "Need to input mandatory item(Mobile phone number)", code: "F027" },
    UNKNOW: { value: 400, name: "UNKNOW", code: "400" },
    NOTEXIST: { value: 21, name: "No result for input NICE session key", code: "F021" },
    NIS11ARQSTNOTNULL: { value: 17, name: "Need to input mandatory one of five item (Tax code, National ID, Old natiomal ID, Passport number, CIC ID)", code: "F017" }
};

var SCRAPPINGERRORCODE = {
    SMSdidNotReqInq: { value: 0, name: "SMS sent and did not request report inquiry", code: "00" },
    ReportInqSuccess: { value: 1, name: "Report inquiry request successful", code: "01" },
    CICLogInSuccess: { value: 2, name: "CIC site log in successful", code: "02" },
    CICIDInqSuccess: { value: 3, name: "CIC ID inquiry successful", code: "03" },
    CICReportInqSuccess: { value: 4, name: "CIC report inquiry successful", code: "04" },
    Complete: { value: 10, name: "Complete", code: "10" },
    LogInError: { value: 20, name: "Log in error", code: "20" },
    CICIDInqError: { value: 21, name: "CIC ID inquiry error", code: "21" },
    CICReportInqError: { value: 22, name: "CIC report inquiry error", code: "22" },
    CICReportResultInqError: { value: 23, name: "CIC report result inquiry error", code: "23" },
    ScrappingTargetReportNotExist: { value: 24, name: "Scraping target report does not exist", code: "24" },
    OtherError: { value: 29, name: "Other error", code: "29" }
};

module.exports.RESCODEEXT = RESCODEEXT;
module.exports.SCRAPPINGERRORCODE = SCRAPPINGERRORCODE;