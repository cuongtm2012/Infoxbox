module.exports = function dataVmgCacSaveToVmgAddress(niceSessionKey, resultCAC1) {
    this.NICE_SSIN_ID = niceSessionKey;
    this.ADDR_HOME = resultCAC1.result.resCoordinates.home_address;
    this.PERCENT_HOME = null;
    this.LAT_HOME = resultCAC1.result.resCoordinates.home_lat;
    this.LONG_HOME = resultCAC1.result.resCoordinates.home_long;
    this.ADDR_WORK = resultCAC1.result.resCoordinates.work_address;
    this.PERCENT_WORK = null;
    this.LAT_WORK = resultCAC1.result.resCoordinates.work_lat;
    this.LONG_WORK = resultCAC1.result.resCoordinates.work_long;
    this.ADDR_REFER = resultCAC1.result.resCoordinates.refer_address;
    this.PERCENT_REFER = null;
    this.LAT_REFER = resultCAC1.result.resCoordinates.refer_lat;
    this.LONG_REFER = resultCAC1.result.resCoordinates.refer_long;
    this.MONTH = null;
    this.YEAR = null;
}