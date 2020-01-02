const validation = require('../../shared/util/validation');

const responcodeEXT = require('../../shared/constant/responseCodeExternal');
const dataType = require('../../shared/constant/datatype');
const validParams = require('../../shared/util/param_middleware');

const nicekey = require('../util/niceSessionKey');
const listProductCode = require('../../shared/constant/productcode');
const checkContains = require('../../shared/util/checkcontains');

module.exports = {
    checkParamRequest: function (getdataReq) {
        var response;

        let producCode = nicekey.niceProductCode(getdataReq.cicGoodCode);
        if (!checkContains.contains.call(listProductCode.productCodes, producCode)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.IVCICCODE.name,
                responseCode: responcodeEXT.RESCODEEXT.IVCICCODE.code
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
        if (!validParams.checkParamType(getdataReq.fiCode, dataType.DATATYPE.STRING.type)) {
            response = {
                // responseMessage: responcodeEXT.RESCODEEXT.IVFICODE.name,
                responseMessage: responcodeEXT.RESCODEEXT.IVFICODE.name + `, FI code is of type ` +
                    `${typeof getdataReq.fiCode}` + ` but should be ` + dataType.DATATYPE.STRING.type,
                responseCode: responcodeEXT.RESCODEEXT.IVFICODE.code
            }
            return response;
        }
        if (validation.isEmptyStr(getdataReq.cicGoodCode)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NICICCODE.name,
                responseCode: responcodeEXT.RESCODEEXT.NICICCODE.code
            }
            return response;
        }
        if (validation.isEmptyStr(getdataReq.loginId)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NILOGINID.name,
                responseCode: responcodeEXT.RESCODEEXT.NILOGINID.code
            }
            return response;
        }
        if (validation.isEmptyStr(getdataReq.loginPw)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NIPASSWORD.name,
                responseCode: responcodeEXT.RESCODEEXT.NIPASSWORD.code
            }
            return response;
        }

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