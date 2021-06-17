const _ = require('lodash');

module.exports = function (params, request) {
    params = {
        "userType": "3",
        "dateProvide": "",
        "dateOfBirth": "01/07/1999",
        "identification": "272668558",
        "point": "487",
        "level": "7",
        "scoredDate": "21/05/2021",
        "classification": "S03",
        "ratings": "8",
        "fullName": "nguyễn huy thịnh",
        "cicCode": "7532681720",
        "address": "AN BINH TRUNG HOA TRANG BOM DONG NAI, XÃ TRUNG HOÀ, HUYỆN TRẢNG BOM, TỈNH ĐỒNG NAI",
        "phoneNumber": "0944216427",
        "debtCredit": "19",
        "badDebtCredit": "0",
        "type": "1",
        "detailKhaiThacDTOS": [
            {
                "code": "7532681720",
                "tenTCTD": "Ngân hàng TMCP Phát triển thành phố Hồ Chí Minh - Chi nhánh Đồng Nai",
                "maTCTD": "75321001",
                "ngayBaoCaoGanNhat": "10/05/2021",
                "tongDuNoVnd": "20",
                "tongDuNoUsd": "10",
                "noXauVnd": "2",
                "noXauUsd": "20",
                "duNoThe": "20",
                "duNoTheChamtt": "11",
                "index": "0",
                "type": "0"
            },
            {
                "code": "7532681720",
                "tenTCTD": "Công ty Tài chính Cổ phần Tín Việt",
                "maTCTD": "01828001",
                "ngayBaoCaoGanNhat": "30/04/2021",
                "tongDuNoVnd": "20",
                "tongDuNoUsd": "11",
                "noXauVnd": "12",
                "noXauUsd": "13",
                "duNoThe": "19",
                "duNoTheChamtt": "",
                "index": "1",
                "type": "0"
            },
            {
                "code": "7532681720",
                "index": "1",
                "trangThaiTS": "Không có",
                "type": "2"
            }
        ]
    }
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
