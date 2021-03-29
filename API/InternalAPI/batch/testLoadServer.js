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

//OKF_SPL_RQST,,OKF_SCO_RQST

let times = 0
const statusContractUrl = 'https://'+IP_TEST+':3100/contract/FTN_GAS_RQST?fiCode=B100000011&taskCode=FTN_GAS_RQST&alias=hop_dong_nice_test_0112';

axios.get(statusContractUrl, config).then(
	     result => {
	         countNextTimeCron('statusContractUrl');
	     }
	     ).catch((error) => {
             countNextTimeCron('statusContractUrl');
            return console.log(error.toString());
        });

/*

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

let mainScore_URL = 'https://'+IP_TEST+':3100/external/RCS_M01_RQST';

		//RCS_M01_RQST
		axios.post(mainScore_URL, mainscorePro, config).then(
            result => {
                countNextTimeCron('mainscorePro: ' + result.data.responseCode);
            }
        ).catch((error) => {
            countNextTimeCron('mainscorePro: ' + error.toString());
            return console.log(error.toString());
        });

const bodySimpleLimit = {
    "fiSessionKey": "SPL2021020800002",
    "fiCode": "B100000011",
    "taskCode": "OKF_SPL_RQST",
    "customerNumber": "CUST0000001001",
    "name": "NICE TEST",
    "sex": "F",
    "mobilePhoneNumber": "0966606850",
    "natId": "035081004224",
    "salary": "5000000",
    "joinYearMonth": "201905",
    "infoProvConcent": "Y"
}
const urlSimpleLimit = 'https://'+IP_TEST+':3100/external/OKF_SPL_RQST';
        axios.post(urlSimpleLimit, bodySimpleLimit, config).then(
            result => {
                countNextTimeCron('urlSimpleLimit');
            }
        ).catch((error) => {
            countNextTimeCron('errSimpleLimit');
                return console.log(error.toString());
        });

let nfScore_URL = 'https://'+IP_TEST+':3100/external/OKF_SCO_RQST';
let NfscorePro = {
            "appNumber": "R9000000000010",
            "fiCode": "B100000011",
            "taskCode": "OKF_SCO_RQST",
            "customerNumber": "C2000000000004",
            "scoreProduct": "NOK100_001",
            "mobilePhoneNumber": "0966606850",
            "natId": "035081004224",
            "infoProvConcent": "Y"
        }
axios.post(nfScore_URL, NfscorePro, config).then(
            result => {
                countNextTimeCron('NfscorePro: ' + result.data.responseCode);
            }
        ).catch((error) => {
            countNextTimeCron('NfscorePro: ' + error.toString());
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