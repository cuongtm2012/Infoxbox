// const validRequest = require('../../util/validateRequestSendingDataContractFPT');
// const common_service = require('../../services/common.service');
// const responCode = require('../../../shared/constant/responseCodeExternal');
// const PreResponse = require('../../domain/preResponse.response');
// const DataSaveToInqLog = require('../../domain/data_FptId_Save_To_InqLog.save');
// const cicExternalService = require('../../services/cicExternal.service');
// const logger = require('../../config/logger');
// const sendingDataFPTContractResponse = require('../../domain/sendingContractFPT.response')
// const dateutil = require('../../util/dateutil');
// const util = require('../../util/dateutil');
// const _ = require('lodash');
// const validS11AService = require('../../services/validS11A.service');
// const utilFunction = require('../../../shared/util/util');
// const dataSendingDataFptContractSaveToScrapLog = require('../../domain/dataSendingDataFptContractSaveToScrapLog.save');
import {axiosPost} from '../../services/httpClient.service.js';
// const bodyGetAuthEContract = require('../../domain/bodyGetAuthEContract.body')
// const bodySendInformationEContract = require('../../domain/bodySubmitInformationEContract.body')
import BodyPostRiskScore from '../../domain/body_Post_RiskScore.body.js';
import bodyVmg_KYC_2 from '../../domain/bodyVmg_KYC_2.body.js';
import URI from '../../../shared/URI.js';
export function sendingContractData(req, res) {
    try {
        const config = {
            headers: {
                'Content-Type': 'application/json'
            },
            timeout: 60 * 10000
        }
        const test = {
            mobilePhoneNumber: '0964785596',
            natId: '001096002249'
        }
        let bodyRiskScore = new BodyPostRiskScore(test);
        axiosPost(URI.URL_VMG_DEV, bodyRiskScore , config).then(
            result => {
                let bodyK2 = new bodyVmg_KYC_2(test.natId);
                axiosPost(URI.URL_VMG_DEV, bodyK2, config).then(
                    value => {
                        console.log('ok')
                        return res.status(200).send('ok');
                    }
                ).catch(reason => {
                    console.log(reason);
                    return res.status(500).send(reason.toString())
                });
            }
        ).catch(reason => {
            console.log(reason);
            return res.status(500).send(reason.toString());
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: err.toString()});
    }
};
