const config = require('../config/config');
module.exports = function bodyPostVmgKYC2(natId) {
    this.cmd = 'kyc2_nice';
    this.idCard = natId;
    this.idCard1 = "";
    this.tinCode = "";
    this.name = "";
    this.token = config.VmgToken.Prod_Token;
    this.serviceCode = 'kyc2_nice'
}