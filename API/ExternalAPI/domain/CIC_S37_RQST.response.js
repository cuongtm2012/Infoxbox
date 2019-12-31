// var BaseResponse = require('./Base.response');
var cics37RQSTReq = require('./CIC_S37_RQST.request');

module.exports = function CIC_S37_RQSTResponse(cics11aRQSTRequest, response) {

    const {
        responseMessage,
        niceSessionKey,
        responseTime,
        responseCode
    } = response;

    this.requestData = new cics37RQSTReq(cics11aRQSTRequest);
    this.niceSessionKey = niceSessionKey ? niceSessionKey : "";
    this.responseTime = responseTime ? responseTime : "";
    this.responseCode = responseCode ? responseCode : "";
    this.responseMessage = responseMessage ? responseMessage : "";

};

