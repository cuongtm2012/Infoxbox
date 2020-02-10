const _ = require('lodash');

const responcodeEXT = require('../../shared/constant/responseCodeExternal');

module.exports = {
    checkParamRequestForResponse: function (getdataReq) {
        var response;

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
        else
            response = {};

        return response;

    }
};