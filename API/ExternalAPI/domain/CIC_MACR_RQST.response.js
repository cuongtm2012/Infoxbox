// var BaseResponse = require('./Base.response');
var cicMacrRQSTReq = require('./CIC_MACR_RQST.request');

module.exports = function CIC_MACR_RQSTResponse(cicMacrRQSTRequest, response) {

    const {
        responseMessage,
        niceSessionKey,
        responseTime,
        responseCode
    } = response;

    this.requestData = new cicMacrRQSTReq(cicMacrRQSTRequest);
    this.niceSessionKey = niceSessionKey ? niceSessionKey : "";
    this.responseTime = responseTime ? responseTime : "";
    this.responseCode = responseCode ? responseCode : "";
    this.responseMessage = responseMessage ? responseMessage : "";

};