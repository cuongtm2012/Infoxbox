const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const __dad = path.join(__dirname, '..')
const pathToSaveImg = path.join(__dad, 'uploads');
module.exports = function dataDigitalIdFptFaceMatchSaveToFptFace(req,NICE_SSIN_ID, REQUEST_ID, data) {
    this.NICE_SSIN_ID = NICE_SSIN_ID;
    this.REQUEST_ID = REQUEST_ID;
    this.RESULT_CODE = data.ErrorCode;
    this.SOURCE_IMAGE = req.body.selfieImage ? req.body.selfieImage : convertImageToBase64(req.files.selfieImage.path);
    this.TARGET_IMAGE = req.body.frontImage ? req.body.frontImage : convertImageToBase64(req.files.frontImage.path);
    this.SIMILARITY = data.Data.similarity.toString();
    this.RESULT = data.Data.result;
    this.PROVIDER = data.Data.providerCode;
}

function convertImageToBase64(pathFile) {
    const buff = fs.readFileSync(pathFile);
    return buff.toString("base64");
}