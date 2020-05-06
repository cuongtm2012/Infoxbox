const _ = require('lodash');
const responcodeEXT = require('../../shared/constant/responseCodeExternal');

module.exports = {
    convertProductCodeToCicGoodCode: function (niceProductCode) {
        let cicGoodCode = niceProductCode;
        _.forEach(responcodeEXT.NiceProductCode, res => {
            if (niceProductCode == res.code || niceProductCode == res.code || niceProductCode == res.code) {
                cicGoodCode = '06';
                return cicGoodCode;
            }
        });

        return cicGoodCode;
    }
}