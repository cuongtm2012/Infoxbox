const responcodeEXT = require('../../shared/constant/responseCodeExternal');
const _ = require('lodash');
const checkContains = require('../../shared/util/checkcontains');
const MAX_SIZE = 4194304;
module.exports = {
    checkParamRequest: function (getDataReq, formData) {
        if (formData === undefined) {
            formData = {};
        }
        var response;
        //fiSessionKey
        if (!_.isEmpty(getDataReq.fiSessionKey) && 20 < getDataReq.fiSessionKey.length) {
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
        if (!_.isEqual(responcodeEXT.TaskCode.KYC_F02_RQST.code, getDataReq.taskCode)) {
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
        // Source Image
        if (_.isEmpty(formData.sourceImage) && _.isEmpty(getDataReq.sourceImage)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NISELFIEIMAGE.name,
                responseCode: responcodeEXT.RESCODEEXT.NISELFIEIMAGE.code
            }
            return response;
        }
        // Target Image
        if (_.isEmpty(formData.targetImage) && _.isEmpty(getDataReq.targetImage)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NIIDIMAGE.name,
                responseCode: responcodeEXT.RESCODEEXT.NIIDIMAGE.code
            }
            return response;
        }
        // checking size
        if (!_.isEmpty(formData.sourceImage) && formData.sourceImage.size > MAX_SIZE) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.RQOUTOFSIZE.name,
                responseCode: responcodeEXT.RESCODEEXT.RQOUTOFSIZE.code
            }
            return response;
        }
        if (!_.isEmpty(formData.targetImage) && formData.targetImage.size > MAX_SIZE) {
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
