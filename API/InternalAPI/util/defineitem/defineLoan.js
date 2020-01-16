const mappingData = require('./consant');
const _ = require('lodash');

module.exports = {
    getLoanDetail: function (listLoanDetail) {
        let result = [];
        const resGroup = _.groupBy(listLoanDetail, "companyCode");
        _.forEach(resGroup, val => {
            let t1 = [];
            _.forEach(val, arrVal => {
                _.forEach(mappingData.mappingData, (val1, key1) => {
                    if (_.startsWith(arrVal.item, key1)) {

                        const keyForObj = val1;
                        if (!_.isEmpty(keyForObj)) {
                            console.log('keyForObj:', keyForObj);
                            const res = {
                                cicFiName: arrVal.company,
                                cicFiCode: arrVal.companyCode,
                                recentReportDate: arrVal.date,
                                seq: arrVal.seq,
                                [keyForObj.vnd]: arrVal.vnd,
                                [keyForObj.usd]: arrVal.usd
                            };
                            t1.push(res);
                        }
                    }
                })

            });
            if (!_.isEmpty(t1)) result.push(_.merge.apply(null, [{}].concat(t1)));
        });
        console.log("Loan detail result:", result);
        return result;
    }
}