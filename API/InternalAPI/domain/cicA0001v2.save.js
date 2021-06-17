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
        detailKhaiThacDTOS,
        ratings
    } = params;

    const {
        inquiryDate,
        niceSessionKey
    } = request;
    let relatedFiName = '', totalDebtVnd = 0, totalDebtUsd = 0,
        totalBadDebtVnd = 0, totalBadDebtUsd = 0, creditCardBalance = 0, badDebtCredit = 0;
    if (detailKhaiThacDTOS[0]) {
        for (const element of detailKhaiThacDTOS) {
            if(element.tenTCTD)
                relatedFiName += element.tenTCTD + ', ';
            if (element.tongDuNoVnd)
                totalDebtVnd += parseFloat(element.tongDuNoVnd);
            if (element.tongDuNoUsd)
                totalDebtUsd += parseFloat(element.tongDuNoUsd);
            if (element.noXauVnd)
                totalBadDebtVnd += parseFloat(element.noXauVnd);
            if (element.noXauUsd)
                totalBadDebtUsd += parseFloat(element.noXauUsd);
            if (element.duNoThe)
                creditCardBalance += parseFloat(element.duNoThe);
            if (element.duNoTheChamtt)
                badDebtCredit += parseFloat(element.duNoTheChamtt);
        }
    }
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
    this.relatedFiName = relatedFiName;
    this.inquiryDate = inquiryDate ? inquiryDate : null;
    this.totalDebtVnd = totalDebtVnd;
    this.totalDebtUsd = totalDebtUsd;
    this.totalBadDebtVnd = totalBadDebtVnd;
    this.totalBadDebtUsd = totalBadDebtUsd;
    this.totalBadDebtVndOther = null;
    this.totalBadDebtUsdOther = null;
    this.creditCardBalance = creditCardBalance;
    this.badDebtCredit = badDebtCredit;
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
