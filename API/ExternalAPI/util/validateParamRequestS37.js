const validation = require('../../shared/util/validation');

const responcodeEXT = require('../../shared/constant/responseCodeExternal');

const checkContains = require('../../shared/util/checkcontains');
const _ = require('lodash');
const dateUtil = require('../util/dateutil');
const isBase64 = require('is-base64');

module.exports = {
    checkParamRequest: function (getdataReq) {
        var response;

        //fiSessionKey
        if (20 < getdataReq.fiSessionKey.length) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.FISessionKeyOverLength.name,
                responseCode: responcodeEXT.RESCODEEXT.FISessionKeyOverLength.code
            }
            return response;
        }

        // fiCode
        if (_.isEmpty(getdataReq.fiCode)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NIFICODE.name,
                responseCode: responcodeEXT.RESCODEEXT.NIFICODE.code
            }
            return response;
        }
        if (10 < getdataReq.fiCode.length) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.FiCodeOverLength.name,
                responseCode: responcodeEXT.RESCODEEXT.FiCodeOverLength.code
            }
            return response;
        }
        // Task code
        if (_.isEmpty(getdataReq.taskCode)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NITASKCODE.name,
                responseCode: responcodeEXT.RESCODEEXT.NITASKCODE.code
            }
            return response;
        }
        if (30 < getdataReq.taskCode.length) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.TaskCodeOverLength.name,
                responseCode: responcodeEXT.RESCODEEXT.TaskCodeOverLength.code
            }
            return response;
        }
        if (!_.isEqual(responcodeEXT.TaskCode.CIC_S37_RQST.code, getdataReq.taskCode)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.InvalidTaskCode.name,
                responseCode: responcodeEXT.RESCODEEXT.InvalidTaskCode.code
            }
            return response;
        }
        //LoginID
        if (validation.isEmptyStr(getdataReq.loginId)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NILOGINID.name,
                responseCode: responcodeEXT.RESCODEEXT.NILOGINID.code
            }
            return response;
        }
        //LoginPass
        if (validation.isEmptyStr(getdataReq.loginPw)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NIPASSWORD.name,
                responseCode: responcodeEXT.RESCODEEXT.NIPASSWORD.code
            }
            return response;
        }
        if (!isBase64(getdataReq.loginPw)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.ErrorDecryptError.name,
                responseCode: responcodeEXT.RESCODEEXT.ErrorDecryptError.code
            }
            return response;
        }
        // inforProvCOncent
        if (_.isEmpty(getdataReq.infoProvConcent)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.ConsentProvisionIsNotValid.name,
                responseCode: responcodeEXT.RESCODEEXT.ConsentProvisionIsNotValid.code
            }
            return response;
        }
        if (!checkContains.contains.call(responcodeEXT.InfoProvConcent, getdataReq.infoProvConcent.toUpperCase())) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.ConsentProvisionIsNotValid.name,
                responseCode: responcodeEXT.RESCODEEXT.ConsentProvisionIsNotValid.code
            }
            return response;
        }
        // taxcode, natif, oldNatId, passportNumber,cicId
        if (_.isEmpty(getdataReq.taxCode || getdataReq.natId || getdataReq.oldNatId ||
            getdataReq.passportNumber || getdataReq.cicId)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NIS11ARQSTNOTNULL.name,
                responseCode: responcodeEXT.RESCODEEXT.NIS11ARQSTNOTNULL.code
            }
            return response;
        }
        // valid inquiryDate less than today
        if (!dateUtil.validDateAndCurrentDate(getdataReq.inquiryDate, '')) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.INQDateInvalid.name,
                responseCode: responcodeEXT.RESCODEEXT.INQDateInvalid.code
            }
            return response;
        }

        else
            response = {};

        return response;

    }
};