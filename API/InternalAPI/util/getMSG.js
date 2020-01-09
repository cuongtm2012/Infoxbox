
module.exports = {
    getMSG: function (req) {
        var loanCMT, loanDetailCMT, cardCMT, vamcCMT, loan12MonCMT, npl5YCMT, cardArr3YCMT, catLoan12MCMT, finCtrtCMT;

        loanCMT = null;
        loanDetailCMT = req.loanDetailInfo.msg;
        cardCMT = req.creditCardInfo.msg;
        vamcCMT = req.vamcLoanInfo.msg;
        loan12MonCMT = req.loan12monInfo.msg;
        npl5YCMT = req.loan5yearInfo.msg;
        cardArr3YCMT = req.credit3yearInfo.msg;
        catLoan12MCMT = req.loanAttention12monInfo.msg;
        finCtrtCMT = req.creditContractInfo.msg;

        return { loanCMT: loanCMT, loanDetailCMT: loanDetailCMT, cardCMT: cardCMT, vamcCMT: vamcCMT, loan12MonCMT: loan12MonCMT, npl5YCMT: npl5YCMT, cardArr3YCMT: cardArr3YCMT, catLoan12MCMT: catLoan12MCMT, finCtrtCMT: finCtrtCMT };
    }
}