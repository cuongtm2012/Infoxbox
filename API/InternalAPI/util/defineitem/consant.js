
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
        vnd: 'midTermLoadVnd',
        usd: 'midTermLoadUsd'
    },
    "Dư nợ cho vay dài hạn:": {
        vnd: 'longTermLoanVnd',
        usd: 'longTermLoanUsd'
    },
    "Dư nợ xấu khác:": {
        vnd: "otherBadLoanVnd",
        usd: "otherBadLoanUsd"
    },
    "- Dư nợ đủ tiêu chuẩn": {
        vnd: "TermNormalLoanVnd",
        usd: "TermNormalLoanUsd"
    },
    "- Dư nợ cần chú ý": {
        vnd: "TermCautiousLoanVnd",
        usd: "TermCautiousLoanUsd"
    },
    "- Dư nợ dưới tiêu chuẩn": {
        vnd: "TermFixedLoanVnd",
        usd: "TermFixedLoanUsd"
    },
    "- Dư nợ nghi ngờ": {
        vnd: "TermDaubtLoanVnd",
        usd: "TermDaubtLoanUsd"
    },
    "- Dư nợ có khả năng mất vốn": {
        vnd: "TermEstLossLoanVnd",
        usd: "TermEstLossLoanUsd"
    }
};

const mappingDataCollateral = {
    assetBackedLoanGuarantee: 'Bảo đảm tiền vay bằng tài sản',
    numberOfCollateral: 'Số lượng tài sản bảo đảm',
    numberOfFiWithCollateral: 'Số TCTD có tài sản bảo đảm',

};

const mappingCard3Year = {
    borrowCreditCardArrear: 'Khách hàng có chậm thanh toán thẻ',
    creditCardLongestArrearDays: 'Số ngày chậm thanh toán thẻ lớn nhất',
    creditCardArrearCount: 'Số lần chậm thanh toán thẻ'
}

module.exports.CARDDEFINEBALANCE = CARDDEFINEBALANCE;
module.exports.LOANTERM = LOANTERM;
module.exports.mappingData = mappingData;
module.exports.mappingDataCollateral = mappingDataCollateral;
module.exports.mappingCard3Year = mappingCard3Year;