const validation = require('../../shared/util/validation');
const responcodeEXT = require('../../shared/constant/responseCodeExternal');
const checkContains = require('../../shared/util/checkcontains');
const _ = require('lodash');
const dateUtil = require('../util/dateutil');
const util = require('../../shared/util/util');

module.exports = {
    checkRCSM01ParamRequest: function (getdataReq) {
        var response;

        //fiSessionKey, Application number
        if (!_.isEmpty(getdataReq.appNumber) && 20 < getdataReq.appNumber.length) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.FISessionKeyOverLength.name,
                responseCode: responcodeEXT.RESCODEEXT.FISessionKeyOverLength.code
            }
            return response;
        }
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
        if (!(_.isEqual(responcodeEXT.TaskCode.RCS_M01_RQST.code, getdataReq.taskCode))) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.InvalidTaskCode.name,
                responseCode: responcodeEXT.RESCODEEXT.InvalidTaskCode.code
            }
            return response;
        }
        //nfGrade
		if (validation.isEmptyStr(getdataReq.nfGrade)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NFGRADE.name,
                responseCode: responcodeEXT.RESCODEEXT.NFGRADE.code
            }
            return response;
        }
		//cicNiceSessionKey
		if (validation.isEmptyStr(getdataReq.cicNiceSessionKey)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NINICESESSIONKEY.name,
                responseCode: responcodeEXT.RESCODEEXT.NINICESESSIONKEY.code
            }
            return response;
        }
        //    national ID
        if (_.isEmpty(getdataReq.natId)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NINATIONALID.name,
                responseCode: responcodeEXT.RESCODEEXT.NINATIONALID.code
            }
            return response;
        }
        if (50 < getdataReq.natId.length) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NINATIONALID.name,
                responseCode: responcodeEXT.RESCODEEXT.NINATIONALID.code
            }
            return response;
        }
        //mobilePhoneNumber
        //TODO check with list available phone number, data type
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

		//homeAddress
		if (validation.isEmptyStr(getdataReq.homeAddress)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.HOMEADDRESS.name,
                responseCode: responcodeEXT.RESCODEEXT.HOMEADDRESS.code
            }
            return response;
        }
		//workAddress
		if (validation.isEmptyStr(getdataReq.workAddress)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.WORKADDRESS.name,
                responseCode: responcodeEXT.RESCODEEXT.WORKADDRESS.code
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