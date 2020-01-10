// const LoanDetailInfor = require('./loanDetail.save');
// const Loan5YearInfor = require('./loan5yearInfo.save');
// const CicCptMain = require('./cicrptmain.save');

module.exports = function InsertScrapingMSG(loanDetailInfor, loan5YearInfor, fnciccptmain){
    // LoanDetailInfor = new LoanDetailInfor(loanDetailInfor);
    // Loan5YearInfor = new Loan5YearInfor(loan5YearInfor);
    // CicCptMain = new CicCptMain(fnciccptmain);

    this.loanDetailInfor = loanDetailInfor;
    this.loan5YearInfor = loan5YearInfor;
    this.cicCptMian = fnciccptmain;
}