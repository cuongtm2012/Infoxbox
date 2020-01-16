
const CARDDEFINEBALANCE = {
    TOTCreditCardLimit: { value: 0, name: "Tổng hạn mức thẻ tín dụng" },
    TOTAmountCardPayment: { value: 1, name: "Tổng số tiền phải thanh toán thẻ" },
    TOTAmountCardPaymentDeplay: { value: 2, name: "Tổng số tiền chậm thanh toán thẻ" },
    CreditCardNumber: { value: 3, name: "Số lượng thẻ tín dụng" },
    NameOfCardIssuer: { value: 4, name: "Tên tổ chức phát hành thẻ" }
};

const LOANTERM = {
    ShortTerm: { value: 0, name: "Dư nợ cho vay ngắn hạn" },
    MidTerm: { value: 1, name: "Dư nợ cho vay trung hạn" },
    LongTerm: { value: 2, name: "Dư nợ cho vay dài hạn" },
    TotalFILoan: { value: 3, name: "Tổng cộng" },
    ReportDate: { value: 4, name: "Ngày báo cáo gần nhất" },
    CompanyName: { value: 5, name: "1." }
};

const mappingData = {
    "Dư nợ cho vay ngắn hạn:": {
        vnd: 'shortTermLoanVnd',
        usd: 'shortTermLoanUsd'
    },
    "Dư nợ cho vay trung hạn:": {
        vnd: 'midTermLoadnInVnd',
        usd: 'midTermLoadnInUsd'
    },
    "Dư nợ cho vay dài hạn:": {
        vnd: 'longTermLoanVnd',
        usd: 'longTermLoanUsd'
    },
    "Dư nợ xấu khác": {
        vnd: "otherBadLoanVnd",
        usd: "otherBadLoanUsd"
    }
};

module.exports.CARDDEFINEBALANCE = CARDDEFINEBALANCE;
module.exports.LOANTERM = LOANTERM;
module.exports.mappingData = mappingData;