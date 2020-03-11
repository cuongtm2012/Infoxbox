module.exports = function PreResponse(responseMessage, niceSessionKey, responseTime, responseCode) {

    this.niceSessionKey = niceSessionKey;
    this.responseTime = responseTime;
    this.responseCode = responseCode;
    this.responseMessage = responseMessage;
}