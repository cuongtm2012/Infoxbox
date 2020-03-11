const responcodeEXT = require('../constant/responseCodeExternal');

module.exports = {
    niceProductCode: function (taskCode) {
        var productCode;

        switch (taskCode) {
            case responcodeEXT.TaskCode.CIC_S11A_RQST.code:
                productCode = responcodeEXT.NiceProductCode.S11A.code;
                break;
            case responcodeEXT.TaskCode.CIC_S11A_RSLT.code:
                productCode = responcodeEXT.NiceProductCode.S11A.code;
                break;
            case responcodeEXT.TaskCode.CIC_S37_RQST.code:
                productCode = responcodeEXT.NiceProductCode.S37.code;
                break;
            case responcodeEXT.TaskCode.CIC_S37_RSLT.code:
                productCode = responcodeEXT.NiceProductCode.S37.code;
                break;
            case responcodeEXT.TaskCode.CIC_MACR_RQST.code:
                productCode = responcodeEXT.NiceProductCode.Mobile.code;
                break;
            case responcodeEXT.TaskCode.CIC_MACR_RSLT.code:
                productCode = responcodeEXT.NiceProductCode.Mobile.code;
                break;
            default:
                productCode = '';
        }

        return productCode;
    }
}