const date = require('date-and-time');
module.exports = function FptDigitalizeIdAndFaceMatchingResponseWithResult(Request, preResponse, frontImage, rearImage, resultFaceMatching, value1) {
    const {
        responseMessage,
        niceSessionKey,
        responseTime,
        responseCode
    } = preResponse;

    const {
        appNumber,
        fiCode,
        taskCode,
        customerNumber,
        productCode,
        idType,
        infoProvConcent
    } = Request;

    this.appNumber = appNumber ? appNumber : "";
    this.fiCode = fiCode ? fiCode : "";
    this.taskCode = taskCode ? taskCode : "";
    this.customerNumber = customerNumber ? customerNumber : "";
    this.productCode = productCode ? productCode : "";
    this.idType = idType ? idType : "";
    this.infoProvConcent = infoProvConcent ? infoProvConcent : "";
    this.niceSessionKey = niceSessionKey ? niceSessionKey : "";
    this.responseTime = responseTime ? responseTime : "";
    this.responseCode = responseCode ? responseCode : "";
    this.responseMessage = responseMessage ? responseMessage : "";
    this.frontImage = {
        idNumber: frontImage.id,
        idCheck: frontImage.id_check,
        name: frontImage.name,
        birthday: date.transform(frontImage.dob, 'DD-MM-YYYY', 'YYYYMMDD'),
        sex: convertSexString(frontImage.sex),
        nationality: frontImage.nationality,
        home: frontImage.home,
        address: frontImage.address,
        typeNew: frontImage.type_new,
        addressEntities: {
            province: frontImage.address_entities.province,
            district: frontImage.address_entities.district,
            ward: frontImage.address_entities.ward,
            street: frontImage.address_entities.street
        },
        doe: date.transform(frontImage.doe, 'DD-MM-YYYY', 'YYYYMMDD'),
        typeFront: frontImage.type
    };
    this.rearImage = {
        ethnicity: rearImage.ethnicity,
        religion: rearImage.religion,
        typeNewRear: rearImage.type_new,
        features: rearImage.features,
        issueDate: rearImage.issue_date,
        issueLoc: rearImage.issue_loc,
        typeRear: rearImage.type
    };
    this.faceMatchingResult = {
        similarity: truncateFloat(resultFaceMatching.similarity),
        sourceResult: resultFaceMatching.result,
        finalResult: parseFloat(resultFaceMatching.similarity) >= Number(value1) ? 'SAME' : 'DIFFERENT'
    };
}

function truncateFloat(number) {
    let value = Number(number);
    if (value === 0 || value === 1) {
        return value;
    } else {
        return value.toPrecision(5);
    }
}

function convertSexString(sex) {
    if (sex.toLowerCase() === 'nam') {
        return 'M';
    } else if (sex.toLowerCase() === 'nu') {
        return 'F'
    } else {
        return sex;
    }
}
