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
const statusContractUrl = 'https://'+IP_TEST+':3000/contract/FTN_GAS_RQST?fiCode=B100000011&taskCode=FTN_GAS_RQST&alias=hop_dong_nice_test_0112';

axios.get(statusContractUrl, config).then(
	     result => {
	         countNextTimeCron('statusContractUrl');
	     }
	     ).catch((error) => {
             countNextTimeCron('statusContractUrl');
            return console.log(error.toString());
        });

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

let mainScore_URL = 'https://'+IP_TEST+':3000/external/RCS_M01_RQST';

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
const urlSimpleLimit = 'https://'+IP_TEST+':3000/external/OKF_SPL_RQST';
        axios.post(urlSimpleLimit, bodySimpleLimit, config).then(
            result => {
                countNextTimeCron('urlSimpleLimit');
            }
        ).catch((error) => {
            countNextTimeCron('errSimpleLimit');
                return console.log(error.toString());
        });

let nfScore_URL = 'https://'+IP_TEST+':3000/external/OKF_SCO_RQST';
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
        });


const urlCreateContract = 'https://'+IP_TEST+':3000/contract/FTN_SCD_RQST';
const bodyCreateContract = {
    "fiSessionKey": "",
    "fiCode": "B100000011",
    "taskCode": "FTN_SCD_RQST",
    "templateId": "0000124ef8M8UdJR8z58wsRl",
    "alias": "hop_dong_nice_test_0112",
    "syncType": "sync",
    "datas": [
        {
            "id": "envName",
            "name": "Há»£p Ä‘á»“ng NiceTest",
            "type": "header_fields",
            "value": "Há»£p Ä‘á»“ng NiceTest",
            "owner": "envelope_hdr",
            "dataType": "String",
            "required": true
        },
        {
            "id": "envNo",
            "name": "0000001",
            "type": "header_fields",
            "value": "",
            "owner": "envelope_hdr",
            "dataType": "String",
            "required": false
        },
        {
            "id": "envDate",
            "name": "NgÃ y kÃ½",
            "type": "header_fields",
            "value": "2021-01-12T05:00:00.000Z",
            "owner": "envelope_hdr",
            "dataType": "Date",
            "required": false
        },
        {
            "id": "envSubmittedFrom",
            "name": " Ä�Æ°á»£c gá»­i tá»« :  ",
            "type": "header_fields",
            "value": "/496/517",
            "owner": "envelope_hdr",
            "dataType": "String",
            "required": false
        },
        {
            "id": "p_001",
            "name": "name_party",
            "type": "p",
            "value": "NICE Viet Nam",
            "owner": "party",
            "dataType": "String",
            "required": true
        },
        {
            "id": "p_001_r_001",
            "name": "name_recipient",
            "type": "r",
            "value": "Mai Anh Tuáº¥n",
            "owner": "recipient",
            "dataType": "String",
            "required": true
        },
        {
            "id": "p_001_r_001",
            "name": "mail_recipient",
            "type": "m",
            "value": "tuanma@nicegroup.com.vn",
            "owner": "recipient",
            "dataType": "String",
            "required": false
        },
        {
            "id": "p_001_r_001",
            "name": "phone_recipient",
            "type": "phone",
            "value": null,
            "owner": "recipient",
            "dataType": "String",
            "required": false
        },
        {
            "id": "p_001_r_001",
            "name": "contact_recipient",
            "type": "contactId",
            "value": null,
            "owner": "recipient",
            "dataType": "String",
            "required": false
        },
        {
            "id": "p_002",
            "name": "name_party",
            "type": "p",
            "value": "BÃŠN B: BÃŠN VAY",
            "owner": "party",
            "dataType": "String",
            "required": true
        },
        {
            "id": "p_002_r_002",
            "name": "name_recipient",
            "type": "r",
            "value": "Mr.Han",
            "owner": "recipient",
            "dataType": "String",
            "required": true
        },
        {
            "id": "p_002_r_002",
            "name": "mail_recipient",
            "type": "m",
            "value": "jhhan@nicegroup.com.vn",
            "owner": "recipient",
            "dataType": "String",
            "required": false
        },
        {
            "id": "p_002_r_002",
            "name": "phone_recipient",
            "type": "phone",
            "value": null,
            "owner": "recipient",
            "dataType": "String",
            "required": false
        },
        {
            "id": "p_002_r_002",
            "name": "contact_recipient",
            "type": "contactId",
            "value": null,
            "owner": "recipient",
            "dataType": "String",
            "required": false
        },
        {
            "id": "p_003",
            "name": "name_party",
            "type": "p",
            "value": "BÃŠN C: OK VAY",
            "owner": "party",
            "dataType": "String",
            "required": true
        },
        {
            "id": "p_003_r_003",
            "name": "name_recipient",
            "type": "r",
            "value": "OK Vay Tuan ky",
            "owner": "recipient",
            "dataType": "String",
            "required": true
        },
        {
            "id": "p_003_r_003",
            "name": "mail_recipient",
            "type": "m",
            "value": "tuanmait@gmail.com",
            "owner": "recipient",
            "dataType": "String",
            "required": false
        },
        {
            "id": "p_003_r_003",
            "name": "phone_recipient",
            "type": "phone",
            "value": null,
            "owner": "recipient",
            "dataType": "String",
            "required": false
        },
        {
            "id": "p_003_r_003",
            "name": "contact_recipient",
            "type": "contactId",
            "value": null,
            "owner": "recipient",
            "dataType": "String",
            "required": false
        },
        {
            "id": "0dd8f8413034a26bb50",
            "name": "fullnameA",
            "type": "ff",
            "value": "Mai Anh Tuáº¥n",
            "owner": "requester",
            "dataType": "String",
            "required": false
        },
        {
            "id": "d6d53b64ed768c59eca",
            "name": "fullnameB",
            "type": "ff",
            "value": "Ä�á»— VÄƒn Han",
            "owner": "requester",
            "dataType": "String",
            "required": false
        },
        {
            "id": "edc5c854ad5e38c7f94",
            "name": "addressC",
            "type": "ff",
            "value": "54 Liá»…u Giai, Ba Ä�Ã¬nh, HÃ  Ná»™i",
            "owner": "requester",
            "dataType": "String",
            "required": false
        },
        {
            "id": "dueDays",
            "name": "due_in_days",
            "type": "due_days",
            "value": "30",
            "owner": "envelope",
            "dataType": "Number",
            "required": false
        }
    ]
}

axios.post(urlCreateContract, bodyCreateContract, config).then(
        result => {
            countNextTimeCron("urlCreateContract");
        }
    ).catch((error) => {
        countNextTimeCron(1);
        return console.log(error.toString());
    });

        function countNextTimeCron(any) {
            times++;
            console.log(times , ' : ',  any);
            if (times === 4) {
               oncomplete(0 , 0);
            }
        }
    }
}