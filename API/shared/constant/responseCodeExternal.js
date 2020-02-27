
var RESCODEEXT = {
    NORMAL: { value: 0, name: "Normal", code: "P000" },
    INPROCESS: { value: 100, name: "In process", code: "0000" },
    NIFICODE: { value: 1, name: "Need to input mandatory item(FI code)", code: "F001" },
    NICICCODE: { value: 2, name: "Need to input mandatory item(CIC product  code)", code: "F002" },
    IVFICODE: { value: 3, name: "Invalid FI code", code: "F003" },
    IVCICCODE: { value: 4, name: "Invalid CIC product code", code: "F004" },
    NILOGINID: { value: 5, name: "Need to input mandatory item(log in ID)", code: "F005" },
    NIPASSWORD: { value: 6, name: "Need to input mandatory item(log in Password)", code: "F006" },
    CICSiteLoginFailure: { value: 7, name: "CIC site log in failure", code: "F007" },
    CICSiteAccessFailure: { value: 8, name: "CIC site log in failure", code: "F008" },
    ConsentProvisionIsNotValid: { value: 9, name: "Consent of data provision is not valid", code: "F009" },
    NoMatchingCICIDWithNalID: { value: 11, name: "No matching CIC ID with input National ID", code: "F011" },
    NotUniquePersonInCIC: { value: 12, name: "Not unique person in CIC ID with input value", code: "F012" },
    CaptchaProcessFailure: { value: 13, name: "Captcha processing failure", code: "F013" },
    CICReportInqFailure: { value: 14, name: "CIC Report inquiry failure(from CIC site)", code: "F014" },
    CICReportInqFailureTimeout: { value: 16, name: "CIC Report result inquiry failure(timeout)", code: "F016" },
    SearchDateFrom: { value: 36, name: "Need to input mandatory item(searchDateFrom)", code: "F036" },
    S37ReportScreenAccsError: { value: 35, name: "S37 report screen access error", code: "F035" },
    SearchDateTo: { value: 37, name: "Need to input mandatory item(searchDateTo)", code: "F037" },
    ETCError: { value: 99, name: "ETC Error", code: "F099" },
    NITASKCODE: { value: 18, name: "Need to input mandatory item(Task code)", code: "F018" },
    NINICESESSIONKEY: { value: 19, name: "Need to input mandatory item(NICE session key)", code: "F019" },
    InvalidTaskCode: { value: 20, name: "Invalid task code", code: "F020" },
    NOTEXIST: { value: 21, name: "No result for input NICE session key", code: "F021" },
    InvalidNiceProductCode: { value: 22, name: "Invalid NICE product code(no contract for this product)", code: "F022" },
    CICReportInqReqFaliure: { value: 25, name: "CIC report inquiry request failure(timeout)", code: "F025" },
    NINAME: { value: 26, name: "Need to input mandatory item(Name)", code: "F026" },
    NIMOBILEPHONENUMBER: { value: 27, name: "Need to input mandatory item(Mobile phone number)", code: "F027" },
    ErrorDecryptError: { value: 33, name: "Login password decrypt error", code: "F033" },
    DuplicateAppOfCICReportADay: { value: 34, name: "Duplicated application of CIC report in a day", code: "F034" },
    InvalidMobileNumber: { value: 44, name: "Invalid mobile number", code: "F044" },
    UNKNOW: { value: 400, name: "UNKNOW (No result query)", code: "400" },
    NIS11ARQSTNOTNULL: { value: 17, name: "Need to input mandatory one of five item (Tax code, National ID, Old natiomal ID, Passport number, CIC ID)", code: "F017" },
    CICMobileAppLoginFailure: { value: 28, name: "CIC Mobile app log in failure", code: "F028" },
    CICMobileAppAccessFailure: { value: 29, name: "CIC Mobile app access failure", code: "F029" },
    INQDateInvalid: { value: 39, name: "searchDateFrom should be same or earlier than searchDateTo", code: "F039" },
    CICMobileAppScrapingTargetReportNotExist: { value: 30, name: "CIC Mobile app scraping target report does not exist", code: "F030" },
    FiCodeOverLength: { value: 50, name: "fiCode length is over 10", code: "F050" },
    TaskCodeOverLength: { value: 51, name: "taskCode length is over 10", code: "F051" }
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

const ScrappingResponseCodeLoginFailure = {
    LoginFail1: { code: 'LOGIN-001', errMsg: '[LOGIN-001] login page check fail', value: 1 },
    LoginFail2: { code: 'LOGIN-002', errMsg: '[LOGIN-002] login page check fail', value: 2 },
    LoginFail3: { code: 'LOGIN-003', errMsg: '[LOGIN-003] Login Fail.', value: 3 },
    LoginFail4: { code: 'LOGIN-004', errMsg: '[LOGIN-004] Login Fail.', value: 4 },
    LoginFail5: { code: 'LOGIN-005', errMsg: '[LOGIN-005] Login Fail.', value: 5 },
    LoginFail6: { code: 'LOGIN-006', errMsg: '[LOGIN-006] Menu Check Fail - Hỏi trả lời tin khách hàng', value: 6 },
    LoginFail7: { code: 'LOGIN-007', errMsg: '[LOGIN-007] Menu Check Fail - S37- Cảnh báo khách hàng vay', value: 7 }
};

const ScrappingResponseCodeCicINQError = {
    CicIdINQError1: { code: 'B0001-001', errMsg: '[B0001-001] page check fail', value: 1 },
    CicIdINQError2: { code: 'B0001-002', errMsg: '[B0001-002] page check fail', value: 2 },
    CicIdINQError3: { code: 'B0001-003', errMsg: '[B0001-003] CIC No Search Fail', value: 3 },
    CicIdINQError4: { code: 'B0001-004', errMsg: '[B0001-004] Captcha input error.', value: 4 }
};

const ScrappingResponseCodeCicReportINQError = {
    CicReportINQError1: { code: 'B0002-001', errMsg: '[B0002-001] page check fail', value: 1 },
    CicReportINQError2: { code: 'B0002-002', errMsg: '[B0002-002] page check fail', value: 2 },
    CicReportINQError3: { code: 'B0002-003', errMsg: '[B0002-003] CIC No Search Fail', value: 3 },
    CicReportINQError101: { code: 'B0002-101', errMsg: '[B0002-101] Multiple CIC No.', value: 101 },
    CicReportINQError102: { code: 'B0002-102', errMsg: '[B0002-102] page check fail', value: 102 },
    CicReportINQError103: { code: 'B0002-103', errMsg: '[B0002-103] page check fail', value: 103 },
    CicReportINQError104: { code: 'B0002-104', errMsg: '[B0002-104] Name Search Fail', value: 104 },
    CicReportINQError105: { code: 'B0002-105', errMsg: '[B0002-105] Name Search Fail', value: 105 },
    CicReportINQError106: { code: 'B0002-106', errMsg: '[B0002-106] Name Search Fail', value: 106 },
    CicReportINQError107: { code: 'B0002-107', errMsg: "[B0002-107] Customer's inquiry may overlap with the last 1 day: Duplicate condition", value: 107 },
    CicReportINQError108: { code: 'B0002-108', errMsg: '[B0002-108] success or fail', value: 108 },
    CicReportINQError201: { code: 'B0002-201', errMsg: '[B0002-201] No result for CIC No', value: 201 }
};

const ScrappingResponseCodeCicReportResultINQError = {
    CicReportResultINQError1: { value: 1, errMsg: '[B0003-001] page check fail', code: 'B0003-001' },
    CicReportResultINQError2: { value: 2, errMsg: '[B0003-002] page check fail', code: 'B0003-002' }
};

const ScrappingResponseCodeCicReportResultINQS37Error = {
    CicReportINQError1: { code: 'B1003-001', errMsg: '[B1003-001] page check fail', value: 1 },
    CicReportINQError2: { code: 'B1003-002', errMsg: '[B1003-002] page check fail', value: 2 },
    CicReportINQError3: { code: 'B1003-003', errMsg: '[B1003-003] CIC No Search Fail', value: 3 },
    CicReportINQError101: { code: 'B1003-101', errMsg: '[B1003-101] Multiple CIC No.', value: 101 },
    CicReportINQError102: { code: 'B1003-102', errMsg: '[B1003-102] page check fail', value: 102 },
    CicReportINQError103: { code: 'B1003-103', errMsg: '[B1003-103] page check fail', value: 103 },
    CicReportINQError104: { code: 'B1003-104', errMsg: '[B1003-104] Name Search Fail', value: 104 },
    CicReportINQError105: { code: 'B1003-105', errMsg: '[B1003-105] Name Search Fail', value: 105 },
    CicReportINQError106: { code: 'B1003-106', errMsg: '[B1003-106] page check fail', value: 106 },
    CicReportINQError107: { code: 'B1003-107', errMsg: "[B1003-107] report check fail", value: 107 },
    CicReportINQError108: { code: 'B1003-108', errMsg: '[B1003-108] Captcha input error.', value: 108 },
    CicReportINQError201: { code: 'B1003-201', errMsg: '[B1003-201] CIC No not found.', value: 201 }
};

const ScrapingStatusCode = {
    LoginInError: { code: '20' },
    CicIdInqError: { code: '21' },
    CicReportInqError: { code: '22' },
    CicReportResultInqError: { code: '23' },
    OtherError: { code: '29' }
};

const TaskCode = {
    CIC_S11A_RQST: { code: 'CIC_S11A_RQST' },
    CIC_S11A_RSLT: { code: 'CIC_S11A_RSLT' },
    CIC_S37_RQST: { code: 'CIC_S37_RQST' },
    CIC_S37_RSLT: { code: 'CIC_S37_RSLT' },
    CIC_MACR_RQST: { code: 'CIC_MACR_RQST' },
    CIC_MACR_RSLT: { code: 'CIC_MACR_RSLT' },
    CIC_PROC_STAT: { code: 'CIC_PROC_STAT' }
};

const ProductCode = ['06'];

const InfoProvConcent = ['Y'];

const NiceProductCode = {
    S11A: { code: 'S1001' },
    S37: { code: 'S1002' },
    Mobile: { code: 'S1003' }
};

module.exports.RESCODEEXT = RESCODEEXT;
module.exports.SCRAPPINGERRORCODE = SCRAPPINGERRORCODE;
module.exports.ScrappingResponseCodeLoginFailure = ScrappingResponseCodeLoginFailure;
module.exports.ScrappingResponseCodeCicINQError = ScrappingResponseCodeCicINQError;
module.exports.ScrappingResponseCodeCicReportINQError = ScrappingResponseCodeCicReportINQError;
module.exports.ScrappingResponseCodeCicReportResultINQError = ScrappingResponseCodeCicReportResultINQError;
module.exports.ScrappingResponseCodeCicReportResultINQS37Error = ScrappingResponseCodeCicReportResultINQS37Error;
module.exports.ScrapingStatusCode = ScrapingStatusCode;
module.exports.TaskCode = TaskCode;
module.exports.ProductCode = ProductCode;
module.exports.InfoProvConcent = InfoProvConcent;
module.exports.NiceProductCode = NiceProductCode;