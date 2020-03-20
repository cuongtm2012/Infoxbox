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
const DataInqLogSave = require('../domain/INQLOG.save');
const utilFunction = require('../../shared/util/util');
const responCode = require('../../shared/constant/responseCodeExternal');

exports.cicProcStat = function (req, res) {
    try {
        const getdataReq = new CicProStat(req.body);

		/*
		* Checking parameters request
		* Request data
		*/
        let rsCheck = validParam.checkParamRequestForResponse(getdataReq);
        let preResponse, responseData, dataInqLogSave;

        if (!_.isEmpty(rsCheck)) {
            let preResponse = {
                responseTime: dateutil.timeStamp(),
                responseCode: rsCheck.responseCode,
                responseMessage: rsCheck.responseMessage
            }

            responseData = new CICProcStatRes(getdataReq, preResponse);
            // update INQLOG
            dataInqLogSave = new DataInqLogSave(getdataReq, responseData.responseCode);
            cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                console.log('insert INQLOG:', r);
            });
            return res.status(200).json(responseData);
        }
        validS11AService.selectFiCode(req.body.fiCode, '%%').then(dataFICode => {
            if (_.isEmpty(dataFICode)) {
                preResponse = new PreResponse(responcodeEXT.RESCODEEXT.InvalidNiceProductCode.name, '', dateutil.timeStamp(), responcodeEXT.RESCODEEXT.InvalidNiceProductCode.code);

                responseData = new CICProcStatRes(req.body, preResponse);
                // update INQLOG
                dataInqLogSave = new DataInqLogSave(getdataReq, responseData.responseCode);
                cicExternalService.insertINQLOG(dataInqLogSave).then((r) => {
                    console.log('insert INQLOG:', r);
                });
                return res.status(200).json(responseData);
            }
            else if (_.isEmpty(dataFICode[0]) && utilFunction.checkStatusCodeScraping(responCode.OracleError, utilFunction.getOracleCode(dataFICode))) {
                preResponse = new PreResponse(responCode.RESCODEEXT.ErrorDatabaseConnection.name, '', dateutil.timeStamp(), responCode.RESCODEEXT.ErrorDatabaseConnection.code);

                responseData = new CICProcStatRes(req.body, preResponse);
               
                return res.status(500).json(responseData);
            }
            //End check params request

            cicExternalService.selectProcStatus(getdataReq, res).then(reslt => {
                console.log("result selectProcStatus: ", reslt);
                var cicReportStatus = [];
                if (!_.isEmpty(reslt)) {
                    let responseSuccess = new PreResponse(responcodeEXT.RESCODEEXT.NORMAL.name, '', dateutil.timeStamp(), responcodeEXT.RESCODEEXT.NORMAL.code);
                    _.forEach(reslt, res => {
                        let responseData = new preProStatRes(res);
                        cicReportStatus.push(responseData);
                    });
                    let countResult = reslt.length;
                    responseData = new CICProcStatRes(getdataReq, responseSuccess, countResult, cicReportStatus);

                } else {
                    let responseUnknow = new PreResponse(responcodeEXT.RESCODEEXT.UNKNOW.name, '', dateutil.timeStamp(), responcodeEXT.RESCODEEXT.UNKNOW.code);
                    responseData = new CICProcStatRes(getdataReq, responseUnknow);
                }

                // update INQLOG
                dataInqLogSave = new DataInqLogSave(getdataReq, responseData.responseCode);
                cicExternalService.insertINQLOG(dataInqLogSave).then(() => {
                    return res.status(200).json(responseData);
                });
            });
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.toString() });
    }
};
