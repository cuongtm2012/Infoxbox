const _ = require('lodash');
const CicProStat = require('../domain/CIC_PROC_STAT.req.response');
const validParam = require('../util/validRequestProcStat');
const CICProcStatRes = require('../domain/CIC_PROC_STAT.response');
const cicExternalService = require('../services/cicExternal.service');
const preProStatRes = require('../domain/procStatus/preProStatus.response');
const dateutil = require('../util/dateutil');
const responcodeEXT = require('../../shared/constant/responseCodeExternal');

exports.cicProcStat = function (req, res) {
    try {
        const getdataReq = new CicProStat(req.body);

		/*
		* Checking parameters request
		* Request data
		*/
        let rsCheck = validParam.checkParamRequestForResponse(getdataReq);

        if (!_.isEmpty(rsCheck)) {
            let preResponse = {
                responseTime: dateutil.timeStamp(),
                responseCode: rsCheck.responseCode,
                responseMessage: rsCheck.responseMessage
            }

            let responseData = new CICProcStatRes(getdataReq, preResponse);
            return res.status(200).json(responseData);
        }
        //End check params request

        cicExternalService.selectProcStatus(getdataReq, res).then(reslt => {
            console.log("result selectProcStatus: ", reslt);
            var responseDataFinal;
            var cicReportStatus = [];

            let response = {
                responseTime: dateutil.timeStamp(),
                responseMessage: responcodeEXT.RESCODEEXT.NORMAL.name,
                responseCode: responcodeEXT.RESCODEEXT.NORMAL.code
            }

            let responseUnknow = {
                responseTime: dateutil.timeStamp(),
                responseMessage: responcodeEXT.RESCODEEXT.UNKNOW.name,
                responseCode: responcodeEXT.RESCODEEXT.UNKNOW.code
            }

            if (!_.isEmpty(reslt)) {
                _.forEach(reslt, res => {
                    let responseData = new preProStatRes(res);
                    cicReportStatus.push(responseData);
                });
                let countResult = reslt.length;
                responseDataFinal = new CICProcStatRes(getdataReq, response, countResult, cicReportStatus);

                return res.status(200).json(responseDataFinal);
            } else {
                let responseData = new CICProcStatRes(getdataReq, responseUnknow);
                return res.status(400).json(responseData);
            }
        });

    } catch (error) {
        console.log(error);
    }
};
