const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const __dad = path.join(__dirname, '..')
const pathToSaveImg = path.join(__dad, 'uploads');
module.exports = function dataDigitalIdFptFaceMatchSaveToFptFace(req,NICE_SSIN_ID, REQUEST_ID, data) {
    this.NICE_SSIN_ID = NICE_SSIN_ID;
    this.REQUEST_ID = REQUEST_ID;
    this.RESULT_CODE = data.ErrorCode;
    this.SOURCE_IMAGE = convertImageToBase64(path.join(pathToSaveImg, req.files.selfieImage[0].filename));
    this.TARGET_IMAGE = convertImageToBase64(path.join(pathToSaveImg, req.files.frontImage[0].filename));
    this.SIMILARITY = data.Data.similarity.toString();
    this.RESULT = data.Data.result;
    this.PROVIDER = data.Data.providerCode;
}

function convertImageToBase64(pathFile) {
    const buff = fs.readFileSync(pathFile);
    return buff.toString("base64");
}