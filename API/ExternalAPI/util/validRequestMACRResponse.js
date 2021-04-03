import validation from '../../shared/util/validation.js';

import responcodeEXT from '../../shared/constant/responseCodeExternal.js';
import dateUtil from '../util/dateutil.js';
import _ from 'lodash';

function checkParamRequestForResponse(getdataReq) {
    var response;

    //nicesessionkey
    if (validation.isEmptyStr(getdataReq.niceSessionKey)) {
        response = {
            responseMessage: responcodeEXT.RESCODEEXT.NINICESESSIONKEY.name,
            responseCode: responcodeEXT.RESCODEEXT.NINICESESSIONKEY.code
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
    //taskcode
    if (validation.isEmptyStr(getdataReq.taskCode)) {
        response = {
            responseMessage: responcodeEXT.RESCODEEXT.NITASKCODE.name,
            responseCode: responcodeEXT.RESCODEEXT.NITASKCODE.code
        }
        return response;
    }
    if (!(_.isEqual(responcodeEXT.TaskCode.CIC_MACR_RSLT.code, getdataReq.taskCode))) {
        response = {
            responseMessage: responcodeEXT.RESCODEEXT.InvalidTaskCode.name,
            responseCode: responcodeEXT.RESCODEEXT.InvalidTaskCode.code
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

export default checkParamRequestForResponse;