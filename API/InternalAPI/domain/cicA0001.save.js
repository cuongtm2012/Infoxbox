const _ = require('lodash');

module.exports = function (params, request) {
    const {
        fullName,
        dateOfBirth,
        cicCode,
        address,
        phoneNumber,
        identification,
        point,
        level,
        scoredDate,
        debtCredit,
        banks
    } = params;

    const {
        inquiryDate,
        niceSessionKey
    } = request;

    this.name = fullName ? fullName : null;
    this.dateOfBirth = dateOfBirth ? convertDate(dateOfBirth) : null;
    this.cicId = cicCode ? cicCode : null;
    this.address = address ? address : null;
    this.phoneNumber = phoneNumber ? phoneNumber : null;
    this.natId = identification ? identification : null;
    this.creditScore = point ? point : null;
    this.creditGrade = level ? level : null;
    this.baseDate = scoredDate ? convertDate(scoredDate) : null;
    this.creditCardBalance = debtCredit ? debtCredit : null;
    this.relatedFiName = banks ? banks : null;
    this.inquiryDate = inquiryDate ? inquiryDate : null;
    this.niceSessionKey = niceSessionKey;
}

function convertDate(date) {
    const regex = /[/]/g;
    if (0 <= _.indexOf(date, "/"))
        return date.replace(regex, "");
    else
        return date;
}