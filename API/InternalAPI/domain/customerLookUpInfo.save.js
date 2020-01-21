module.exports = function (listData, niceSessionKey, sysDtim, workID, seqs) {
    const {
        seq,
        company,
        companyCode,
        product,
        inqDay,
        inqTime

    } = listData;

    this.NICE_SSIN_ID = niceSessionKey;
    this.SEQ = parseInt(seq) ? parseInt(seq) : seqs;
    this.OGZ_NM_BRANCH_NM = company ? company : null;
    this.OGZ_CD = companyCode ? companyCode : null;
    this.INQ_GDS = product ? product : null;
    this.INQ_DATE = inqDay ? inqDay : null;
    this.INQ_TIME = inqTime ? inqTime : null;
    this.SYS_DTIM = sysDtim;
    this.WORK_ID = workID ? workID : null;

}