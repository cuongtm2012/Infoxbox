const _ = require('./validation');

module.exports = {
    getProcessRunTime: function (element) {
        let totalCount = 0;
        let cicUsedId = element.CIC_USED_ID;
        let trycount = element.TRY_COUNT;
        let cmtNo;

        if (!_.isEmptyStr(element.NATL_ID))
            totalCount = totalCount + 1;
        if (!_.isEmptyStr(element.OLD_NATL_ID))
            totalCount = totalCount + 1;
        if (!_.isEmptyStr(element.PSPT_NO))
            totalCount = totalCount + 1;
        if (!_.isEmptyStr(element.TAX_ID))
            totalCount = totalCount + 1;

        if (!_.isEmptyStr(element.NATL_ID)) {
            if (_.isEmptyStr(cicUsedId)) {
                trycount = trycount + 1;
                cicUsedId = '1';
                cmtNo = element.NATL_ID;
            } else if (!_.isEmptyStr(element.OLD_NATL_ID) && parseInt(cicUsedId) <= 1) {
                trycount = trycount + 1;
                cmtNo = element.OLD_NATL_ID;
                cicUsedId = '2';
            } else if (!_.isEmptyStr(element.PSPT_NO) && parseInt(cicUsedId) <= 2) {
                trycount = trycount + 1;
                cmtNo = element.PSPT_NO;
                cicUsedId = '3';
            } else if (!_.isEmptyStr(element.TAX_ID) && parseInt(cicUsedId) <= 3) {
                trycount = trycount + 1;
                cmtNo = element.TAX_ID;
                cicUsedId = '4';
            }
        } else if (!_.isEmptyStr(element.OLD_NATL_ID)) {
            if (_.isEmptyStr(cicUsedId)) {
                trycount = trycount + 1;
                cmtNo = element.OLD_NATL_ID;
                cicUsedId = '2';
            } else if (!_.isEmptyStr(element.PSPT_NO) && parseInt(cicUsedId) <= 2) {
                trycount = trycount + 1;
                cmtNo = element.PSPT_NO;
                cicUsedId = '3';
            } else if (!_.isEmptyStr(element.TAX_ID) && parseInt(cicUsedId) <= 3) {
                trycount = trycount + 1;
                cmtNo = element.TAX_ID;
                cicUsedId = '4';
            }
        } else if (!_.isEmptyStr(element.PSPT_NO)) {
            if (_.isEmptyStr(cicUsedId)) {
                trycount = trycount + 1;
                cmtNo = element.PSPT_NO;
                cicUsedId = '3';
            } else if (!_.isEmptyStr(element.TAX_ID) && parseInt(cicUsedId) <= 3) {
                trycount = trycount + 1;
                cmtNo = element.TAX_ID;
                cicUsedId = '4';
            }
        } else {
            trycount = trycount + 1;
            cmtNo = element.TAX_ID;
            cicUsedId = '4';
        }

        return { totalCount, trycount, cicUsedId, cmtNo };

    }
}