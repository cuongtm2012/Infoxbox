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
import axios from 'axios';
import URI from '../../../shared/URI.js';
// const bodyGetAuthEContract = require('../../domain/bodyGetAuthEContract.body')
// const bodySendInformationEContract = require('../../domain/bodySubmitInformationEContract.body')
import BodyPostRiskScore from '../../domain/body_Post_RiskScore.body.js';
import bodyVmg_KYC_2 from '../../domain/bodyVmg_KYC_2.body.js';
// const httpClient = require('../../services/httpClient.service');
import { registerInterceptor } from 'axios-cached-dns-resolve';
const config = {
    disabled: process.env.AXIOS_DNS_DISABLE === 'true',
    dnsTtlMs: process.env.AXIOS_DNS_CACHE_TTL_MS || 5000, // when to refresh actively used dns entries (5 sec)
    cacheGraceExpireMultiplier: process.env.AXIOS_DNS_CACHE_EXPIRE_MULTIPLIER || 2, // maximum grace to use entry beyond TTL
    dnsIdleTtlMs: process.env.AXIOS_DNS_CACHE_IDLE_TTL_MS || 1000 * 60 * 60, // when to remove entry entirely if not being used (1 hour)
    backgroundScanMs: process.env.AXIOS_DNS_BACKGROUND_SCAN_MS || 2400, // how frequently to scan for expired TTL and refresh (2.4 sec)
    dnsCacheSize: process.env.AXIOS_DNS_CACHE_SIZE || 100, // maximum number of entries to keep in cache
    // pino logging options
    logging: {
        name: 'axios-cache-dns-resolve',
        // enabled: true,
        level: process.env.AXIOS_DNS_LOG_LEVEL || 'info', // default 'info' others trace, debug, info, warn, error, and fatal
        // timestamp: true,
        prettyPrint: process.env.NODE_ENV === 'DEBUG' || false,
        useLevelLabels: true,
    },
}
const axiosClient = axios.create(config);
registerInterceptor(axiosClient);
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

        let resK2 = {};
        let bodyRiskScore = new BodyPostRiskScore(test);
        const resRiskScore = axiosClient.post(URI.URL_VMG_DEV, bodyRiskScore , config).then(
            async result => {
                console.log(result.data);
                let bodyK2 = new bodyVmg_KYC_2(test.natId);
                resK2 = await axiosClient.post(URI.URL_VMG_DEV, bodyK2, config).then(
                    value => {
                        return value.data;
                        // console.log(value.data);
                        // return res.status(200).send(value.data);
                    }
                ).catch(reason => {
                    console.log(reason);
                    return res.status(500).send(reason.toString())
                });
                return result.data;
            }
        ).catch(reason => {
            console.log(reason);
            return res.status(500).send(reason.toString());
        });


        const resRisk = {
            resK2,
            resRiskScore
        };
        console.log(resRisk);
        return res.end();
    } catch (err) {
        console.log(err);
        return res.status(500).json({error: err.toString()});
    }
};
