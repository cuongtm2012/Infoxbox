const dateutil = require('../util/dateutil');
module.exports = function simpleLimitPostBody(fiCode, niceSsKey, phoneNumber, natID, joinDate, salary) {
    this.serviceName = 'OKF_CSS_ASS';
    this.custNo = fiCode;
    this.recvNo = niceSsKey;
    this.listInput = {
        A0001: phoneNumber,
        A0002: natID,
        A0003: '1',
        A0004: '1',
        A0005: joinDate,
        A0006: parseFloat(salary)
    }
}