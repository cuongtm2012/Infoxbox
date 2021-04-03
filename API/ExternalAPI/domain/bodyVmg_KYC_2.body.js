import config from '../config/config.js';
export function bodyPostVmgKYC2(natId) {
    this.cmd = config.Vmg_Kyc_2.DEV_cmd;
    this.idCard = natId;
    this.idCard1 = "";
    this.name = "";
    this.token = config.VmgToken.Dev_Token;
    this.serviceCode = config.Vmg_Kyc_2.DEV_serviceCode
}