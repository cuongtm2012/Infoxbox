const validation = require('../../shared/util/validation');
const parseValue = require('../util/parseValue');

module.exports = function loan5Yearinfor(listData, niceSessionKey, sysDtim, workID, seqs) {
    const {
        seq,
        company,
        date,
        group,
        vnd,
        usd
    } = listData;

    this.NICE_SSIN_ID = niceSessionKey;
    this.SEQ = seq ? parent(seq) : seqs;
    this.OGZ_NM_BRANCH_NM = company ? company : null;
    this.RCT_OCR_DATE = date ? date : null;
    this.DEBT_GRP = group ? group : null;
    this.AMT_VND = vnd ? parseValue.parseFloat(vnd) : validation.setEmptyValue(vnd);
    this.AMD_USD = usd ? parseValue.parseFloat(usd) : validation.setEmptyValue(usd);
    this.SYS_DTIM = sysDtim;
    this.WORK_ID = workID;

}