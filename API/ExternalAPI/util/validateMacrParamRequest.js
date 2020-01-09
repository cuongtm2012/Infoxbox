const validation = require('../../shared/util/validation');
const responcodeEXT = require('../../shared/constant/responseCodeExternal');
const dataType = require('../../shared/constant/datatype');
const validParams = require('../../shared/util/param_middleware');
const nicekey = require('../util/niceSessionKey');
const listProductCode = require('../../shared/constant/productcode.js');
const checkContains = require('../../shared/util/checkcontains');

module.exports = {
     checkMacrParamRequest: function (getdataReq) {
        var response;
        let producCode = nicekey.niceProductCode(getdataReq);

        if (!checkContains.contains.call(listProductCode.productCodes, producCode)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.IVCICCODE.name,
                responseCode: responcodeEXT.RESCODEEXT.IVCICCODE.code
            }
            return response;
        }

        if (!validParams.checkParamType(getdataReq.fiCode, dataType.DATATYPE.STRING.type)) {
            response = {
               
                responseMessage: responcodeEXT.RESCODEEXT.IVFICODE.name + `, FI code is of type ` +
                    `${typeof getdataReq.fiCode}` + ` but should be ` + dataType.DATATYPE.STRING.type,
                responseCode: responcodeEXT.RESCODEEXT.IVFICODE.code
            }
            return response;
        }

        
        if (validation.isEmptyStr(getdataReq.fiCode)) {
            response = {
                responseMessage : responcodeEXT.RESCODEEXT.NIFICODE.name,
                responseCode : responcodeEXT.RESCODEEXT.NIFICODE.code
            }
            return response;
        }
        
 
        if (validation.isEmptyStr(getdataReq.name)){
            response = {
                responseMessage : responcodeEXT.RESCODEEXT.NINAME.name,
                responseCode : responcodeEXT.RESCODEEXT.NINAME.code
            }
            return response;
        }

        if (validation.isEmptyStr(getdataReq.mobilePhoneNumber)){
            response = {
                responseMessage : responcodeEXT.RESCODEEXT.NIMOBILEPHONENUMBER.name,
                responseCode : responcodeEXT.RESCODEEXT.NIMOBILEPHONENUMBER.code
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