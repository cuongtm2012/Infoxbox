const _ = require('lodash');
const mappingData = require('./consant');

module.exports = {
    getCollateral: function (listCollateral) {
        let result = [];
        // const resGroup = _.groupBy(listCollateral, "companyCode");
        _.forEach(listCollateral, val => {
            let t1 = [];
            _.forEach(mappingData.mappingDataCollateral, (val1, key1) => {
                if (_.startsWith(val.item, key1)) {
                    const keyForObj = val1;
                    if (!_.isEmpty(keyForObj)) {
                        const res = {
                            assetBackedLoanGuarantee: val.item,
                            numberOfCollateral: val.content,
                            numberOfFiWithCollateral: val.content
                        };
                        t1.push(res);
                    }
                }
            });
            if (!_.isEmpty(t1)) result.push(_.merge.apply(null, [{}].concat(t1)));
        });
        return result;
    }
}
