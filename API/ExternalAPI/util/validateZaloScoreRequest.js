const responcodeEXT = require('../../shared/constant/responseCodeExternal');
const _ = require('lodash');

module.exports = {
    checkParamRequest: function (getDataReq) {
        var response;
        //fiSessionKey

        // fiCode
        if (_.isEmpty(getDataReq.fiCode)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NIFICODE.name,
                responseCode: responcodeEXT.RESCODEEXT.NIFICODE.code
            }
            return response;
        }
        // Task code
        if (_.isEmpty(getDataReq.taskCode)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NITASKCODE.name,
                responseCode: responcodeEXT.RESCODEEXT.NITASKCODE.code
            }
            return response;
        }
        if (!_.isEqual(responcodeEXT.TaskCode.ZALO_SCR_RQST.code, getDataReq.taskCode)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.InvalidTaskCode.name,
                responseCode: responcodeEXT.RESCODEEXT.InvalidTaskCode.code
            }
            return response;
        }
    //    phone number
        if (_.isEmpty(getDataReq.mobilePhoneNumber)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NIMOBILEPHONENUMBER.name,
                responseCode: responcodeEXT.RESCODEEXT.NIMOBILEPHONENUMBER.code
            }
            return  response;
        }
    //    score product
        if (_.isEmpty(getDataReq.scoreProduct)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NISCOREPRODUCT.name,
                responseCode: responcodeEXT.RESCODEEXT.NISCOREPRODUCT.code
            }
        }

        else
            response = {};

        return response;
    }
};
