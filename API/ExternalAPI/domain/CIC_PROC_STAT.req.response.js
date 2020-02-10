
module.exports = function CicProcStatus(params) {
    const {
        fiCode,
        taskCode,
        searchDateFrom,
        searchDateTo,

    } = params;
    this.fiCode = fiCode;
    this.taskCode = taskCode;
    this.searchDateFrom = searchDateFrom;
    this.searchDateTo = searchDateTo;

}