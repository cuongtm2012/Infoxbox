const fs = require('fs');
const path = require('path');
const _ = require('lodash');
const __dad = path.join(__dirname, '..')
const pathToSaveImg = path.join(__dad, 'uploads');
module.exports = function DataFptSaveToFptId(req, niceSessionKey, data, resultCode, requestId) {
    this.NICE_SSIN_ID = niceSessionKey;
    this.REQUEST_ID = requestId;
    this.RESULT_CODE = resultCode;
    //
    this.FRONT_IMAGE = req.body.frontImage ? req.body.frontImage : convertImageToBase64(req.files.frontImage.path);
    this.REAR_IMAGE = req.body.rearImage ? req.body.rearImage : convertImageToBase64(req.files.rearImage.path);
    // front
    this.ID_NUMBER = data.frontImage.id ? data.frontImage.id : null;
    this.NAME = data.frontImage.name ? data.frontImage.name : null;
    this.BIRTHDAY = data.frontImage.dob ? data.frontImage.dob : null;
    this.SEX = data.frontImage.sex ? data.frontImage.sex : null;
    this.NATIONALITY = data.frontImage.nationality ? data.frontImage.nationality : null;
    this.HOME = data.frontImage.home ? data.frontImage.home : null;
    this.ADDRESS = data.frontImage.address ? data.frontImage.address : null;
    this.ID_TYPE = req.body.idType ? req.body.idType : null;
    this.PROVINCE = data.frontImage.address_entities.province ? data.frontImage.address_entities.province : null;
    this.DISTRICT = data.frontImage.address_entities.district ? data.frontImage.address_entities.district : null;
    this.WARD = data.frontImage.address_entities.ward ? data.frontImage.address_entities.ward : null;
    this.STREET = data.frontImage.address_entities.street ? data.frontImage.address_entities.street : null;
    this.DOE = data.frontImage.doe ? data.frontImage.doe : null;
    this.TYPE_FRONT = data.frontImage.type ? data.frontImage.type : null;
    // rear
    this.ETHINICITY = data.backImage.ethnicity ? data.backImage.ethnicity : null;
    this.RELIGION = data.backImage.religion ? data.backImage.religion : null;
    this.TYPE_NEW = data.backImage.type_new ? data.backImage.type_new : null;
    this.FEATURES = data.backImage.features ? data.backImage.features : null;
    this.ISSUE_DATE = data.backImage.issue_date ? data.backImage.issue_date : null;
    this.ISSUE_LOC = data.backImage.issue_loc ? data.backImage.issue_loc : null;
    this.TYPE_REAR = data.backImage.type ? data.backImage.type : null;
    this.PROVIDER_CODE = data.providerCode;
}

function convertImageToBase64(pathFile) {
    const buff = fs.readFileSync(pathFile);
    return buff.toString("base64");
}