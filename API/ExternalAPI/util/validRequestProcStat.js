import _ from 'lodash';

import responcodeEXT from '../../shared/constant/responseCodeExternal.js';
import dateUtil from '../util/dateutil.js';
import util from '../../shared/util/util.js';

function checkParamRequestForResponse(getdataReq) {
    var response;

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
    if (_.isEmpty(getdataReq.taskCode)) {
        response = {
            responseMessage: responcodeEXT.RESCODEEXT.NITASKCODE.name,
            responseCode: responcodeEXT.RESCODEEXT.NITASKCODE.code
        }
        return response;
    }
    if (!_.isEqual(responcodeEXT.TaskCode.CIC_PROC_STAT.code, getdataReq.taskCode)) {
        response = {
            responseMessage: responcodeEXT.RESCODEEXT.InvalidTaskCode.name,
            responseCode: responcodeEXT.RESCODEEXT.InvalidTaskCode.code
        }
        return response;
    }
    if (_.isEmpty(getdataReq.searchDateFrom)) {
        response = {
            responseMessage: responcodeEXT.RESCODEEXT.SearchDateFrom.name,
            responseCode: responcodeEXT.RESCODEEXT.SearchDateFrom.code
        }
        return response;
    }
    if (_.isEmpty(getdataReq.searchDateTo)) {
        response = {
            responseMessage: responcodeEXT.RESCODEEXT.SearchDateTo.name,
            responseCode: responcodeEXT.RESCODEEXT.SearchDateTo.code
        }
        return response;
    }
    // valid inquiryDate less than today
    if (!(util.validNumber(getdataReq.searchDateFrom)) || !(util.validNumber(getdataReq.searchDateTo))) {
        response = {
            responseMessage: responcodeEXT.RESCODEEXT.DateFieldTypeError.name,
            responseCode: responcodeEXT.RESCODEEXT.DateFieldTypeError.code
        }
        return response;
    }
    if (!dateUtil.validDateAndCurrentDate(getdataReq.searchDateFrom, getdataReq.searchDateTo)) {
        response = {
            responseMessage: responcodeEXT.RESCODEEXT.INQDateInvalid.name,
            responseCode: responcodeEXT.RESCODEEXT.INQDateInvalid.code
        }
        return response;
    }
    if (!dateUtil.validFromDateEarlier93Days(getdataReq.searchDateFrom)) {
        response = {
            responseMessage: responcodeEXT.RESCODEEXT.SearchDateFromEarlier93Days.name,
            responseCode: responcodeEXT.RESCODEEXT.SearchDateFromEarlier93Days.code
        }
        return response;
    }
    // maximum maxnumrows <= 100
    if (!_.isEmpty(getdataReq.maxnumrows) && 100 < getdataReq.maxnumrows) {
        response = {
            responseMessage: responcodeEXT.RESCODEEXT.OverMaxnumrows.name,
            responseCode: responcodeEXT.RESCODEEXT.OverMaxnumrows.code
        }
        return response;
    }

    else
        response = {};

    return response;

}

export default checkParamRequestForResponse;