const _ = require('lodash');
const CicProStat = require('../domain/CIC_PROC_STAT.req.response');
const validParam = require('../util/validRequestProcStat');
const CICProcStatRes = require('../domain/CIC_PROC_STAT.response');
const cicExternalService = require('../services/cicExternal.service');
const preProStatRes = require('../domain/procStatus/preProStatus.response');
const dateutil = require('../util/dateutil');
const responcodeEXT = require('../../shared/constant/responseCodeExternal');
const validS11AService = require('../services/validS11A.service');
const PreResponse = require('../domain/preResponse.response');

exports.cicProcStat = function (req, res) {
    try {
        const getdataReq = new CicProStat(req.body);

		/*
		* Checking parameters request
		* Request data
		*/
        let rsCheck = validParam.checkParamRequestForResponse(getdataReq);
        let preResponse, responseData;

        if (!_.isEmpty(rsCheck)) {
            let preResponse = {
                responseTime: dateutil.timeStamp(),
                responseCode: rsCheck.responseCode,
                responseMessage: rsCheck.responseMessage
            }

            let responseData = new CICProcStatRes(getdataReq, preResponse);
            return res.status(200).json(responseData);
        }
        validS11AService.selectFiCode(req.body.fiCode, '%%').then(dataFICode => {
            if (_.isEmpty(dataFICode)) {
                preResponse = new PreResponse(responcodeEXT.RESCODEEXT.IVFICODE.name, '', dateutil.timeStamp(), responcodeEXT.RESCODEEXT.IVFICODE.code);

                responseData = new CICProcStatRes(req.body, preResponse);
                return res.status(200).json(responseData);
            }
            //End check params request

            cicExternalService.selectProcStatus(getdataReq, res).then(reslt => {
                console.log("result selectProcStatus: ", reslt);
                var responseDataFinal;
                var cicReportStatus = [];

                let responseSuccess = new PreResponse(responcodeEXT.RESCODEEXT.NORMAL.name, '', dateutil.timeStamp(), responcodeEXT.RESCODEEXT.NORMAL.code);
                let responseUnknow = new PreResponse(responcodeEXT.RESCODEEXT.UNKNOW.name, '', dateutil.timeStamp(), responcodeEXT.RESCODEEXT.UNKNOW.code);


                if (!_.isEmpty(reslt)) {
                    _.forEach(reslt, res => {
                        let responseData = new preProStatRes(res);
                        cicReportStatus.push(responseData);
                    });
                    let countResult = reslt.length;
                    responseDataFinal = new CICProcStatRes(getdataReq, responseSuccess, countResult, cicReportStatus);

                    return res.status(200).json(responseDataFinal);
                } else {
                    let responseData = new CICProcStatRes(getdataReq, responseUnknow);
                    return res.status(400).json(responseData);
                }
            });
        });

    } catch (error) {
        console.log(error);
    }
};
