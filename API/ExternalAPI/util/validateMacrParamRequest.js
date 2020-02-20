const validation = require('../../shared/util/validation');
const responcodeEXT = require('../../shared/constant/responseCodeExternal');
const checkContains = require('../../shared/util/checkcontains');
const _ = require('lodash');
const dateUtil = require('../util/dateutil');
const dataType = require('../../shared/constant/datatype');

module.exports = {
    checkMacrParamRequest: function (getdataReq) {
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
        if (!(_.isEqual(responcodeEXT.TaskCode.CIC_MACR_RQST.code, getdataReq.taskCode))) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.InvalidTaskCode.name,
                responseCode: responcodeEXT.RESCODEEXT.InvalidTaskCode.code
            }
            return response;
        }
        //name
        if (validation.isEmptyStr(getdataReq.name)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NINAME.name,
                responseCode: responcodeEXT.RESCODEEXT.NINAME.code
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
        } 
        // else if (!_.isEmpty(getdataReq.mobilePhoneNumber)) {
        //     response = {

        //         responseMessage: responcodeEXT.RESCODEEXT.InvalidMobileNumber.name + `, Mobile number is of type ` +
        //             `${typeof getdataReq.mobilePhoneNumber}` + ` but should be ` + dataType.DATATYPE.NUMBER.type,
        //         responseCode: responcodeEXT.RESCODEEXT.InvalidMobileNumber.code
        //     }
        //     return response;
        // }


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