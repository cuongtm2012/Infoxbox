module.exports = function ReviewResultRes(parameters) {
    const {//Review result
        finalGrade,
		finalLoanApproval,	
		loanLimit,
    } = parameters;

    this.finalGrade = finalGrade;
	this.finalLoanApproval = finalLoanApproval;
	this.loanLimit = loanLimit;
};