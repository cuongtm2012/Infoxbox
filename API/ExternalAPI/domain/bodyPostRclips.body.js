const dateutil = require('../util/dateutil');
const config = require('../config/config');
module.exports = function bodyPostRclips(custNo,niceSsKey,phoneNumber, NationId, Review_type, Financial_type, VMG_Score, VMG_Grade_Telco_Grade, Zalo_Score, CIC_Score, Grade_IB_CB_Grade, VMG_Monthly_Income) {
    this.serviceName = config.serviceNameOKF;
    this.custNo = custNo;
    this.recvNo = niceSsKey;
    this.listInput = {
        A0001: phoneNumber,
        A0002: NationId,
        A0003: Review_type,
        A0004: Financial_type,
        AC001: VMG_Score,
        AC002: VMG_Grade_Telco_Grade,
        AC003: Zalo_Score,
        AC005: CIC_Score,
        AC006: Grade_IB_CB_Grade,
        AC007: VMG_Monthly_Income
    }
}