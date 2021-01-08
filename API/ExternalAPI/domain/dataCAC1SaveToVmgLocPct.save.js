module.exports = function dataCAC1SaveToVmgLocPct(niceSessionKey, resultCAC1) {
    this.niceSessionKey = niceSessionKey;
    this.result7Day = JSON.stringify(resultCAC1.result.resLocation.result7Day);
    this.result30Day = JSON.stringify(resultCAC1.result.resLocation.result30Day);
    this.result90Day = JSON.stringify(resultCAC1.result.resLocation.result90Day);
}