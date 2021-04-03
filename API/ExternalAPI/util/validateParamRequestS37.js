import validdate from '../../shared/util/validation.js';

import responcodeEXT from '../../shared/constant/responseCodeExternal.js';

import checkContains from '../../shared/util/checkcontains.js';
import _ from 'lodash';
import dateUtil from '../util/dateutil.js';
import isBase64 from 'is-base64';

export function checkParamRequest(getdataReq) {
    var response;

    //fiSessionKey
    if (20 < getdataReq.fiSessionKey.length) {
        response = {
            responseMessage: responcodeEXT.RESCODEEXT.FISessionKeyOverLength.name,
            responseCode: responcodeEXT.RESCODEEXT.FISessionKeyOverLength.code
        }
        return response;
    }

    // fiCode
    if (_.isEmpty(getdataReq.fiCode)) {
        response = {
            responseMessage: responcodeEXT.RESCODEEXT.NIFICODE.name,
            responseCode: responcodeEXT.RESCODEEXT.NIFICODE.code
        }
        return response;
    }
    if (10 < getdataReq.fiCode.length) {
        response = {
            responseMessage: responcodeEXT.RESCODEEXT.FiCodeOverLength.name,
            responseCode: responcodeEXT.RESCODEEXT.FiCodeOverLength.code
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
    if (30 < getdataReq.taskCode.length) {
        response = {
            responseMessage: responcodeEXT.RESCODEEXT.TaskCodeOverLength.name,
            responseCode: responcodeEXT.RESCODEEXT.TaskCodeOverLength.code
        }
        return response;
    }
    if (!_.isEqual(responcodeEXT.TaskCode.CIC_S37_RQST.code, getdataReq.taskCode)) {
        response = {
            responseMessage: responcodeEXT.RESCODEEXT.InvalidTaskCode.name,
            responseCode: responcodeEXT.RESCODEEXT.InvalidTaskCode.code
        }
        return response;
    }
    //LoginID
    if (validdate.isEmptyStr(getdataReq.loginId)) {
        response = {
            responseMessage: responcodeEXT.RESCODEEXT.NILOGINID.name,
            responseCode: responcodeEXT.RESCODEEXT.NILOGINID.code
        }
        return response;
    }
    //LoginPass
    if (validdate.isEmptyStr(getdataReq.loginPw)) {
        response = {
            responseMessage: responcodeEXT.RESCODEEXT.NIPASSWORD.name,
            responseCode: responcodeEXT.RESCODEEXT.NIPASSWORD.code
        }
        return response;
    }
    if (!isBase64(getdataReq.loginPw)) {
        response = {
            responseMessage: responcodeEXT.RESCODEEXT.ErrorDecryptError.name,
            responseCode: responcodeEXT.RESCODEEXT.ErrorDecryptError.code
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
    if (!checkContains.contains.call(responcodeEXT.InfoProvConcent, getdataReq.infoProvConcent.toUpperCase())) {
        response = {
            responseMessage: responcodeEXT.RESCODEEXT.ConsentProvisionIsNotValid.name,
            responseCode: responcodeEXT.RESCODEEXT.ConsentProvisionIsNotValid.code
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