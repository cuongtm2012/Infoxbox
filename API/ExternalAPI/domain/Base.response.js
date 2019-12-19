
module.exports = function BaseResponse(params) {
    const {
        responseMessage,
        niceSessionKey,
        responseTime,
        responseCode
    } = params;

    this.responseMessage = responseMessage;
    this.niceSessionKey = niceSessionKey;
    this.responseTime = responseTime;
    this.responseCode = responseCode;
}