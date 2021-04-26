const responcodeEXT = require('../../shared/constant/responseCodeExternal');
const _ = require('lodash');
const validation = require('../../shared/util/validation');
const isBase64 = require('is-base64');
module.exports = {
    checkParamRequest: function (getDataReq) {
        var response;
        //fiSessionKey, appNumber
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
        if (!_.isEqual(responcodeEXT.TaskCode.FTN_GAS_RQST.code, getDataReq.taskCode)) {
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
        //LoginPass
        if (validation.isEmptyStr(getDataReq.loginPw)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NIPASSWORD.name,
                responseCode: responcodeEXT.RESCODEEXT.NIPASSWORD.code
            }
            return response;
        }
        if (!isBase64(getDataReq.loginPw)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.ErrorDecryptError.name,
                responseCode: responcodeEXT.RESCODEEXT.ErrorDecryptError.code
            }
            return response;
        }
        //    alias
        if (_.isEmpty(getDataReq.alias)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NIALIAS.name,
                responseCode: responcodeEXT.RESCODEEXT.NIALIAS.code
            }
            return response;
        }
        else
            response = {};

        return response;
    }
};
