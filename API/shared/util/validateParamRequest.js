const validation = require('./validation');

const responcodeEXT = require('../shared/constant/responseCodeExternal');

module.exports = {
    checkParamRequest: function (getdataReq) {
        var response;

        if (validation.isEmptyStr(getdataReq.fiCode)) {
            response = {
                responseMessage : responcodeEXT.RESCODEEXT.NIFICODE.name,
                responseCode : responcodeEXT.RESCODEEXT.NIFICODE.code
            }
            return response;
        }
        if (validation.isEmptyStr(getdataReq.cicGoodCode)) {
            response = {
                responseMessage : responcodeEXT.RESCODEEXT.NICICCODE.name,
                responseCode : responcodeEXT.RESCODEEXT.NICICCODE.code
            }
            return response;
        }
        if (validation.isEmptyStr(getdataReq.loginId)) {
            response = {
                responseMessage : responcodeEXT.RESCODEEXT.NILOGINID.name,
                responseCode : responcodeEXT.RESCODEEXT.NILOGINID.code
            }
            return response;
        }
        if (validation.isEmptyStr(getdataReq.loginPw)) {
            response = {
                responseMessage : responcodeEXT.RESCODEEXT.NIPASSWORD.name,
                responseCode : responcodeEXT.RESCODEEXT.NIPASSWORD.code
            }
            return response;
        }

        else
            response = {};

        return response;

    }
};