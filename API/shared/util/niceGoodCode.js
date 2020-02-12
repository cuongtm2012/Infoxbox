const responcodeEXT = require('../constant/responseCodeExternal');

module.exports = {
    niceProductCode: function (cicGoodCode) {
        var productCode;

        switch (cicGoodCode) {
            case "06":
                productCode = responcodeEXT.NiceProductCode.S11A.code;
                break;

            default:
                productCode = responcodeEXT.NiceProductCode.S11A.code;
        }

        return productCode;
    }
}