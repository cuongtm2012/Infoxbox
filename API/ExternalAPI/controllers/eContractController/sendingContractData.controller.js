const validRequest = require('../../util/validateRequestSendingDataContractFPT');
const common_service = require('../../services/common.service');
const responCode = require('../../../shared/constant/responseCodeExternal');
const PreResponse = require('../../domain/preResponse.response');
const DataSaveToInqLog = require('../../domain/data_FptId_Save_To_InqLog.save');
const cicExternalService = require('../../services/cicExternal.service');
const logger = require('../../config/logger');
const sendingDataFPTContractResponse = require('../../domain/sendingContractFPT.response')
const dateutil = require('../../util/dateutil');
const util = require('../../util/dateutil');
const _ = require('lodash');
const validS11AService = require('../../services/validS11A.service');
const utilFunction = require('../../../shared/util/util');
const dataSendingDataFptContractSaveToScrapLog = require('../../domain/dataSendingDataFptContractSaveToScrapLog.save');
const axios = require('axios');
const URI = require('../../../shared/URI');
const bodyGetAuthEContract = require('../../domain/bodyGetAuthEContract.body')
const bodySendInformationEContract = require('../../domain/bodySubmitInformationEContract.body')
const BodyPostRiskScore = require('../../domain/body_Post_RiskScore.body');
const bodyVmg_KYC_2 = require('../../domain/bodyVmg_KYC_2.body');
exports.sendingContractData = function (req, res) {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 60 * 1000
        }
        const test = {
            mobilePhoneNumber: '0964785596',
            natId: '001096002249'
        }
        let bodyRiskScore = new BodyPostRiskScore(test);
        axios.post(URI.URL_VMG_DEV, bodyRiskScore, config).then(
            result => {
                console.log(result.data);
                let bodyK2 = new bodyVmg_KYC_2(test.natId);
                axios.post(URI.URL_VMG_DEV, bodyK2, config).then(
                    value => {
                        console.log(value.data);
                        return res.status(200).send(value.data);
                    }
                ).catch(reason => {
                    console.log(reason.toString());
                    return res.status(500).send(reason.toString())
                })
            }
        ).catch(reason => {
            console.log(reason.toString());
            return res.status(500).send(reason.toString());
        })
    } catch (err) {
        logger.error(err.toString());
        return res.status(500).json({error: err.toString()});
    }
}