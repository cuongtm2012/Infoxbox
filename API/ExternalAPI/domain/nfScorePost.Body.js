const dateutil = require('../util/dateutil');
module.exports = function NfScorePostBody(fiCode, niceSsKey,phoneNumber, natID, VMG_Score, VMG_Grade, Zalo_Score) {
    this.serviceName = 'OKF_CSS_ASS';
    this.custNo = fiCode;
    this.recvNo = niceSsKey;
    this.listInput = {
        A0001: phoneNumber,
        A0002: natID,
        A0003: '2',
        A0004: '1',
        AC001: VMG_Score,
        AC002: VMG_Grade,
        AC003: parseFloat(Zalo_Score)
    }
}