const matchingNumber = 0.95;
module.exports = function FptDigitalizeIdAndFaceMatchingResponseWithResult(Request, preResponse, frontImage, rearImage, resultFaceMatching) {
    const {
        responseMessage,
        niceSessionKey,
        responseTime,
        responseCode
    } = preResponse;

    const {
        fiSessionKey,
        fiCode,
        taskCode,
        customerNumber,
        productCode,
        idType,
        infoProvConcent
    } = Request;

    this.fiSessionKey = fiSessionKey ? fiSessionKey : "";
    this.fiCode = fiCode ? fiCode : "";
    this.taskCode = taskCode ? taskCode : "";
    this.customerNumber = customerNumber ? customerNumber : "";
    this.productCode = productCode ? productCode : "";
    this.idType = idType ? idType : "";
    this.infoProvConcent = infoProvConcent ? infoProvConcent : "";
    this.niceSessionKey = niceSessionKey ? niceSessionKey : "";
    this.responseTime  = responseTime ? responseTime : "";
    this.responseCode = responseCode ? responseCode : "";
    this.responseMessage = responseMessage ? responseMessage : "";
    this.frontImage = frontImage ? frontImage : "";
    this.rearImage = rearImage ? rearImage : "";
    this.faceMatchingResult = {
        similarity: resultFaceMatching.similarity,
        sourceResult: resultFaceMatching.result,
        finalResult: parseFloat(resultFaceMatching.similarity) >= matchingNumber ? 'SAME' : 'DIFFERENT'
    };
}