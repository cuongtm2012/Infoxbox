module.exports = function (listData, niceSessionKey, sysDtim, workID, seqs) {
    const {
        seq,
        contract,
        company,
        contractDate1,
        contractDate2

    } = listData;

    this.NICE_SSIN_ID = niceSessionKey;
    this.SEQ = parseInt(seq) ? parseInt(seq) : seqs;
    this.FIN_CTRT = contract ? contract : null;
    this.OGZ_NM = company ? company : null;
    this.CTRT_START_DATE = contractDate1 ? contractDate1 : null;
    this.CTRT_END_DATE = contractDate2 ? contractDate2 : null;
    this.SYS_DTIM = sysDtim;
    this.WORK_ID = workID ? workID : null;

}