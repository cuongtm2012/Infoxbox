module.exports = function PreResponse(responseMessage, niceSessionKey, responseTime, responseCode) {

    this.responseMessage = responseMessage;
    this.niceSessionKey = niceSessionKey;
    this.responseTime = responseTime;
    this.responseCode = responseCode;
}