const mappingData = require('./consant');
const _ = require('lodash');
const shortLoanTerm = require('../../domain/loan/shortLoan');
const midLoanTerm = require('../../domain/loan/midLoan');
const longLoanTerm = require('../../domain/loan/longLoan');
const otherLoanTerm = require('../../domain/loan/otherLoan');

function getChildren(itemDetailInfo) {
    let result = [];
    _.forEach(itemDetailInfo, arrVal => {
        const itemDetailInfoKey = mappingData.mappingData[arrVal.item];
        const keyObj = itemDetailInfoKey.vnd.substring(
            0,
            itemDetailInfoKey.vnd.length - 3
        );
        const res = {
            [itemDetailInfoKey.vnd]: arrVal.vnd,
            [itemDetailInfoKey.usd]: arrVal.usd
        };
        result = { ...result, [keyObj]: res };
    });
    return result;
}
module.exports = {
    getLoanDetail: function (listLoanDetail) {
        const result = [];
        const resGroup = _.groupBy(listLoanDetail, "companyCode");

        _.forEach(resGroup, val => {
            let t1 = [];
            _.forEach(val, arrVal => {
                _.forEach(mappingData.mappingData, (val1, key1) => {
                    if (_.startsWith(arrVal.item, key1)) {

                        const keyForObj = val1;
                        if (!_.isEmpty(keyForObj)) {
                            let res = {
                                cicFiName: arrVal.company,
                                cicFiCode: arrVal.companyCode,
                                date: arrVal.date,
                                seq: arrVal.seq,
                                [keyForObj.vnd]: arrVal.vnd,
                                [keyForObj.usd]: arrVal.usd
                            };

                            const keyObjChild = keyForObj.vnd.substring(0, keyForObj.vnd.length - 3);
                            if (!_.isEmpty(arrVal.itemDetailInfo)) {
                                res[keyObjChild] = getChildren(arrVal.itemDetailInfo);
                            }
                            t1.push(res);
                        }
                    }
                });
            });

            if (!_.isEmpty(t1)) result.push(_.merge.apply(null, [{}].concat(t1)));
        });
        console.log("Loan detail result:", result);
        return result;
    },

    getDetailLoanTerm: function (listTermLoan) {
        let ShortLoanTerm, MidLoanTerm, LongLoanTerm, OtherLoanTerm;

        if (_.isEmpty(listTermLoan.shortTermLoan)) {
            ShortLoanTerm = {};
        }
        else if (!_.isEmpty(listTermLoan.shortTermLoan)) {
            console.log('listTermLoan.shortTermLoan', listTermLoan.shortTermLoan);
            let ShortTermNormalLoan, ShortTermCautiousLoan, ShortTermFixedLoan, ShortTermDaubtLoan, ShortTermEstLossLoan;

            if (_.isEmpty(listTermLoan.shortTermLoan.TermNormalLoan)) {
                ShortTermNormalLoan = {};
            } else {
                ShortTermNormalLoan = listTermLoan.shortTermLoan.TermNormalLoan;
            }
            if (_.isEmpty(listTermLoan.shortTermLoan.TermCautiousLoan)) {
                ShortTermCautiousLoan = {};
            } else {
                ShortTermCautiousLoan = listTermLoan.shortTermLoan.TermCautiousLoan;
            }
            if (_.isEmpty(listTermLoan.shortTermLoan.TermFixedLoan)) {
                ShortTermFixedLoan = {};
            } else {
                ShortTermFixedLoan = listTermLoan.shortTermLoan.TermFixedLoan;
            }
            if (_.isEmpty(listTermLoan.shortTermLoan.TermDaubtLoan)) {
                ShortTermDaubtLoan = {};
            } else {
                ShortTermDaubtLoan = listTermLoan.shortTermLoan.TermDaubtLoan;
            }
            if (_.isEmpty(listTermLoan.shortTermLoan.TermEstLossLoan)) {
                ShortTermEstLossLoan = {};
            } else {
                ShortTermEstLossLoan = listTermLoan.shortTermLoan.TermEstLossLoan;
            }

            ShortLoanTerm = new shortLoanTerm(ShortTermNormalLoan, ShortTermCautiousLoan, ShortTermFixedLoan, ShortTermDaubtLoan, ShortTermEstLossLoan);
        }
        if (_.isEmpty(listTermLoan.midTermLoan)) {
            MidLoanTerm = {};
        }
        else if (!_.isEmpty(listTermLoan.midTermLoan)) {
            console.log('listTermLoan.midTermLoan', listTermLoan.midTermLoan);
            let MidTermNormalLoan, MidTermCautiousLoan, MidTermFixedLoan, MidTermDaubtLoan, MidTermEstLossLoan;

            if (_.isEmpty(listTermLoan.midTermLoan.TermNormalLoan)) {
                MidTermNormalLoan = {};
            } else {
                MidTermNormalLoan = listTermLoan.midTermLoan.TermNormalLoan;
            }
            if (_.isEmpty(listTermLoan.midTermLoan.TermCautiousLoan)) {
                MidTermCautiousLoan = {};
            } else {
                MidTermCautiousLoan = listTermLoan.midTermLoan.TermCautiousLoan;
            }
            if (_.isEmpty(listTermLoan.midTermLoan.TermFixedLoan)) {
                MidTermFixedLoan = {};
            } else {
                MidTermFixedLoan = listTermLoan.midTermLoan.TermFixedLoan;
            }
            if (_.isEmpty(listTermLoan.midTermLoan.TermDaubtLoan)) {
                MidTermDaubtLoan = {};
            } else {
                MidTermDaubtLoan = listTermLoan.midTermLoan.TermDaubtLoan;
            }
            if (_.isEmpty(listTermLoan.midTermLoan.TermEstLossLoan)) {
                MidTermEstLossLoan = {};
            } else {
                MidTermEstLossLoan = listTermLoan.midTermLoan.TermEstLossLoan;
            }

            MidLoanTerm = new midLoanTerm(MidTermNormalLoan, MidTermCautiousLoan, MidTermFixedLoan, MidTermDaubtLoan, MidTermEstLossLoan);
        }
        if (_.isEmpty(listTermLoan.longTermLoan)) {
            LongLoanTerm = {};
        }
        else if (!_.isEmpty(listTermLoan.longTermLoan)) {
            console.log('listTermLoan.longTermLoan', listTermLoan.longTermLoan);
            let LongTermNormalLoan, LongTermCautiousLoan, LongTermFixedLoan, LongTermDaubtLoan, LongTermEstLossLoan;

            if (_.isEmpty(listTermLoan.longTermLoan.TermNormalLoan)) {
                LongTermNormalLoan = {};
            } else {
                LongTermNormalLoan = listTermLoan.longTermLoan.TermNormalLoan;
            }
            if (_.isEmpty(listTermLoan.longTermLoan.TermCautiousLoan)) {
                LongTermCautiousLoan = {};
            } else {
                LongTermCautiousLoan = listTermLoan.longTermLoan.TermCautiousLoan;
            }
            if (_.isEmpty(listTermLoan.longTermLoan.TermFixedLoan)) {
                LongTermFixedLoan = {};
            } else {
                LongTermFixedLoan = listTermLoan.longTermLoan.TermFixedLoan;
            }
            if (_.isEmpty(listTermLoan.longTermLoan.TermDaubtLoan)) {
                LongTermDaubtLoan = {};
            } else {
                LongTermDaubtLoan = listTermLoan.longTermLoan.TermDaubtLoan;
            }
            if (_.isEmpty(listTermLoan.longTermLoan.TermEstLossLoan)) {
                LongTermEstLossLoan = {};
            } else {
                LongTermEstLossLoan = listTermLoan.longTermLoan.TermEstLossLoan;
            }

            LongLoanTerm = new longLoanTerm(LongTermNormalLoan, LongTermCautiousLoan, LongTermFixedLoan, LongTermDaubtLoan, LongTermEstLossLoan);
        }
        if (_.isEmpty(listTermLoan.otherTermLoan)) {
            OtherLoanTerm = {};
        }
        else if (!_.isEmpty(listTermLoan.otherTermLoan)) {
            console.log('listTermLoan.otherTermLoan', listTermLoan.otherTermLoan);
            let OtherTermNormalLoan, OtherTermCautiousLoan, OtherTermFixedLoan, OtherTermDaubtLoan, OtherTermEstLossLoan;

            if (_.isEmpty(listTermLoan.otherTermLoan.TermNormalLoan)) {
                OtherTermNormalLoan = {};
            } else {
                OtherTermNormalLoan = listTermLoan.otherTermLoan.TermNormalLoan;
            }
            if (_.isEmpty(listTermLoan.otherTermLoan.TermCautiousLoan)) {
                OtherTermCautiousLoan = {};
            } else {
                OtherTermCautiousLoan = listTermLoan.otherTermLoan.TermCautiousLoan;
            }
            if (_.isEmpty(listTermLoan.otherTermLoan.TermFixedLoan)) {
                OtherTermFixedLoan = {};
            } else {
                OtherTermFixedLoan = listTermLoan.otherTermLoan.TermFixedLoan;
            }
            if (_.isEmpty(listTermLoan.otherTermLoan.TermDaubtLoan)) {
                OtherTermDaubtLoan = {};
            } else {
                OtherTermDaubtLoan = listTermLoan.otherTermLoan.TermDaubtLoan;
            }
            if (_.isEmpty(listTermLoan.otherTermLoan.TermEstLossLoan)) {
                OtherTermEstLossLoan = {};
            } else {
                OtherTermEstLossLoan = listTermLoan.otherTermLoan.TermEstLossLoan;
            }

            OtherLoanTerm = new otherLoanTerm(OtherTermNormalLoan, OtherTermCautiousLoan, OtherTermFixedLoan, OtherTermDaubtLoan, OtherTermEstLossLoan);
        }


        return { ShortLoanTerm, MidLoanTerm, LongLoanTerm, OtherLoanTerm };
    }
}