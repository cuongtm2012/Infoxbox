const _ = require('lodash');
const constant = require('./consant');

module.exports = {
    getCollateral: function (listCollateral) {
        var res;
        var assetBackedLoanGuarantee, numberOfCollateral, numberOfFiWithCollateral;
        _.forEach(listCollateral, val => {
            if (_.startsWith(val.item, constant.mappingDataCollateral.assetBackedLoanGuarantee))
                assetBackedLoanGuarantee = val.content;

            if (_.startsWith(val.item, constant.mappingDataCollateral.numberOfCollateral))
                numberOfCollateral = val.content;

            if (_.startsWith(val.item, constant.mappingDataCollateral.numberOfFiWithCollateral))
                numberOfFiWithCollateral = val.content;
        });
        res = {
            assetBackedLoanGuarantee: assetBackedLoanGuarantee,
            numberOfCollateral: numberOfCollateral,
            numberOfFiWithCollateral: numberOfFiWithCollateral
        }

        return res;
    }
}
