const responcodeEXT = require('../../shared/constant/responseCodeExternal');
const _ = require('lodash');
const checkContains = require('../../shared/util/checkcontains');
const MAX_SIZE = 4194304;
module.exports = {
    checkParamRequest: function (getDataReq, formData) {
        var response;
        //fiSessionKey, Application number
        if (20 < getDataReq.appNumber.length) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.FISessionKeyOverLength.name,
                responseCode: responcodeEXT.RESCODEEXT.FISessionKeyOverLength.code
            }
            return response;
        }
        // fiCode
        if (_.isEmpty(getDataReq.fiCode)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NIFICODE.name,
                responseCode: responcodeEXT.RESCODEEXT.NIFICODE.code
            }
            return response;
        }
        if (10 < getDataReq.fiCode.length) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.FiCodeOverLength.name,
                responseCode: responcodeEXT.RESCODEEXT.FiCodeOverLength.code
            }
            return response;
        }
        // Task code
        if (_.isEmpty(getDataReq.taskCode)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NITASKCODE.name,
                responseCode: responcodeEXT.RESCODEEXT.NITASKCODE.code
            }
            return response;
        }
        if (!_.isEqual(responcodeEXT.TaskCode.KYC_FI1_RQST.code, getDataReq.taskCode)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.InvalidTaskCode.name,
                responseCode: responcodeEXT.RESCODEEXT.InvalidTaskCode.code
            }
            return response;
        }
        if (30 < getDataReq.taskCode.length) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.TaskCodeOverLength.name,
                responseCode: responcodeEXT.RESCODEEXT.TaskCodeOverLength.code
            }
            return response;
        }
        // infoProvConcent
        if (_.isEmpty(getDataReq.infoProvConcent)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.ConsentProvisionIsNotValid.name,
                responseCode: responcodeEXT.RESCODEEXT.ConsentProvisionIsNotValid.code
            }
            return response;
        }
        if (!checkContains.contains.call(responcodeEXT.InfoProvConcent, getDataReq.infoProvConcent.toUpperCase())) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.ConsentProvisionIsNotValid.name,
                responseCode: responcodeEXT.RESCODEEXT.ConsentProvisionIsNotValid.code
            }
            return response;
        }
        // ID type
        if (_.isEmpty(getDataReq.idType)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NIIDTYPE.name,
                responseCode: responcodeEXT.RESCODEEXT.NIIDTYPE.code
            }
            return response;
        }
        if (!checkContains.contains.call(responcodeEXT.FptIdTypeV01, getDataReq.idType.toUpperCase())) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NIIDTYPE.name,
                responseCode: responcodeEXT.RESCODEEXT.NIIDTYPE.code
            }
            return response;
        }
        // Front Image
        if (_.isEmpty(formData.frontImage)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NIFRONTIMAGE.name,
                responseCode: responcodeEXT.RESCODEEXT.NIFRONTIMAGE.code
            }
            return response;
        }
        if (_.isEqual(formData.frontImage[0].mimetype, "image/jpeg") === false && _.isEqual(formData.frontImage[0].mimetype, "image/png") === false && _.isEqual(formData.frontImage[0].mimetype, "image/jpg") === false) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NIFRONTIMAGE.name,
                responseCode: responcodeEXT.RESCODEEXT.NIFRONTIMAGE.code
            }
            return response;
        }
        // Rear Image
        if (_.isEmpty(formData.rearImage)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NIREARIMAGE.name,
                responseCode: responcodeEXT.RESCODEEXT.NIREARIMAGE.code
            }
            return response;
        }
        if (_.isEqual(formData.rearImage[0].mimetype, 'image/jpeg') === false && _.isEqual(formData.rearImage[0].mimetype, 'image/png') === false && _.isEqual(formData.rearImage[0].mimetype, 'image/jpg') === false) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NIREARIMAGE.name,
                responseCode: responcodeEXT.RESCODEEXT.NIREARIMAGE.code
            }
            return response;
        }
        // Selfie image
        if (_.isEmpty(formData.selfieImage)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NISELFIEIMAGE.name,
                responseCode: responcodeEXT.RESCODEEXT.NISELFIEIMAGE.code
            }
            return response;
        }
        if (_.isEqual(formData.selfieImage[0].mimetype, 'image/jpeg') === false && _.isEqual(formData.selfieImage[0].mimetype, 'image/png') === false && _.isEqual(formData.selfieImage[0].mimetype, 'image/jpg') === false) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NISELFIEIMAGE.name,
                responseCode: responcodeEXT.RESCODEEXT.NISELFIEIMAGE.code
            }
            return response;
        }
        // checking size
        if (formData.frontImage[0].size > MAX_SIZE) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.RQOUTOFSIZE.name,
                responseCode: responcodeEXT.RESCODEEXT.RQOUTOFSIZE.code
            }
            return response;
        }
        if (formData.rearImage[0].size > MAX_SIZE) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.RQOUTOFSIZE.name,
                responseCode: responcodeEXT.RESCODEEXT.RQOUTOFSIZE.code
            }
            return response;
        }
        if (formData.selfieImage[0].size > MAX_SIZE) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.RQOUTOFSIZE.name,
                responseCode: responcodeEXT.RESCODEEXT.RQOUTOFSIZE.code
            }
            return response;
        } else
            response = {};

        return response;
    }
};