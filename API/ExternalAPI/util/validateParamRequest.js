const validation = require('../../shared/util/validation');

const responcodeEXT = require('../../shared/constant/responseCodeExternal');
const dataType = require('../../shared/constant/datatype');
const validParams = require('../../shared/util/param_middleware');

const nicekey = require('./niceSessionKey');
const listProductCode = require('../../shared/constant/productcode');
const checkContains = require('../../shared/util/checkcontains');
const _ = require('lodash');

module.exports = {
    checkParamRequest: function (getdataReq) {
        var response;

        //cicGoodCode
        let producCode = nicekey.niceProductCode(getdataReq.cicGoodCode);
        if (!checkContains.contains.call(listProductCode.productCodes, producCode)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.IVCICCODE.name,
                responseCode: responcodeEXT.RESCODEEXT.IVCICCODE.code
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
        // fiCode
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

        // Task code
        if (_.isEmpty(getdataReq.taskCode)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NITASKCODE.name,
                responseCode: responcodeEXT.RESCODEEXT.NITASKCODE.code
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
        // taxcode, natif, oldNatId, passportNumber,cicId
        if (_.isEmpty(getdataReq.taxCode || getdataReq.natId || getdataReq.oldNatId ||
            getdataReq.passportNumber || getdataReq.cicId)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NIS11ARQSTNOTNULL.name,
                responseCode: responcodeEXT.RESCODEEXT.NIS11ARQSTNOTNULL.code
            }
        }

        else
            response = {};

        return response;

    }
};