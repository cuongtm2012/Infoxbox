const validation = require('../../shared/util/validation');

const responcodeEXT = require('../../shared/constant/responseCodeExternal');

const validParams = require('../../shared/util/param_middleware');
const dataType = require('../../shared/constant/datatype');
module.exports = {
    checkParamRequestForResponse: function (getdataReq) {
        var response;

        if (validation.isEmptyStr(getdataReq.niceSessionKey)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NINICESESSIONKEY.name,
                responseCode: responcodeEXT.RESCODEEXT.NINICESESSIONKEY.code
            }
            return response;
        }
        if (validation.isEmptyStr(getdataReq.fiCode)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NIFICODE.name,
                responseCode: responcodeEXT.RESCODEEXT.NIFICODE.code
            }
            return response;
        }
        if (validation.isEmptyStr(getdataReq.taskCode)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NITASKCODE.name,
                responseCode: responcodeEXT.RESCODEEXT.NITASKCODE.code
            }
            return response;
        }

        if (!validParams.checkParamType(getdataReq.fiCode, dataType.DATATYPE.STRING.type)){
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.IVFICODE.name + `, FI code is type ` + 
                `${typeof getdataReq.fiCode}` + ` but should be ` + dataType.DATATYPE.STRING.type,
                responseCode: responcodeEXT.RESCODEEXT.IVFICODE.code
            }
            return response;
        }
        else
            response = {};

        return response;

    }
};