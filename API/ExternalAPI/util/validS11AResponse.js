const validation = require('../../shared/util/validation');

const responcodeEXT = require('../../shared/constant/responseCodeExternal');

module.exports = {
    checkParamResponse: function (getdataReq) {
        var response;

        if (validation.isEmptyStr(getdataReq.niceSessionKey)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NINICESESSIONKEY.name,
                responseCode: responcodeEXT.RESCODEEXT.NINICESESSIONKEY.code
            }
            return response;
        }

        else
            response = {};

        return response;

    }
};