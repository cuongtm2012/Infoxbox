const constant = require('./consant');
const _ = require('lodash');

module.exports = {
    getValueLoanDetailInfor: function (req) {
        var reportDate, companyName, stLoanVND, stLoanUSD, mtLoanVND, mtLoanUSD, ltLoanVND, ltLoanUSD, sumTotalVND, sumTotalUSD;

        _.forEach(req, res => {
            _.forEach(res, function (value, key) {
                if (_.isEqual(_.startCase(value), _.startCase(constant.LOANTERM.ShortTerm.name))) {
                    stLoanVND = res.vnd;
                    stLoanUSD = res.usd;
                }
                if (_.isEqual(_.startCase(value), _.startCase(constant.LOANTERM.MidTerm.name))) {
                    mtLoanVND = res.vnd;
                    mtLoanUSD = res.usd;
                }
                if (_.isEqual(_.startCase(value), _.startCase(constant.LOANTERM.LongTerm.name))) {
                    ltLoanVND = res.vnd;
                    ltLoanUSD = res.usd;
                }
                if (_.isEqual(_.startCase(value), _.startCase(constant.LOANTERM.TotalFILoan.name))) {
                    sumTotalVND = res.vnd;
                    sumTotalUSD = res.usd;
                }
                if (_.startCase(value).indexOf(_.startCase(constant.LOANTERM.ReportDate.name)) >= 0) {
                    reportDate = res.item.split(':')[1].trim();
                }
                if (value.indexOf(constant.LOANTERM.CompanyName.name) >= 0) {
                    companyName = res.item;
                }
            });
        });

        return { reportDate, companyName, stLoanVND, stLoanUSD, mtLoanVND, mtLoanUSD, ltLoanVND, ltLoanUSD, sumTotalVND, sumTotalUSD };

    }
}