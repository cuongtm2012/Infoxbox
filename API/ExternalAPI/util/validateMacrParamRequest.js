import validation from '../../shared/util/validation.js';
import responcodeEXT from '../../shared/constant/responseCodeExternal.js';
import checkContains from '../../shared/util/checkcontains.js';
import _ from 'lodash';
import dateUtil from '../util/dateutil.js';
import util from '../../shared/util/util.js';

function checkMacrParamRequest(getdataReq) {
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
    } else if (!util.validPhoneNumber(getdataReq.mobilePhoneNumber)) {
        response = {
            responseMessage: responcodeEXT.RESCODEEXT.InvalidMobileNumber.name,
            responseCode: responcodeEXT.RESCODEEXT.InvalidMobileNumber.code
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

export default checkMacrParamRequest;