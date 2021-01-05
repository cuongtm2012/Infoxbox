const validation = require('../../shared/util/validation');
const responcodeEXT = require('../../shared/constant/responseCodeExternal');
const checkContains = require('../../shared/util/checkcontains');
const _ = require('lodash');
const dateUtil = require('../util/dateutil');
const util = require('../../shared/util/util');

module.exports = {
    checkOKVNParamRequest: function (getdataReq) {
        var response;

        //ficode
        if (validation.isEmptyStr(getdataReq.fiCode)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NIFICODE.name,
                responseCode: responcodeEXT.RESCODEEXT.NIFICODE.code
            }
            return response;
        }
        //taskCode
        if (validation.isEmptyStr(getdataReq.taskCode)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NITASKCODE.name,
                responseCode: responcodeEXT.RESCODEEXT.NITASKCODE.code
            }
            return response;
        }
        if (!(_.isEqual(responcodeEXT.TaskCode.OKF_SPL_RQST.code, getdataReq.taskCode))) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.InvalidTaskCode.name,
                responseCode: responcodeEXT.RESCODEEXT.InvalidTaskCode.code
            }
            return response;
        }
        
        //mobilePhoneNumber
        if (validation.isEmptyStr(getdataReq.mobilePhoneNumber)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NIMOBILEPHONENUMBER.name,
                responseCode: responcodeEXT.RESCODEEXT.NIMOBILEPHONENUMBER.code
            }
            return response;
        } else if (!util.validPhoneNumber(getdataReq.mobilePhoneNumber)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.InvalidMobileNumber.name,
                responseCode: responcodeEXT.RESCODEEXT.InvalidMobileNumber.code
            }
            return response;
        }
		
		//natId
		if (!util.validNumber(getdataReq.natId)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NINATIONALID.name,
                responseCode: responcodeEXT.RESCODEEXT.NINATIONALID.code
            }
            return response;
        }
		//salary
		if (!util.validNumber(getdataReq.salary)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.INVALIDSALARY.name,
                responseCode: responcodeEXT.RESCODEEXT.INVALIDSALARY.code
            }
            return response;
        }

        //infoProvConcent
        if (validation.isEmptyStr(getdataReq.infoProvConcent)) {
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

        else
            response = {};

        return response;

    }
};