const cicService = require('../services/cicInternal.service');
const URI = require('../../shared/URI');
const defaultParams = require('../../shared/domain/defaultParams.request');
const _ = require('lodash');
const convertBase64 = require('../../shared/util/convertBase64ToText');

const cicB0003Req = require('../domain/cicB0003.request');

const axios = require('axios');

const runRestartPm2 = require('../util/runShellScript');
const cicDeplayReportService = require('../services/cicDelayReport.service');
const io = require('socket.io-client');
const dateutil = require('../util/dateutil');

module.exports = class TestLoadServer {
    //Cron request internal scraping
    cron(oncomplete) {

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }, timeout: 60 * 1000
        }
let IP_TEST = '103.112.124.153'
let mainscorePro = {
    "appNumber":"",
	"fiCode":"B100000011",
	"taskCode":"RCS_M01_RQST",
    "customerNumber": "",
    "productCode": "",
    "nfNiceSessionKey":"S201220210201154224404124",
	"cicNiceSessionKey":"S100320200414132945901123",
    "mobilePhoneNumber":"0964785596",
    "natId": "173300769",
    "infoProvConcent": "Y"
}
let times = 0
const statusContractUrl = 'https://'+IP_TEST+':3100/contract/FTN_GAS_RQST?fiCode=B100000011&taskCode=FTN_GAS_RQST&alias=hop_dong_nice_test_0112';
let mainScore_URL = 'https://'+IP_TEST+':3100/external/RCS_M01_RQST';

axios.post(mainScore_URL, mainscorePro, config).then(
            result => {
                countNextTimeCron('mainscorePro: ' + result.data.responseCode);
            }
        ).catch((error) => {
            countNextTimeCron('mainscorePro: ' + error.toString());
            return console.log(error.toString());
        });
/*
axios.get(statusContractUrl, config).then(
     result => {
         countNextTimeCron('statusContractUrl');
     }
     ).catch((error) => {
             countNextTimeCron('statusContractUrl');
            return console.log(error.toString());
        });*/


        function countNextTimeCron(any) {
            times++;
            console.log(times , ' : ',  any);
            if (times === 1) {
               oncomplete(0 , 0);
            }
        }
    }
}