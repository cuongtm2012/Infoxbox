const getIdGetway = require('../../shared/util/getIPGateWay');
const dateutil = require('../util/dateutil');
module.exports = function creditScoreInfo(niceSsKey, creditScoreInfo, reportName) {
    this.NICE_SSIN_ID = niceSsKey;
    this.RPT_NAME = reportName ? reportName : '';
    this.SCORE = creditScoreInfo.score;
    this.GRADE = creditScoreInfo.class;
    this.BASE_DATE = creditScoreInfo.date;
    this.PERCENTILE = creditScoreInfo.rate;
    this.SYS_DTIM = dateutil.timeStamp();
    this.WORK_ID = getIdGetway.getIPGateWay();
}