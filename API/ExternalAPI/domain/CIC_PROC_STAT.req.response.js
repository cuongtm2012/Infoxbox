
import _ from 'lodash';

function CicProcStatus(params) {
    const {
        fiCode,
        taskCode,
        searchDateFrom,
        searchDateTo,
        scrapingStatusCode,
        offset,
        maxnumrows

    } = params;

    let _offset, _maxnumrows;
    if (_.isEmpty(offset))
        _offset = 0;
    if (_.isEmpty(maxnumrows))
        _maxnumrows = 100;

    this.fiCode = fiCode;
    this.taskCode = taskCode;
    this.searchDateFrom = searchDateFrom;
    this.searchDateTo = searchDateTo;
    this.scrapingStatusCode = scrapingStatusCode ? scrapingStatusCode : null;
    this.offset = offset ? offset : _offset;
    this.maxnumrows = maxnumrows ? maxnumrows : _maxnumrows;
}

export default CicProcStatus;