const config = require('../config/config');
module.exports = function bodyPostVmgKYC2(natId) {
    this.cmd = config.Vmg_Kyc_2.PROD_cmd;
    this.idCard = natId;
    this.idCard1 = "";
    this.tinCode = "";
    this.name = "";
    this.token = config.VmgToken.Prod_Token;
    this.serviceCode = config.Vmg_Kyc_2.PROD_serviceCode
}