const responcodeEXT = require('../../shared/constant/responseCodeExternal');
const _ = require('lodash');
const checkContains = require('../../shared/util/checkcontains');
module.exports = {
    checkParamRequest: function (getDataReq) {
        var response;
        //fiSessionKey,appNumber
        if (!_.isEmpty(getDataReq.appNumber) && 20 < getDataReq.appNumber.length) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.FISessionKeyOverLength.name,
                responseCode: responcodeEXT.RESCODEEXT.FISessionKeyOverLength.code
            };
            return response;
        }
        // fiCode
        if (_.isEmpty(getDataReq.fiCode)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NIFICODE.name,
                responseCode: responcodeEXT.RESCODEEXT.NIFICODE.code
            };
            return response;
        }
        if (10 < getDataReq.fiCode.length) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.FiCodeOverLength.name,
                responseCode: responcodeEXT.RESCODEEXT.FiCodeOverLength.code
            };
            return response;
        }
        // Task code
        if (_.isEmpty(getDataReq.taskCode)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NITASKCODE.name,
                responseCode: responcodeEXT.RESCODEEXT.NITASKCODE.code
            };
            return response;
        }
        if (!_.isEqual(responcodeEXT.TaskCode.KYC_VC1_RQST.code, getDataReq.taskCode)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.InvalidTaskCode.name,
                responseCode: responcodeEXT.RESCODEEXT.InvalidTaskCode.code
            };
            return response;
        }
        if (30 < getDataReq.taskCode.length) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.TaskCodeOverLength.name,
                responseCode: responcodeEXT.RESCODEEXT.TaskCodeOverLength.code
            };
            return response;
        }
        //    phone number
        if (_.isEmpty(getDataReq.mobilePhoneNumber)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NIMOBILEPHONENUMBER.name,
                responseCode: responcodeEXT.RESCODEEXT.NIMOBILEPHONENUMBER.code
            };
            return response;
        }
        if (200 < getDataReq.mobilePhoneNumber.length) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NIMOBILEPHONENUMBER.name,
                responseCode: responcodeEXT.RESCODEEXT.NIMOBILEPHONENUMBER.code
            };
            return response;
        }
        // homeAddress
        if (_.isEmpty(getDataReq.homeAddress)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.HOMEADDRESS.name,
                responseCode: responcodeEXT.RESCODEEXT.HOMEADDRESS.code
            };
            return response;
        }
        // workAddress
        if (_.isEmpty(getDataReq.workAddress)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.WORKADDRESS.name,
                responseCode: responcodeEXT.RESCODEEXT.WORKADDRESS.code
            };
            return response;
        }
        // infoProvConcent
        if (_.isEmpty(getDataReq.infoProvConcent)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.ConsentProvisionIsNotValid.name,
                responseCode: responcodeEXT.RESCODEEXT.ConsentProvisionIsNotValid.code
            };
            return response;
        }
        if (!checkContains.contains.call(responcodeEXT.InfoProvConcent, getDataReq.infoProvConcent.toUpperCase())) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.ConsentProvisionIsNotValid.name,
                responseCode: responcodeEXT.RESCODEEXT.ConsentProvisionIsNotValid.code
            };
            return response;
        }

        else
            response = {};

        return response;
    }
};
