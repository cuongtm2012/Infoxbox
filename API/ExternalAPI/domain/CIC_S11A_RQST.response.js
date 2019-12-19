// var BaseResponse = require('./Base.response');
var cics11aRQSTReq = require('./CIC_S11A_RQST.request');

module.exports = function CIC_S11A_RQSTResponse(cics11aRQSTRequest, response) {

    const {
        responseMessage,
        niceSessionKey,
        responseTime,
        responseCode
    } = response;

    this.requestData = new cics11aRQSTReq(cics11aRQSTRequest);
    this.niceSessionKey = niceSessionKey ? niceSessionKey : "";
    this.responseTime = responseTime ? responseTime : "";
    this.responseCode = responseCode ? responseCode : "";
    this.responseMessage = responseMessage ? responseMessage : "";

};

