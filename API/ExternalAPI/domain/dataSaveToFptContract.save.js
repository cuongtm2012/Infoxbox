const dateutil = require('../util/dateutil');
module.exports = function dataSaveToFptContract(niceSsKey, id, custCd) {
    this.NICE_SSIN_ID = niceSsKey;
    this.ID = id;
    this.CUST_CD = custCd;
    this.SYS_DTIM = dateutil.timeStamp();
}