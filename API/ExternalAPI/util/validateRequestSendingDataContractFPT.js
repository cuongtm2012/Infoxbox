import responcodeEXT from '../../shared/constant/responseCodeExternal.js';
import _ from 'lodash';
const validateSendingContract = {
    checkParamRequest: function (getDataReq) {
        var response;
        //fiSessionKey, appNumber
        if (!_.isEmpty(getDataReq.fiSessionKey) && 20 < getDataReq.fiSessionKey.length) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.FISessionKeyOverLength.name,
                responseCode: responcodeEXT.RESCODEEXT.FISessionKeyOverLength.code
            }
            return response;
        }
        // fiCode
        if (_.isEmpty(getDataReq.fiCode)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NIFICODE.name,
                responseCode: responcodeEXT.RESCODEEXT.NIFICODE.code
            }
            return response;
        }
        if (10 < getDataReq.fiCode.length) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.FiCodeOverLength.name,
                responseCode: responcodeEXT.RESCODEEXT.FiCodeOverLength.code
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
        if (!_.isEqual(responcodeEXT.TaskCode.FTN_SCD_RQST.code, getDataReq.taskCode)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.InvalidTaskCode.name,
                responseCode: responcodeEXT.RESCODEEXT.InvalidTaskCode.code
            }
            return response;
        }
        if (30 < getDataReq.taskCode.length) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.TaskCodeOverLength.name,
                responseCode: responcodeEXT.RESCODEEXT.TaskCodeOverLength.code
            }
            return response;
        }
        //    TemplateID
        if (_.isEmpty(getDataReq.templateId)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NITEMPLATEID.name,
                responseCode: responcodeEXT.RESCODEEXT.NITEMPLATEID.code
            }
            return response;
        }
        //    alias
        if (_.isEmpty(getDataReq.alias)) {
            response = {
                responseMessage: responcodeEXT.RESCODEEXT.NIALIAS.name,
                responseCode: responcodeEXT.RESCODEEXT.NIALIAS.code
            }
            return response;
        }
        else
            response = {};

        return response;
    }
};

export default validateSendingContract;