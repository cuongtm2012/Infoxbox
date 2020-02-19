const _ = require('lodash');

const responcodeEXT = require('../../shared/constant/responseCodeExternal');
const dateUtil = require('../util/dateutil');

module.exports = {
    checkParamRequestForResponse: function (getdataReq) {
        var response;

        if (10 < getdataReq.fiCode.length) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.FiCodeOverLength.name,
                responseCode: responcodeEXT.RESCODEEXT.FiCodeOverLength.code
            }
            return response;
        }
        if (_.isEmpty(getdataReq.fiCode)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NIFICODE.name,
                responseCode: responcodeEXT.RESCODEEXT.NIFICODE.code
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
        if (!dateUtil.validDateAndCurrentDate(getdataReq.searchDateFrom, getdataReq.searchDateTo)) {
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