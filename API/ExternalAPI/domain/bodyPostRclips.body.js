const dateutil = require('../util/dateutil');
module.exports = function bodyPostRclips(phoneNumber, NationId, Review_type, Financial_type, Start_Work_YMD, Montyly_income, custNo) {
    this.serviceName = 'NICE_CSS_ASS';
    this.custNo = custNo;
    this.recvNo = dateutil.timeStamp();
    this.listInput = {
        A0001: phoneNumber,
        A0002: NationId,
        A0003: Review_type,
        A0004: Financial_type,
        A0005: Start_Work_YMD,
        A0006: Montyly_income
    }
}