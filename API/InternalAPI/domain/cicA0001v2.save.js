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
        vamc,
        debtCredit,
        detailKhaiThacDTOS,
        ratings
    } = params;

    const {
        inquiryDate,
        niceSessionKey
    } = request;

    this.niceSessionKey = niceSessionKey;
    this.name = fullName ? fullName : null;
    this.dateOfBirth = dateOfBirth ? convertDate(dateOfBirth) : null;
    this.cicId = cicCode ? cicCode : null;
    this.address = address ? address : null;
    this.phoneNumber = phoneNumber ? phoneNumber : null;
    this.natId = identification ? identification : null;
    this.creditScore = point ? point : null;
    this.creditGrade = level ? level : null;
    this.baseDate = scoredDate ? convertDate(scoredDate) : null;
    this.relatedFiName = detailKhaiThacDTOS[0] ? detailKhaiThacDTOS[0].tenTCTD : null;
    this.inquiryDate = inquiryDate ? inquiryDate : null;
    this.totalDebtVnd = detailKhaiThacDTOS[0] ? detailKhaiThacDTOS[0].tongDuNoVnd : null;
    this.totalDebtUsd = detailKhaiThacDTOS[0] ? detailKhaiThacDTOS[0].tongDuNoUsd : null;
    this.totalBadDebtVnd = detailKhaiThacDTOS[0] ? detailKhaiThacDTOS[0].noXauVnd : null;
    this.totalBadDebtUsd = detailKhaiThacDTOS[0] ? detailKhaiThacDTOS[0].noXauUsd : null;
    this.totalBadDebtVndOther = null;
    this.totalBadDebtUsdOther = null;
    this.creditCardBalance = debtCredit ? debtCredit : null;
    this.badDebtCredit = detailKhaiThacDTOS[0] ? detailKhaiThacDTOS[0].duNoTheChamtt : null;
    this.vamc = vamc ? vamc : null;
    this.percentile = ratings ? ratings : null;
}

function convertDate(date) {
    const regex = /[/]/g;
    if (0 <= _.indexOf(date, "/"))
        return date.replace(regex, "");
    else
        return date;
}