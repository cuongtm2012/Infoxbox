module.exports = function phoneClass (phone) {
    const {
        MSGKEY,
        COMPKEY,
        PHONE,
        STATUS_SMS,
        INPUT_DATE,
        SEND_DATE,
        RSLT_DATE,
        RSLT,
        MSG,
        TYPE_SMS
    } = phone;

    this.MSGKEY = MSGKEY;
    this.COMPKEY = COMPKEY;
    this.PHONE = PHONE;
    this.STATUS_SMS = STATUS_SMS;
    this.INPUT_DATE = INPUT_DATE;
    this.SEND_DATE = SEND_DATE;
    this.RSLT_DATE = RSLT_DATE;
    this.RSLT = RSLT;
    this.MSG = MSG;
    this.TYPE_SMS = TYPE_SMS;
}